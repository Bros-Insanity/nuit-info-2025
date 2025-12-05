# Déploiement Automatique de Sessions Winux

Cette branche contient le système de déploiement automatique de sessions Winux temporaires. Un utilisateur peut lancer une session unique de Winux depuis une page web, l'utiliser, puis la session est automatiquement supprimée après expiration.

## Architecture

```
Page Web → API Flask → Ansible → Proxmox → Container LXC Winux
```

- **Page Web** : Interface utilisateur pour lancer une session
- **API Flask** : Gère les sessions (création, destruction, liste)
- **Ansible** : Orchestre la création et destruction des containers
- **Proxmox** : Héberge les containers LXC
- **Container Winux** : Session temporaire avec XFCE et RDP

## Fichiers créés

### Playbooks Ansible

- `ansible/create-winux-session.yml` : Crée une session Winux temporaire
- `ansible/destroy-winux-session.yml` : Détruit une session Winux

### API Backend

- `api_winux.py` : API Flask pour gérer les sessions
  - `POST /api/winux/sessions` : Créer une session
  - `GET /api/winux/sessions` : Lister les sessions actives
  - `GET /api/winux/sessions/<session_id>` : Obtenir les infos d'une session
  - `DELETE /api/winux/sessions/<session_id>` : Supprimer une session
  - `POST /api/winux/cleanup` : Nettoyer les sessions expirées

### Interface Web

- `public/html/winux_test.html` : Page web pour lancer une session Winux

### Scripts

- `scripts/cleanup_winux_sessions.sh` : Script de nettoyage automatique

## Installation

### 1. Installer les dépendances Python

```bash
pip install -r requirements_winux.txt
```

### 2. Configurer les variables d'environnement

Les mêmes variables que pour le déploiement principal sont nécessaires :
- `proxmox_api_host`
- `proxmox_api_user`
- `proxmox_api_token_secret`
- `proxmox_node`
- `proxmox_ssh_private_key`

### 3. Démarrer l'API Flask

```bash
python3 api_winux.py
```

L'API sera accessible sur `http://localhost:5000`

### 4. Configurer le serveur web

Assurez-vous que le serveur web (nginx) peut servir :
- La page `winux_test.html`
- Les requêtes API vers `/api/winux/*` (proxy vers Flask)

Exemple de configuration nginx :

```nginx
location /api/winux {
    proxy_pass http://localhost:5000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}

location /winux_test.html {
    alias /var/www/html/winux_test.html;
}
```

### 5. Configurer le nettoyage automatique (optionnel)

Ajouter une tâche cron pour nettoyer automatiquement les sessions expirées :

```bash
# Nettoyer toutes les 5 minutes
*/5 * * * * /chemin/vers/scripts/cleanup_winux_sessions.sh
```

## Utilisation

### Pour l'utilisateur final

1. Accéder à la page `/winux_test.html`
2. Cliquer sur "Lancer une session Winux"
3. Attendre la création de la session (environ 2-3 minutes)
4. Se connecter via RDP avec les informations affichées
5. La session sera automatiquement supprimée après 30 minutes (par défaut)

### Pour l'administrateur

#### Créer une session manuellement

```bash
ansible-playbook ansible/create-winux-session.yml \
  -e "session_id=winux-test-001" \
  -e "session_duration=30"
```

#### Détruire une session manuellement

```bash
ansible-playbook ansible/destroy-winux-session.yml \
  -e "container_id=30001"
```

#### Lister les sessions via l'API

```bash
curl http://localhost:5000/api/winux/sessions
```

## Fonctionnalités

- **Création automatique** : Un container LXC est créé avec XFCE et RDP
- **Session unique** : Chaque utilisateur obtient sa propre session isolée
- **Expiration automatique** : Les sessions sont supprimées après la durée configurée
- **Interface web** : Interface simple et intuitive
- **Compteur de temps** : Affichage du temps restant en temps réel
- **Nettoyage automatique** : Thread de nettoyage dans l'API + script cron

## Configuration

### Durée de session par défaut

Modifier dans `api_winux.py` :
```python
SESSION_DURATION_MINUTES = 30  # Changer la valeur
```

### Ressources du container

Modifier dans `ansible/create-winux-session.yml` :
```yaml
container_memory: 1024  # MB
container_cores: 2
container_disk: 10  # GB
```

## Dépannage

### La session ne se crée pas

- Vérifier que l'API Flask est démarrée
- Vérifier les logs Ansible
- Vérifier les permissions Proxmox

### Impossible de se connecter en RDP

- Vérifier que le port 3389 est ouvert
- Vérifier que XRDP est bien installé dans le container
- Vérifier l'adresse IP du container

### Les sessions ne sont pas supprimées automatiquement

- Vérifier que le thread de nettoyage fonctionne dans l'API
- Vérifier que le script cron est configuré
- Vérifier les logs du script de nettoyage

## Notes

- Les sessions sont stockées dans `/tmp/winux_sessions.json`
- Chaque session utilise un container ID unique (30001-30999)
- L'IP est calculée automatiquement basée sur le container ID
- Le nettoyage automatique vérifie toutes les minutes dans l'API

