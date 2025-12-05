#!/bin/bash
#
# Script de nettoyage automatique des sessions Winux expirées
# À exécuter via cron toutes les 5 minutes
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
SESSIONS_FILE="/tmp/winux_sessions.json"
ANSIBLE_PLAYBOOK="$PROJECT_DIR/ansible/destroy-winux-session.yml"
LOG_FILE="/tmp/winux_cleanup.log"

# Fonction de logging
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Charger les variables d'environnement nécessaires
if [ -f "$PROJECT_DIR/.env" ]; then
    source "$PROJECT_DIR/.env"
fi

# Vérifier si le fichier de sessions existe
if [ ! -f "$SESSIONS_FILE" ]; then
    log "Aucun fichier de sessions trouvé. Rien à nettoyer."
    exit 0
fi

# Vérifier que le playbook existe
if [ ! -f "$ANSIBLE_PLAYBOOK" ]; then
    log "ERREUR: Playbook Ansible non trouvé: $ANSIBLE_PLAYBOOK"
    exit 1
fi

log "Début du nettoyage des sessions Winux expirées"

# Lire le fichier JSON et extraire les sessions expirées
python3 << EOF
import json
import os
import subprocess
import sys
from datetime import datetime, timedelta

sessions_file = "$SESSIONS_FILE"
playbook = "$ANSIBLE_PLAYBOOK"
log_file = "$LOG_FILE"

def log(message):
    with open(log_file, 'a') as f:
        f.write(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] {message}\n")
    print(message)

if not os.path.exists(sessions_file):
    log("Aucun fichier de sessions trouvé")
    sys.exit(0)

try:
    with open(sessions_file, 'r') as f:
        sessions = json.load(f)
except (json.JSONDecodeError, IOError) as e:
    log(f"ERREUR lors de la lecture du fichier de sessions: {e}")
    sys.exit(1)

if not sessions:
    log("Aucune session à vérifier")
    sys.exit(0)

now = datetime.now()
expired = []

for session_id, session_data in list(sessions.items()):
    try:
        created_at = datetime.fromisoformat(session_data['created_at'])
        duration = timedelta(minutes=session_data.get('duration_minutes', 30))
        expires_at = created_at + duration
        
        if now > expires_at:
            container_id = session_data.get('container_id')
            if container_id:
                expired.append((session_id, container_id))
                log(f"Session expirée détectée: {session_id} (container {container_id})")
    except (KeyError, ValueError) as e:
        log(f"ERREUR lors du traitement de la session {session_id}: {e}")
        expired.append((session_id, None))

# Supprimer les sessions expirées
cleaned_count = 0
for session_id, container_id in expired:
    if not container_id:
        log(f"Suppression de la session {session_id} (pas de container_id)")
        del sessions[session_id]
        cleaned_count += 1
        continue
    
    log(f"Suppression de la session {session_id} (container {container_id})")
    try:
        env = os.environ.copy()
        result = subprocess.run(
            ['ansible-playbook', playbook, '-e', f'container_id={container_id}'],
            capture_output=True,
            text=True,
            env=env,
            timeout=120,
            cwd=os.path.dirname(playbook)
        )
        if result.returncode == 0:
            del sessions[session_id]
            cleaned_count += 1
            log(f"✅ Session {session_id} supprimée avec succès")
        else:
            log(f"❌ Erreur lors de la suppression de {session_id}: {result.stderr}")
    except subprocess.TimeoutExpired:
        log(f"❌ Timeout lors de la suppression de {session_id}")
    except Exception as e:
        log(f"❌ Exception lors de la suppression de {session_id}: {e}")

# Sauvegarder les sessions restantes
try:
    with open(sessions_file, 'w') as f:
        json.dump(sessions, f, indent=2, ensure_ascii=False)
    log(f"Nettoyage terminé: {cleaned_count} session(s) supprimée(s), {len(sessions)} session(s) active(s)")
except IOError as e:
    log(f"ERREUR lors de la sauvegarde: {e}")
    sys.exit(1)

sys.exit(0)
EOF

exit_code=$?
if [ $exit_code -eq 0 ]; then
    log "Nettoyage terminé avec succès"
else
    log "ERREUR lors du nettoyage (code: $exit_code)"
    exit $exit_code
fi
