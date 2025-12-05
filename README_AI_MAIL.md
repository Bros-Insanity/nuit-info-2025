# IA Mail - Bot de Réponse Automatique par Email avec Qwen3

Système de réponse automatique aux emails utilisant le modèle de langage Qwen3 pour générer des réponses intelligentes.

## Description

Ce composant permet de créer un bot email qui :
- Se connecte à un serveur IMAP pour récupérer les emails non lus
- Utilise le modèle Qwen3-0.6B pour générer des réponses automatiques
- Envoie les réponses via SMTP
- Marque les emails comme lus après traitement

## Structure

```
ai_deployment/
├── script.py              # Script principal du bot email
└── requirements.txt       # Dépendances Python

ansible/
└── create-ai-container.yml  # Playbook Ansible pour déployer le container
```

## Prérequis

- Python 3.8+
- Accès à un serveur Proxmox
- Serveur IMAP configuré
- Serveur SMTP configuré
- Accès SSH au serveur Proxmox
- Ansible (pour le déploiement automatique)

## Installation

### Déploiement Automatique avec Ansible

Le déploiement se fait via le playbook Ansible qui :
1. Crée un container LXC Debian sur Proxmox
2. Installe Postfix et Dovecot IMAP
3. Installe Python et les dépendances
4. Déploie le script
5. Configure les variables d'environnement

#### Configuration des Variables Ansible

Avant de lancer le playbook, configurez les variables suivantes :

```yaml
proxmox_api_host: "10.0.0.100"
proxmox_api_user: "terraform@pam!terraform"
proxmox_api_token_secret: "VOTRE_TOKEN"
proxmox_node: "pve1"
proxmox_ssh_private_key: "VOTRE_CLE_SSH"

# Configuration email
imap_server: "imap.example.com"
imap_user: "bot@example.com"
imap_pass: "motdepasse"
imap_mailbox: "INBOX"

smtp_server: "smtp.example.com"
smtp_user: "bot@example.com"
smtp_pass: "motdepasse"
smtp_port: 587
from_email: "bot@example.com"
```

#### Exécution du Playbook

```bash
ansible-playbook ansible/create-ai-container.yml \
  -e "proxmox_api_host=10.0.0.100" \
  -e "proxmox_api_user=terraform@pam!terraform" \
  -e "proxmox_api_token_secret=VOTRE_TOKEN" \
  -e "proxmox_node=pve1" \
  -e "imap_server=imap.example.com" \
  -e "imap_user=bot@example.com" \
  -e "imap_pass=motdepasse" \
  -e "smtp_server=smtp.example.com" \
  -e "smtp_user=bot@example.com" \
  -e "smtp_pass=motdepasse" \
  -e "from_email=bot@example.com"
```

### Installation Manuelle

#### 1. Installer les Dépendances

```bash
pip install -r ai_deployment/requirements.txt
```

#### 2. Configurer les Variables d'Environnement

Créez un fichier `.env` ou exportez les variables :

```bash
export IMAP_SERVER="imap.example.com"
export IMAP_USER="bot@example.com"
export IMAP_PASS="motdepasse"
export IMAP_MAILBOX="INBOX"

export SMTP_SERVER="smtp.example.com"
export SMTP_USER="bot@example.com"
export SMTP_PASS="motdepasse"
export SMTP_PORT="587"
export FROM_EMAIL="bot@example.com"
```

#### 3. Exécuter le Script

```bash
python3 ai_deployment/script.py
```

## Configuration

### Variables d'Environnement

| Variable | Description | Défaut |
|----------|-------------|--------|
| `IMAP_SERVER` | Serveur IMAP | Requis |
| `IMAP_USER` | Utilisateur IMAP | Requis |
| `IMAP_PASS` | Mot de passe IMAP | Requis |
| `IMAP_MAILBOX` | Boîte mail à surveiller | `INBOX` |
| `SMTP_SERVER` | Serveur SMTP | Requis |
| `SMTP_USER` | Utilisateur SMTP | Requis |
| `SMTP_PASS` | Mot de passe SMTP | Requis |
| `SMTP_PORT` | Port SMTP | `587` |
| `FROM_EMAIL` | Adresse email expéditrice | `ton-llm@ton-domaine.com` |

### Modèle IA

Le script utilise le modèle **Qwen3-0.6B** de Hugging Face :
- Modèle léger (0.6 milliards de paramètres)
- Optimisé pour les réponses conversationnelles
- Supporte le français et l'anglais
- Charge automatiquement sur GPU si disponible

Pour changer de modèle, modifiez dans `script.py` :

```python
tokenizer = AutoTokenizer.from_pretrained("Qwen/Qwen3-0.6B")
model = AutoModelForCausalLM.from_pretrained("Qwen/Qwen3-0.6B", device_map="auto")
```

## Utilisation

### Mode Production

Le script s'exécute une fois et traite tous les emails non lus :

```bash
python3 ai_deployment/script.py
```

### Mode Service (systemd)

Créez un service systemd pour exécuter le script périodiquement :

```ini
[Unit]
Description=IA Mail Bot - Réponse automatique par email
After=network.target

[Service]
Type=oneshot
User=root
WorkingDirectory=/opt/ai_script
EnvironmentFile=/opt/ai_script/.env
ExecStart=/usr/bin/python3 /opt/ai_script/script.py
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

Puis créez un timer pour l'exécuter toutes les 5 minutes :

```ini
[Unit]
Description=IA Mail Bot Timer

[Timer]
OnBootSec=5min
OnUnitActiveSec=5min

[Install]
WantedBy=timers.target
```

## Fonctionnement

### Flux de Traitement

1. **Chargement du Modèle** : Le modèle Qwen3 est chargé en mémoire
2. **Récupération des Emails** : Connexion IMAP et récupération des emails non lus
3. **Traitement** : Pour chaque email :
   - Extraction du corps du message
   - Génération d'une réponse avec Qwen3
   - Envoi de la réponse via SMTP
   - Marquage de l'email comme lu
4. **Logging** : Toutes les opérations sont loggées

### Génération de Réponse

Le script utilise le template de chat de Qwen3 :

```python
messages = [{"role": "user", "content": prompt}]
inputs = tokenizer.apply_chat_template(messages, ...)
outputs = model.generate(**inputs, max_new_tokens=500, temperature=0.7)
```

Paramètres de génération :
- `max_new_tokens`: 500 (longueur maximale de la réponse)
- `temperature`: 0.7 (créativité de la réponse)

## Dépannage

### Le modèle ne se charge pas

- Vérifiez que vous avez assez de RAM (minimum 4GB recommandé)
- Vérifiez la connexion Internet pour télécharger le modèle
- Vérifiez que PyTorch est correctement installé

### Erreur de connexion IMAP/SMTP

- Vérifiez les variables d'environnement
- Testez la connexion manuellement :
  ```bash
  telnet imap.example.com 993
  telnet smtp.example.com 587
  ```
- Vérifiez les credentials

### Les emails ne sont pas traités

- Vérifiez que les emails sont bien non lus dans la boîte
- Vérifiez les logs pour voir les erreurs
- Vérifiez que le script a les permissions nécessaires

### Réponses de mauvaise qualité

- Ajustez le paramètre `temperature` (plus bas = plus cohérent, plus haut = plus créatif)
- Augmentez `max_new_tokens` pour des réponses plus longues
- Considérez un modèle plus grand si nécessaire

## Sécurité

### Recommandations

- Ne stockez jamais les mots de passe en clair dans le code
- Utilisez des variables d'environnement ou un gestionnaire de secrets
- Limitez les permissions du compte email utilisé
- Utilisez des connexions sécurisées (IMAPS, SMTPS)
- Surveillez les logs pour détecter les anomalies

### Permissions

Le script nécessite :
- Accès en lecture à la boîte mail IMAP
- Accès en écriture pour envoyer des emails SMTP
- Accès réseau pour télécharger le modèle

## Performance

### Ressources Requises

- **RAM** : Minimum 4GB (recommandé 8GB+)
- **CPU** : 1 core minimum (2+ recommandé)
- **Disque** : ~2GB pour le modèle Qwen3-0.6B
- **GPU** : Optionnel mais recommandé pour de meilleures performances

### Optimisations

- Le modèle est chargé une seule fois au démarrage
- Utilisation de `device_map="auto"` pour optimiser la mémoire
- Les emails sont traités séquentiellement pour éviter la surcharge

## Limitations

- Le modèle Qwen3-0.6B est léger mais peut avoir des limitations sur des sujets complexes
- Les réponses sont générées automatiquement sans validation humaine
- Le script traite les emails de manière séquentielle (pas de parallélisation)
- Nécessite une connexion Internet pour télécharger le modèle au premier lancement

## Améliorations Possibles

- Ajouter un système de filtrage des emails (whitelist/blacklist)
- Implémenter un cache pour éviter de retraiter les mêmes emails
- Ajouter un système de validation avant envoi
- Support de plusieurs modèles avec sélection automatique
- Interface web pour la configuration et le monitoring
- Support de pièces jointes

## Dépendances

- `transformers>=4.40.0` : Bibliothèque Hugging Face pour les modèles
- `torch>=2.0.0` : Framework PyTorch
- `accelerate` : Optimisation de l'accélération GPU/CPU

## Licence

Ce projet fait partie du projet Nuit de l'Info 2025.

## Support

Pour toute question ou problème :
1. Consultez les logs du script
2. Vérifiez la configuration des variables d'environnement
3. Testez la connexion IMAP/SMTP manuellement
4. Ouvrez une issue sur GitHub

