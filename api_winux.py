#!/usr/bin/env python3
"""
API Flask pour gérer les sessions Winux temporaires
Système de déploiement automatique de sessions Winux via Proxmox
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import json
import os
import time
import threading
import re
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, Optional, Tuple

app = Flask(__name__)
CORS(app)

# Configuration
SESSIONS_FILE = Path("/tmp/winux_sessions.json")
SESSION_DURATION_MINUTES = 30
ANSIBLE_PLAYBOOK_CREATE = "ansible/create-winux-session.yml"
ANSIBLE_PLAYBOOK_DESTROY = "ansible/destroy-winux-session.yml"
CLEANUP_INTERVAL_SECONDS = 60

# Plage de container IDs disponibles (30001-30999)
CONTAINER_ID_MIN = 30001
CONTAINER_ID_MAX = 30999


def load_sessions() -> Dict:
    """Charge les sessions depuis le fichier JSON"""
    if SESSIONS_FILE.exists():
        try:
            with open(SESSIONS_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except (json.JSONDecodeError, IOError) as e:
            app.logger.error(f"Erreur lors du chargement des sessions: {e}")
            return {}
    return {}


def save_sessions(sessions: Dict) -> None:
    """Sauvegarde les sessions dans le fichier JSON"""
    try:
        with open(SESSIONS_FILE, 'w', encoding='utf-8') as f:
            json.dump(sessions, f, indent=2, ensure_ascii=False)
    except IOError as e:
        app.logger.error(f"Erreur lors de la sauvegarde des sessions: {e}")


def get_next_container_id() -> Optional[int]:
    """Trouve le prochain container ID disponible"""
    sessions = load_sessions()
    used_ids = {int(s.get('container_id', 0)) for s in sessions.values() if s.get('container_id')}
    
    for container_id in range(CONTAINER_ID_MIN, CONTAINER_ID_MAX + 1):
        if container_id not in used_ids:
            return container_id
    return None


def extract_container_info_from_ansible_output(output: str) -> Tuple[Optional[int], Optional[str]]:
    """Extrait le container_id et l'IP depuis la sortie Ansible"""
    container_id = None
    container_ip = None
    
    # Chercher container_id dans la sortie
    id_match = re.search(r'Container ID:\s*(\d+)', output)
    if id_match:
        container_id = int(id_match.group(1))
    
    # Chercher IP dans la sortie
    ip_match = re.search(r'IP:\s*(\d+\.\d+\.\d+\.\d+)', output)
    if ip_match:
        container_ip = ip_match.group(1)
    
    return container_id, container_ip


def cleanup_expired_sessions() -> list:
    """Nettoie les sessions expirées"""
    sessions = load_sessions()
    if not sessions:
        return []
    
    now = datetime.now()
    expired = []
    
    for session_id, session_data in list(sessions.items()):
        try:
            created_at = datetime.fromisoformat(session_data['created_at'])
            duration = timedelta(minutes=session_data.get('duration_minutes', SESSION_DURATION_MINUTES))
            expires_at = created_at + duration
            
            if now > expires_at:
                expired.append(session_id)
                container_id = session_data.get('container_id')
                if container_id:
                    destroy_session_internal(container_id)
        except (KeyError, ValueError) as e:
            app.logger.error(f"Erreur lors du traitement de la session {session_id}: {e}")
            expired.append(session_id)
    
    for session_id in expired:
        sessions.pop(session_id, None)
    
    if expired:
        save_sessions(sessions)
        app.logger.info(f"Sessions expirées nettoyées: {len(expired)}")
    
    return expired


def destroy_session_internal(container_id: int) -> Tuple[bool, str, str]:
    """Détruit une session Winux via Ansible"""
    try:
        env = os.environ.copy()
        result = subprocess.run(
            ['ansible-playbook', ANSIBLE_PLAYBOOK_DESTROY, '-e', f'container_id={container_id}'],
            capture_output=True,
            text=True,
            env=env,
            timeout=120,
            cwd=Path(__file__).parent
        )
        success = result.returncode == 0
        if not success:
            app.logger.error(f"Erreur lors de la destruction du container {container_id}: {result.stderr}")
        return success, result.stdout, result.stderr
    except subprocess.TimeoutExpired:
        error_msg = f"Timeout lors de la destruction du container {container_id}"
        app.logger.error(error_msg)
        return False, "", error_msg
    except Exception as e:
        error_msg = f"Exception lors de la destruction: {str(e)}"
        app.logger.error(error_msg)
        return False, "", error_msg


@app.route('/api/winux/sessions', methods=['POST'])
def create_session():
    """Crée une nouvelle session Winux"""
    try:
        data = request.json or {}
        session_id = data.get('session_id') or f"winux-{int(time.time())}"
        duration = data.get('duration_minutes', SESSION_DURATION_MINUTES)
        
        # Validation
        if duration < 1 or duration > 1440:  # Entre 1 minute et 24 heures
            return jsonify({
                'success': False,
                'error': 'La durée doit être entre 1 et 1440 minutes'
            }), 400
        
        # Nettoyer les sessions expirées avant de créer une nouvelle
        cleanup_expired_sessions()
        
        # Vérifier qu'il n'y a pas déjà une session avec cet ID
        sessions = load_sessions()
        if session_id in sessions:
            return jsonify({
                'success': False,
                'error': 'Une session avec cet ID existe déjà'
            }), 409
        
        # Obtenir le prochain container ID disponible
        container_id = get_next_container_id()
        if not container_id:
            return jsonify({
                'success': False,
                'error': 'Aucun container ID disponible (tous les IDs sont utilisés)'
            }), 503
        
        # Exécuter le playbook Ansible
        env = os.environ.copy()
        result = subprocess.run(
            ['ansible-playbook', ANSIBLE_PLAYBOOK_CREATE,
             '-e', f'session_id={session_id}',
             '-e', f'session_duration={duration}',
             '-e', f'container_id={container_id}'],
            capture_output=True,
            text=True,
            env=env,
            timeout=600,
            cwd=Path(__file__).parent
        )
        
        if result.returncode != 0:
            app.logger.error(f"Erreur Ansible: {result.stderr}")
            return jsonify({
                'success': False,
                'error': 'Erreur lors de la création de la session',
                'details': result.stderr
            }), 500
        
        # Extraire les informations depuis la sortie Ansible
        container_id_from_output, container_ip = extract_container_info_from_ansible_output(result.stdout)
        if container_id_from_output:
            container_id = container_id_from_output
        
        # Calculer l'IP si elle n'a pas été extraite
        if not container_ip:
            # IP basée sur le container_id: 10.0.0.{container_id % 254 + 1}
            ip_last_octet = (container_id % 254) + 1
            container_ip = f"10.0.0.{ip_last_octet}"
        
        # Créer la session
        session_data = {
            'session_id': session_id,
            'container_id': container_id,
            'container_ip': container_ip,
            'created_at': datetime.now().isoformat(),
            'duration_minutes': duration,
            'status': 'active'
        }
        
        sessions[session_id] = session_data
        save_sessions(sessions)
        
        app.logger.info(f"Session créée: {session_id} (container {container_id})")
        
        return jsonify({
            'success': True,
            'session': session_data,
            'message': f'Session Winux créée avec succès. Durée: {duration} minutes'
        }), 201
        
    except subprocess.TimeoutExpired:
        return jsonify({
            'success': False,
            'error': 'Timeout lors de la création de la session'
        }), 504
    except Exception as e:
        app.logger.error(f"Exception lors de la création: {str(e)}")
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
        container_id = session_data.get('container_id')
        
        if not container_id:
            return jsonify({
                'success': False,
                'error': 'Container ID manquant dans la session'
            }), 400
        
        success, stdout, stderr = destroy_session_internal(container_id)
        
        if success:
            del sessions[session_id]
            save_sessions(sessions)
            app.logger.info(f"Session supprimée: {session_id}")
            
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
        app.logger.error(f"Exception lors de la suppression: {str(e)}")
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
            try:
                created_at = datetime.fromisoformat(session_data['created_at'])
                duration = timedelta(minutes=session_data.get('duration_minutes', SESSION_DURATION_MINUTES))
                expires_at = created_at + duration
                remaining = expires_at - now
                
                session_info = session_data.copy()
                session_info['expires_at'] = expires_at.isoformat()
                session_info['remaining_seconds'] = max(0, int(remaining.total_seconds()))
                sessions_list.append(session_info)
            except (KeyError, ValueError) as e:
                app.logger.error(f"Erreur lors du traitement de la session {session_id}: {e}")
                continue
        
        return jsonify({
            'success': True,
            'sessions': sessions_list
        }), 200
        
    except Exception as e:
        app.logger.error(f"Exception lors de la liste: {str(e)}")
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
        app.logger.error(f"Exception lors de la récupération: {str(e)}")
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
        app.logger.error(f"Exception lors du nettoyage: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/winux/health', methods=['GET'])
def health_check():
    """Vérification de santé de l'API"""
    try:
        sessions = load_sessions()
        return jsonify({
            'status': 'healthy',
            'timestamp': datetime.now().isoformat(),
            'active_sessions': len(sessions)
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }), 500

@app.route('/api/winux', methods=['GET'])
def api_root():
    """Endpoint racine de l'API pour vérifier qu'elle est accessible"""
    return jsonify({
        'success': True,
        'message': 'API Winux est opérationnelle',
        'endpoints': {
            'health': '/api/winux/health',
            'sessions': '/api/winux/sessions',
            'create_session': 'POST /api/winux/sessions',
            'get_session': 'GET /api/winux/sessions/<session_id>',
            'delete_session': 'DELETE /api/winux/sessions/<session_id>',
            'cleanup': 'POST /api/winux/cleanup'
        },
        'timestamp': datetime.now().isoformat()
    }), 200


@app.errorhandler(404)
def not_found(error):
    """Gestionnaire d'erreur 404"""
    return jsonify({
        'success': False,
        'error': 'Endpoint non trouvé'
    }), 404

@app.errorhandler(500)
def internal_error(error):
    """Gestionnaire d'erreur 500"""
    return jsonify({
        'success': False,
        'error': 'Erreur interne du serveur'
    }), 500

@app.errorhandler(Exception)
def handle_exception(e):
    """Gestionnaire d'erreur global"""
    app.logger.error(f"Exception non gérée: {str(e)}", exc_info=True)
    return jsonify({
        'success': False,
        'error': str(e)
    }), 500

def cleanup_thread():
    """Thread pour nettoyer automatiquement les sessions expirées"""
    while True:
        try:
            time.sleep(CLEANUP_INTERVAL_SECONDS)
            cleanup_expired_sessions()
        except Exception as e:
            app.logger.error(f"Erreur dans le thread de nettoyage: {e}")


if __name__ == '__main__':
    # Démarrer le thread de nettoyage
    cleanup_thread_daemon = threading.Thread(target=cleanup_thread, daemon=True)
    cleanup_thread_daemon.start()
    
    # Démarrer l'API Flask
    app.run(host='0.0.0.0', port=5000, debug=True)
