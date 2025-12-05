# 🚀 Winux - Système de Sessions Temporaires

Système de déploiement automatique de sessions Winux temporaires via Proxmox. Permet aux utilisateurs de lancer une session unique de bureau Linux (XFCE) avec accès RDP, qui est automatiquement supprimée après expiration.

## 📋 Architecture

```
Page Web → API Flask → Ansible → Proxmox → Container LXC Winux
```

- **Page Web** : Interface utilisateur moderne pour lancer et gérer les sessions
- **API Flask** : Gère les sessions (création, destruction, liste, nettoyage)
- **Ansible** : Orchestre la création et destruction des containers LXC
- **Proxmox** : Héberge les containers LXC
- **Container Winux** : Session temporaire avec XFCE et XRDP

## 🗂️ Structure des Fichiers

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
  - `GET /api/winux/health` : Vérification de santé de l'API

### Interface Web

- `public/html/winux/index.html` : Page web moderne pour lancer une session Winux

### Scripts

- `scripts/cleanup_winux_sessions.sh` : Script de nettoyage automatique

## 🔧 Installation

### 1. Installer les dépendances Python

```bash
pip install -r requirements_winux.txt
```

### 2. Configurer les variables d'environnement

Les variables suivantes doivent être définies (via `.env` ou export) :

```bash
export proxmox_api_host="votre-serveur-proxmox"
export proxmox_api_user="votre-utilisateur@pam"
export proxmox_api_token_secret="votre-token-secret"
export proxmox_node="votre-node-proxmox"
export proxmox_ssh_private_key="$(cat /chemin/vers/votre/cle/ssh)"
```

**Note** : Pour `proxmox_ssh_private_key`, vous pouvez soit :
- Exporter la variable avec le contenu complet de la clé
- Utiliser `proxmox_ssh_key_path` pour pointer vers un fichier de clé

### 3. Démarrer l'API Flask

```bash
python3 api_winux.py
```

L'API sera accessible sur `http://localhost:5000`

### 4. Configurer le serveur web (nginx)

Assurez-vous que le serveur web peut servir :
- La page `winux/index.html`
- Les requêtes API vers `/api/winux/*` (proxy vers Flask)

Exemple de configuration nginx :

```nginx
location /api/winux {
    proxy_pass http://localhost:5000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

location /winux {
    alias /var/www/html/winux;
    try_files $uri $uri/ /winux/index.html;
}
```

### 5. Configurer le nettoyage automatique (optionnel)

Ajouter une tâche cron pour nettoyer automatiquement les sessions expirées :

```bash
# Nettoyer toutes les 5 minutes
*/5 * * * * /chemin/vers/nuit-info-2025/scripts/cleanup_winux_sessions.sh
```

## 🎯 Utilisation

### Pour l'utilisateur final

1. Accéder à la page `/winux/` ou `/winux/index.html`
2. Cliquer sur "✨ Lancer une session Winux"
3. Attendre la création de la session (environ 2-3 minutes)
4. Se connecter via RDP avec les informations affichées :
   - **Adresse** : L'IP affichée (ex: `10.0.0.1`)
   - **Port** : `3389`
   - **Utilisateur** : `root` (par défaut)
   - **Mot de passe** : Défini lors de la création du container
5. La session sera automatiquement supprimée après 30 minutes (par défaut)

### Pour l'administrateur

#### Créer une session manuellement

```bash
ansible-playbook ansible/create-winux-session.yml \
  -e "session_id=winux-test-001" \
  -e "session_duration=30" \
  -e "container_id=30001"
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

#### Nettoyer manuellement les sessions expirées

```bash
curl -X POST http://localhost:5000/api/winux/cleanup
```

#### Vérifier la santé de l'API

```bash
curl http://localhost:5000/api/winux/health
```

## ✨ Fonctionnalités

- **Création automatique** : Un container LXC est créé avec XFCE et XRDP
- **Session unique** : Chaque utilisateur obtient sa propre session isolée
- **Expiration automatique** : Les sessions sont supprimées après la durée configurée
- **Interface web moderne** : Interface intuitive avec animations et feedback visuel
- **Compteur de temps** : Affichage du temps restant en temps réel avec avertissement visuel
- **Nettoyage automatique** : Thread de nettoyage dans l'API + script cron
- **Gestion des IDs** : Attribution automatique des container IDs disponibles (30001-30999)
- **Rafraîchissement automatique** : Les informations de session sont rafraîchies toutes les 30 secondes

## ⚙️ Configuration

### Durée de session par défaut

Modifier dans `api_winux.py` :

```python
SESSION_DURATION_MINUTES = 30  # Changer la valeur (en minutes)
```

### Ressources du container

Modifier dans `ansible/create-winux-session.yml` :

```yaml
container_memory: 1024  # MB
container_cores: 2
container_disk: 10  # GB
```

### Plage de container IDs

Modifier dans `api_winux.py` :

```python
CONTAINER_ID_MIN = 30001
CONTAINER_ID_MAX = 30999
```

### Intervalle de nettoyage

Modifier dans `api_winux.py` :

```python
CLEANUP_INTERVAL_SECONDS = 60  # Vérifier toutes les minutes
```

## 🔍 Dépannage

### La session ne se crée pas

- Vérifier que l'API Flask est démarrée
- Vérifier les logs Ansible (sortie de l'API)
- Vérifier les permissions Proxmox
- Vérifier que les variables d'environnement sont correctement définies
- Vérifier qu'un container ID est disponible (30001-30999)

### Impossible de se connecter en RDP

- Vérifier que le port 3389 est ouvert sur le réseau
- Vérifier que XRDP est bien installé dans le container
- Vérifier l'adresse IP du container
- Vérifier que le container est démarré

### Les sessions ne sont pas supprimées automatiquement

- Vérifier que le thread de nettoyage fonctionne dans l'API (logs)
- Vérifier que le script cron est configuré et exécutable
- Vérifier les logs du script de nettoyage : `/tmp/winux_cleanup.log`
- Vérifier les permissions sur `/tmp/winux_sessions.json`

### Erreur "Aucun container ID disponible"

- Nettoyer les sessions expirées : `curl -X POST http://localhost:5000/api/winux/cleanup`
- Vérifier le fichier `/tmp/winux_sessions.json` pour les sessions orphelines
- Augmenter la plage de container IDs si nécessaire

## 📝 Notes Techniques

- Les sessions sont stockées dans `/tmp/winux_sessions.json`
- Chaque session utilise un container ID unique (30001-30999)
- L'IP est calculée automatiquement : `10.0.0.{container_id % 254 + 1}`
- Le nettoyage automatique vérifie toutes les minutes dans l'API
- Le script de nettoyage cron s'exécute toutes les 5 minutes (recommandé)
- Les logs de nettoyage sont écrits dans `/tmp/winux_cleanup.log`

## 🔒 Sécurité

- Les sessions sont isolées dans des containers LXC non privilégiés
- Chaque session a sa propre IP et est isolée du réseau
- Les sessions expirent automatiquement après la durée configurée
- Les clés SSH ne sont pas loggées (no_log: true dans Ansible)
- L'API peut être protégée par authentification si nécessaire

## 📚 Dépendances

- Python 3.7+
- Flask 3.0.0+
- flask-cors 4.0.0+
- Ansible 2.9+
- Accès à un serveur Proxmox avec API
- Accès SSH au serveur Proxmox (pour l'installation des packages)

## 🚀 Améliorations Futures

- [ ] Authentification utilisateur pour l'API
- [ ] Limite de sessions par utilisateur
- [ ] Sauvegarde automatique des données utilisateur
- [ ] Interface d'administration pour gérer toutes les sessions
- [ ] Métriques et monitoring
- [ ] Support de différents environnements de bureau (KDE, GNOME, etc.)
- [ ] Upload/Download de fichiers
- [ ] Partage de session entre utilisateurs
