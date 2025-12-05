#!/usr/bin/env python3
"""
API Winux - Backend compatible avec nginx
API simple pour gérer les sessions Winux temporaires
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta
import json
import os
import uuid
import threading
import time

app = Flask(__name__)
CORS(app)  # Permet les requêtes cross-origin

# Configuration
SESSIONS_FILE = '/tmp/winux_sessions.json'
SESSION_DURATION_MINUTES = 30
CONTAINER_ID_MIN = 30001
CONTAINER_ID_MAX = 30999

# Structure de session
# {
#     "session_id": "uuid",
#     "container_id": 30001,
#     "container_ip": "10.0.0.1",
#     "created_at": "2025-12-05T10:00:00",
#     "expires_at": "2025-12-05T10:30:00",
#     "duration_minutes": 30,
#     "remaining_seconds": 1800
# }


def load_sessions():
    """Charge les sessions depuis le fichier JSON"""
    if os.path.exists(SESSIONS_FILE):
        try:
            with open(SESSIONS_FILE, 'r') as f:
                return json.load(f)
        except (json.JSONDecodeError, IOError):
            return {}
    return {}


def save_sessions(sessions):
    """Sauvegarde les sessions dans le fichier JSON"""
    try:
        with open(SESSIONS_FILE, 'w') as f:
            json.dump(sessions, f, indent=2)
    except IOError as e:
        print(f"Erreur lors de la sauvegarde des sessions: {e}")


def get_available_container_id(sessions):
    """Trouve un container ID disponible"""
    used_ids = {int(s.get('container_id', 0)) for s in sessions.values() 
                if s.get('container_id', 0) >= CONTAINER_ID_MIN}
    
    for container_id in range(CONTAINER_ID_MIN, CONTAINER_ID_MAX + 1):
        if container_id not in used_ids:
            return container_id
    return None


def calculate_ip(container_id):
    """Calcule l'IP du container basée sur son ID"""
    # IP = 10.0.0.{container_id % 254 + 1}
    ip_last_octet = (container_id % 254) + 1
    return f"10.0.0.{ip_last_octet}"


def calculate_remaining_seconds(expires_at_str):
    """Calcule le nombre de secondes restantes avant expiration"""
    try:
        expires_at = datetime.fromisoformat(expires_at_str)
        now = datetime.now()
        remaining = (expires_at - now).total_seconds()
        return max(0, int(remaining))
    except (ValueError, TypeError):
        return 0


def cleanup_expired_sessions():
    """Supprime les sessions expirées"""
    sessions = load_sessions()
    now = datetime.now()
    expired = []
    
    for session_id, session in sessions.items():
        try:
            expires_at = datetime.fromisoformat(session.get('expires_at', ''))
            if now >= expires_at:
                expired.append(session_id)
        except (ValueError, TypeError):
            expired.append(session_id)
    
    for session_id in expired:
        del sessions[session_id]
    
    if expired:
        save_sessions(sessions)
        print(f"Nettoyage: {len(expired)} session(s) expirée(s) supprimée(s)")
    
    return len(expired)


def cleanup_thread():
    """Thread de nettoyage automatique des sessions expirées"""
    while True:
        try:
            cleanup_expired_sessions()
        except Exception as e:
            print(f"Erreur dans le thread de nettoyage: {e}")
        time.sleep(60)  # Vérifier toutes les minutes


@app.route('/api/winux/health', methods=['GET'])
def health():
    """Endpoint de santé de l'API"""
    return jsonify({
        'success': True,
        'status': 'healthy',
        'message': 'API Winux opérationnelle'
    }), 200


@app.route('/api/winux/sessions', methods=['GET'])
def list_sessions():
    """Liste toutes les sessions actives"""
    try:
        sessions = load_sessions()
        cleanup_expired_sessions()
        sessions = load_sessions()  # Recharger après nettoyage
        
        # Convertir en liste et calculer remaining_seconds
        sessions_list = []
        for session_id, session in sessions.items():
            remaining = calculate_remaining_seconds(session.get('expires_at', ''))
            if remaining > 0:
                session_copy = session.copy()
                session_copy['remaining_seconds'] = remaining
                sessions_list.append(session_copy)
        
        return jsonify({
            'success': True,
            'sessions': sessions_list
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/winux/sessions', methods=['POST'])
def create_session():
    """Crée une nouvelle session Winux"""
    try:
        data = request.get_json() or {}
        duration_minutes = data.get('duration_minutes', SESSION_DURATION_MINUTES)
        
        # Vérifier qu'il n'y a pas déjà une session active
        sessions = load_sessions()
        cleanup_expired_sessions()
        sessions = load_sessions()
        
        active_sessions = [s for s in sessions.values() 
                          if calculate_remaining_seconds(s.get('expires_at', '')) > 0]
        
        if active_sessions:
            return jsonify({
                'success': False,
                'error': 'Une session est déjà active. Veuillez la terminer avant d\'en créer une nouvelle.'
            }), 400
        
        # Trouver un container ID disponible
        container_id = get_available_container_id(sessions)
        if container_id is None:
            return jsonify({
                'success': False,
                'error': 'Aucun container ID disponible. Tous les containers sont utilisés.'
            }), 503
        
        # Créer la session
        session_id = str(uuid.uuid4())
        now = datetime.now()
        expires_at = now + timedelta(minutes=duration_minutes)
        
        session = {
            'session_id': session_id,
            'container_id': container_id,
            'container_ip': calculate_ip(container_id),
            'created_at': now.isoformat(),
            'expires_at': expires_at.isoformat(),
            'duration_minutes': duration_minutes,
            'remaining_seconds': duration_minutes * 60
        }
        
        sessions[session_id] = session
        save_sessions(sessions)
        
        print(f"Session créée: {session_id} (container {container_id}, IP {session['container_ip']})")
        
        return jsonify({
            'success': True,
            'session': session
        }), 201
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/winux/sessions/<session_id>', methods=['GET'])
def get_session(session_id):
    """Obtient les informations d'une session spécifique"""
    try:
        sessions = load_sessions()
        cleanup_expired_sessions()
        sessions = load_sessions()
        
        if session_id not in sessions:
            return jsonify({
                'success': False,
                'error': 'Session non trouvée'
            }), 404
        
        session = sessions[session_id]
        remaining = calculate_remaining_seconds(session.get('expires_at', ''))
        
        if remaining <= 0:
            return jsonify({
                'success': False,
                'error': 'Session expirée'
            }), 410
        
        session_copy = session.copy()
        session_copy['remaining_seconds'] = remaining
        
        return jsonify({
            'success': True,
            'session': session_copy
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/winux/sessions/<session_id>', methods=['DELETE'])
def delete_session(session_id):
    """Supprime une session"""
    try:
        sessions = load_sessions()
        
        if session_id not in sessions:
            return jsonify({
                'success': False,
                'error': 'Session non trouvée'
            }), 404
        
        session = sessions[session_id]
        del sessions[session_id]
        save_sessions(sessions)
        
        print(f"Session supprimée: {session_id} (container {session.get('container_id')})")
        
        return jsonify({
            'success': True,
            'message': 'Session supprimée avec succès'
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/winux/cleanup', methods=['POST'])
def cleanup():
    """Nettoie manuellement les sessions expirées"""
    try:
        count = cleanup_expired_sessions()
        return jsonify({
            'success': True,
            'message': f'{count} session(s) expirée(s) supprimée(s)'
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


if __name__ == '__main__':
    # Démarrer le thread de nettoyage
    cleanup_thread_obj = threading.Thread(target=cleanup_thread, daemon=True)
    cleanup_thread_obj.start()
    
    # Démarrer l'API Flask
    # Écouter sur toutes les interfaces pour permettre le proxy nginx
    app.run(host='127.0.0.1', port=5000, debug=False)

