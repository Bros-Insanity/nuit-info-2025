#!/usr/bin/env python3
import os
import email
import imaplib
import smtplib
import logging
from email.mime.text import MIMEText
from email.header import decode_header
from transformers import AutoTokenizer, AutoModelForCausalLM

IMAP_SERVER = os.getenv("IMAP_SERVER")
SMTP_SERVER = os.getenv("SMTP_SERVER")
IMAP_USER = os.getenv("IMAP_USER")
IMAP_PASS = os.getenv("IMAP_PASS")
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASS = os.getenv("SMTP_PASS")
MAILBOX = os.getenv("IMAP_MAILBOX", "INBOX")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
FROM_EMAIL = os.getenv("FROM_EMAIL", "ton-llm@ton-domaine.com")
SUBJECT_REPLY = "Réponse automatique par Qwen3"

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def load_qwen_model():
    """Charge le tokenizer et le modèle Qwen3."""
    try:
        logger.info("Chargement du modèle Qwen3...")
        tokenizer = AutoTokenizer.from_pretrained("Qwen/Qwen3-0.6B")
        model = AutoModelForCausalLM.from_pretrained(
            "Qwen/Qwen3-0.6B",
            device_map="auto"
        )
        model.eval()
        logger.info("Modèle Qwen3 chargé avec succès.")
        return tokenizer, model
    except Exception as e:
        logger.error(f"Erreur lors du chargement du modèle : {e}", exc_info=True)
        raise

def fetch_emails():
    """Se connecte au serveur IMAP et récupère les emails non lus."""
    if not all([IMAP_SERVER, IMAP_USER, IMAP_PASS]):
        logger.error("Configuration IMAP incomplète. Impossible de se connecter.")
        return []

    emails_to_process = []
    try:
        mail = imaplib.IMAP4_SSL(IMAP_SERVER)
        mail.login(IMAP_USER, IMAP_PASS)
        mail.select(MAILBOX)

        status, messages = mail.search(None, 'UNSEEN')
        message_ids = messages[0].split()

        logger.info(f"Emails non lus trouvés : {len(message_ids)}")

        for num in message_ids:
            status, data = mail.fetch(num, '(RFC822)')
            if status == 'OK':
                msg = email.message_from_bytes(data[0][1])
                emails_to_process.append((num, msg))
        mail.logout()

    except Exception as e:
        logger.error(f"Erreur lors de la récupération des emails: {e}", exc_info=True)

    return emails_to_process

def mark_email_as_seen(uid):
    try:
        mail = imaplib.IMAP4_SSL(IMAP_SERVER)
        mail.login(IMAP_USER, IMAP_PASS)
        mail.select(MAILBOX)
        mail.store(uid, '+FLAGS', '\\Seen')
        mail.logout()
        logger.info(f"Email {uid} marqué comme lu.")
    except Exception as e:
        logger.error(f"Erreur lors du marquage de l'email {uid} comme lu : {e}")

def send_reply(to_email, reply_text):
    if not all([SMTP_SERVER, SMTP_USER, SMTP_PASS]):
        logger.error("Configuration SMTP incomplète. Impossible d'envoyer l'email.")
        return

    try:
        msg = MIMEText(reply_text, 'plain', 'utf-8')
        msg['Subject'] = SUBJECT_REPLY
        msg['From'] = FROM_EMAIL
        msg['To'] = to_email

        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASS)
            server.send_message(msg)

        logger.info(f"Réponse envoyée à {to_email}")
    except Exception as e:
        logger.error(f"Erreur lors de l'envoi de la réponse à {to_email} : {e}", exc_info=True)

def generate_response(tokenizer, model, prompt):
    try:
        messages = [{"role": "user", "content": prompt}]
        inputs = tokenizer.apply_chat_template(
            messages,
            add_generation_prompt=True,
            tokenize=True,
            return_dict=True,
            return_tensors="pt",
        ).to(model.device)

        outputs = model.generate(**inputs, max_new_tokens=500, temperature=0.7)
        response = tokenizer.decode(outputs[0][inputs["input_ids"].shape[-1]:], skip_special_tokens=True)
        return response.strip()
    except Exception as e:
        logger.error(f"Erreur lors de la génération de la réponse : {e}", exc_info=True)
        return "Désolé, une erreur est survenue lors de la génération de la réponse."

def get_email_body(msg):
    if msg.is_multipart():
        for part in msg.walk():
            ctype = part.get_content_type()
            cdisp = str(part.get('Content-Disposition'))

            if ctype == 'text/plain' and 'attachment' not in cdisp:
                payload = part.get_payload(decode=True)
                charset = part.get_content_charset() or 'utf-8'
                try:
                    return payload.decode(charset)
                except UnicodeDecodeError:
                    return payload.decode('latin-1', errors='replace')
    else:
        payload = msg.get_payload(decode=True)
        charset = msg.get_content_charset() or 'utf-8'
        try:
            return payload.decode(charset)
        except UnicodeDecodeError:
            return payload.decode('latin-1', errors='replace')
    return ""

def process_emails(emails_data, tokenizer, model):
    for uid, msg in emails_data:
        from_email = None
        try:
            header_from = decode_header(msg.get("From"))[0]
            from_email = header_from[0].decode(header_from[1] or 'utf-8') if isinstance(header_from[0], bytes) else header_from[0]

            prompt = get_email_body(msg)

            if not prompt.strip():
                logger.warning(f"Email {uid} de {from_email} ignoré: corps vide ou non lisible.")
                mark_email_as_seen(uid)
                continue

            logger.info(f"\nTraitement de l'email {uid} de {from_email} : \n--- PROMPT ---\n{prompt[:200]}...")

            reply_text = generate_response(tokenizer, model, prompt)
            logger.info(f"Réponse générée : {reply_text[:200]}...")

            send_reply(from_email, reply_text)

            mark_email_as_seen(uid)

        except Exception as e:
            logger.error(f"Erreur lors du traitement de l'email {uid} de {from_email} : {e}", exc_info=True)

if __name__ == "__main__":
    logger.info("Démarrage du bot email Qwen3 en mode production...")
    try:
        if not all([IMAP_SERVER, IMAP_USER, IMAP_PASS, SMTP_SERVER, SMTP_USER, SMTP_PASS]):
            logger.critical("Veuillez définir toutes les variables d'environnement IMAP et SMTP requises pour la production.")
            exit(1)

        tokenizer, model = load_qwen_model()
        emails_data = fetch_emails()

        if emails_data:
            process_emails(emails_data, tokenizer, model)
        else:
            logger.info("Aucun email à traiter.")

    except Exception as e:
        logger.error(f"Erreur fatale lors de l'exécution du bot : {e}", exc_info=True)
