#!/bin/bash
#
# Script de nettoyage automatique des sessions Winux expirées
# À exécuter via cron toutes les 5 minutes
#

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
SESSIONS_FILE="/tmp/winux_sessions.json"
ANSIBLE_PLAYBOOK="$PROJECT_DIR/ansible/destroy-winux-session.yml"

# Charger les variables d'environnement nécessaires
if [ -f "$PROJECT_DIR/.env" ]; then
    source "$PROJECT_DIR/.env"
fi

# Vérifier si le fichier de sessions existe
if [ ! -f "$SESSIONS_FILE" ]; then
    exit 0
fi

# Lire le fichier JSON et extraire les sessions expirées
python3 << EOF
import json
import os
import subprocess
from datetime import datetime, timedelta

sessions_file = "$SESSIONS_FILE"
playbook = "$ANSIBLE_PLAYBOOK"

if not os.path.exists(sessions_file):
    exit(0)

with open(sessions_file, 'r') as f:
    sessions = json.load(f)

now = datetime.now()
expired = []

for session_id, session_data in sessions.items():
    created_at = datetime.fromisoformat(session_data['created_at'])
    duration = timedelta(minutes=session_data.get('duration_minutes', 30))
    expires_at = created_at + duration
    
    if now > expires_at:
        expired.append((session_id, session_data['container_id']))

# Supprimer les sessions expirées
for session_id, container_id in expired:
    print(f"Suppression de la session {session_id} (container {container_id})")
    try:
        env = os.environ.copy()
        result = subprocess.run(
            ['ansible-playbook', playbook, '-e', f'container_id={container_id}'],
            capture_output=True,
            text=True,
            env=env,
            timeout=120
        )
        if result.returncode == 0:
            del sessions[session_id]
            print(f"Session {session_id} supprimée avec succès")
        else:
            print(f"Erreur lors de la suppression: {result.stderr}")
    except Exception as e:
        print(f"Erreur: {e}")

# Sauvegarder les sessions restantes
with open(sessions_file, 'w') as f:
    json.dump(sessions, f, indent=2)

EOF

exit 0

