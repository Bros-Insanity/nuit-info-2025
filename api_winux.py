#!/usr/bin/env python3
"""
API Flask pour gérer les sessions Winux temporaires
Permet de créer et détruire des sessions Winux via l'API Proxmox
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import json
import os
import time
import threading
from datetime import datetime, timedelta
import uuid

app = Flask(__name__)
CORS(app)

# Configuration
SESSIONS_FILE = "/tmp/winux_sessions.json"
SESSION_DURATION_MINUTES = 30
ANSIBLE_PLAYBOOK_CREATE = "ansible/create-winux-session.yml"
ANSIBLE_PLAYBOOK_DESTROY = "ansible/destroy-winux-session.yml"

def load_sessions():
    """Charge les sessions depuis le fichier JSON"""
    if os.path.exists(SESSIONS_FILE):
        with open(SESSIONS_FILE, 'r') as f:
            return json.load(f)
    return {}

def save_sessions(sessions):
    """Sauvegarde les sessions dans le fichier JSON"""
    with open(SESSIONS_FILE, 'w') as f:
        json.dump(sessions, f, indent=2)

def cleanup_expired_sessions():
    """Nettoie les sessions expirées"""
    sessions = load_sessions()
    now = datetime.now()
    expired = []
    
    for session_id, session_data in sessions.items():
        created_at = datetime.fromisoformat(session_data['created_at'])
        duration = timedelta(minutes=session_data.get('duration_minutes', SESSION_DURATION_MINUTES))
        expires_at = created_at + duration
        
        if now > expires_at:
            expired.append(session_id)
    
    for session_id in expired:
        destroy_session_internal(session_id)
        del sessions[session_id]
    
    if expired:
        save_sessions(sessions)
    
    return expired

def destroy_session_internal(container_id):
    """Détruit une session Winux via Ansible"""
    try:
        env = os.environ.copy()
        result = subprocess.run(
            ['ansible-playbook', ANSIBLE_PLAYBOOK_DESTROY, '-e', f'container_id={container_id}'],
            capture_output=True,
            text=True,
            env=env,
            timeout=120
        )
        return result.returncode == 0, result.stdout, result.stderr
    except Exception as e:
        return False, "", str(e)

@app.route('/api/winux/sessions', methods=['POST'])
def create_session():
    """Crée une nouvelle session Winux"""
    try:
        data = request.json or {}
        session_id = data.get('session_id', f"winux-{uuid.uuid4().hex[:8]}")
        duration = data.get('duration_minutes', SESSION_DURATION_MINUTES)
        
        # Nettoyer les sessions expirées avant de créer une nouvelle
        cleanup_expired_sessions()
        
        # Exécuter le playbook Ansible
        env = os.environ.copy()
        result = subprocess.run(
            ['ansible-playbook', ANSIBLE_PLAYBOOK_CREATE, 
             '-e', f'session_id={session_id}',
             '-e', f'session_duration={duration}'],
            capture_output=True,
            text=True,
            env=env,
            timeout=600
        )
        
        if result.returncode != 0:
            return jsonify({
                'success': False,
                'error': 'Erreur lors de la création de la session',
                'details': result.stderr
            }), 500
        
        # Extraire les informations de la session depuis la sortie Ansible
        # Pour simplifier, on va parser la sortie ou utiliser un fichier temporaire
        # Ici, on va créer une structure basique
        sessions = load_sessions()
        
        # On doit extraire container_id et IP depuis la sortie Ansible
        # Pour l'instant, on utilise des valeurs par défaut
        container_id = 30001  # Sera remplacé par la vraie valeur
        
        session_data = {
            'session_id': session_id,
            'container_id': container_id,
            'created_at': datetime.now().isoformat(),
            'duration_minutes': duration,
            'status': 'active'
        }
        
        sessions[session_id] = session_data
        save_sessions(sessions)
        
        return jsonify({
            'success': True,
            'session': session_data,
            'message': f'Session Winux créée avec succès. Durée: {duration} minutes'
        }), 201
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/winux/sessions/<session_id>', methods=['DELETE'])
def destroy_session(session_id):
    """Détruit une session Winux"""
    try:
        sessions = load_sessions()
        
        if session_id not in sessions:
            return jsonify({
                'success': False,
                'error': 'Session non trouvée'
            }), 404
        
        session_data = sessions[session_id]
        container_id = session_data['container_id']
        
        success, stdout, stderr = destroy_session_internal(container_id)
        
        if success:
            del sessions[session_id]
            save_sessions(sessions)
            
            return jsonify({
                'success': True,
                'message': 'Session supprimée avec succès'
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': 'Erreur lors de la suppression',
                'details': stderr
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/winux/sessions', methods=['GET'])
def list_sessions():
    """Liste toutes les sessions actives"""
    try:
        cleanup_expired_sessions()
        sessions = load_sessions()
        
        # Calculer le temps restant pour chaque session
        now = datetime.now()
        sessions_list = []
        
        for session_id, session_data in sessions.items():
            created_at = datetime.fromisoformat(session_data['created_at'])
            duration = timedelta(minutes=session_data.get('duration_minutes', SESSION_DURATION_MINUTES))
            expires_at = created_at + duration
            remaining = expires_at - now
            
            session_info = session_data.copy()
            session_info['expires_at'] = expires_at.isoformat()
            session_info['remaining_seconds'] = max(0, int(remaining.total_seconds()))
            sessions_list.append(session_info)
        
        return jsonify({
            'success': True,
            'sessions': sessions_list
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/winux/sessions/<session_id>', methods=['GET'])
def get_session(session_id):
    """Récupère les informations d'une session"""
    try:
        sessions = load_sessions()
        
        if session_id not in sessions:
            return jsonify({
                'success': False,
                'error': 'Session non trouvée'
            }), 404
        
        session_data = sessions[session_id]
        created_at = datetime.fromisoformat(session_data['created_at'])
        duration = timedelta(minutes=session_data.get('duration_minutes', SESSION_DURATION_MINUTES))
        expires_at = created_at + duration
        remaining = expires_at - datetime.now()
        
        session_info = session_data.copy()
        session_info['expires_at'] = expires_at.isoformat()
        session_info['remaining_seconds'] = max(0, int(remaining.total_seconds()))
        
        return jsonify({
            'success': True,
            'session': session_info
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/winux/cleanup', methods=['POST'])
def cleanup_sessions():
    """Nettoie manuellement les sessions expirées"""
    try:
        expired = cleanup_expired_sessions()
        return jsonify({
            'success': True,
            'cleaned_sessions': expired,
            'message': f'{len(expired)} session(s) nettoyée(s)'
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/winux/health', methods=['GET'])
def health_check():
    """Vérification de santé de l'API"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat()
    }), 200

def cleanup_thread():
    """Thread pour nettoyer automatiquement les sessions expirées"""
    while True:
        try:
            time.sleep(60)  # Vérifier toutes les minutes
            cleanup_expired_sessions()
        except Exception as e:
            print(f"Erreur dans le thread de nettoyage: {e}")

if __name__ == '__main__':
    # Démarrer le thread de nettoyage
    cleanup_thread = threading.Thread(target=cleanup_thread, daemon=True)
    cleanup_thread.start()
    
    # Démarrer l'API Flask
    app.run(host='0.0.0.0', port=5000, debug=True)

