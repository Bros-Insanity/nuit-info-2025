# 🚀 Winux - Client Web + Backend API

Système de sessions temporaires Winux avec interface web et API backend compatible nginx.

## 📋 Description

Cette branche contient :
- **Client web** : Interface HTML/JavaScript moderne pour lancer et gérer les sessions
- **API backend** : API Flask simple compatible avec nginx pour gérer les sessions

## 🗂️ Structure

```
.
├── api_winux.py              # API Flask backend
├── requirements_winux.txt   # Dépendances Python
├── nginx_winux.conf.example  # Exemple de configuration nginx
├── README_WINUX.md           # Cette documentation
└── public/
    └── html/
        └── winux/
            └── index.html    # Interface client Winux
```

## 🔧 Installation

### 1. Installer les dépendances Python

```bash
pip install -r requirements_winux.txt
```

Ou avec pip3 :

```bash
pip3 install -r requirements_winux.txt
```

### 2. Démarrer l'API Flask

```bash
python3 api_winux.py
```

L'API sera accessible sur `http://127.0.0.1:5000`

**Note** : Pour la production, utilisez un serveur WSGI comme Gunicorn :

```bash
pip install gunicorn
gunicorn -w 4 -b 127.0.0.1:5000 api_winux:app
```

### 3. Configurer nginx

Copiez l'exemple de configuration :

```bash
sudo cp nginx_winux.conf.example /etc/nginx/sites-available/winux
sudo ln -s /etc/nginx/sites-available/winux /etc/nginx/sites-enabled/winux
```

Ou intégrez la configuration dans votre fichier nginx existant.

Puis testez et rechargez nginx :

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### 4. Déployer les fichiers statiques

Assurez-vous que le fichier `public/html/winux/index.html` est accessible via nginx :

```bash
sudo cp -r public/html/winux /var/www/html/
sudo chown -R www-data:www-data /var/www/html/winux
```

## 🎯 Utilisation

### Pour l'utilisateur final

1. Accéder à `http://votre-serveur/winux/` ou `http://votre-serveur/winux/index.html`
2. Cliquer sur "✨ Lancer une session Winux"
3. Attendre la création de la session
4. Se connecter via RDP avec les informations affichées :
   - **Adresse** : L'IP affichée (ex: `10.0.0.1`)
   - **Port** : `3389`
5. La session sera automatiquement supprimée après 30 minutes (par défaut)

### Endpoints API

L'API expose les endpoints suivants :

- `GET /api/winux/health` - Vérification de santé
- `GET /api/winux/sessions` - Lister toutes les sessions actives
- `POST /api/winux/sessions` - Créer une nouvelle session
  - Body: `{"duration_minutes": 30}`
- `GET /api/winux/sessions/<session_id>` - Obtenir les infos d'une session
- `DELETE /api/winux/sessions/<session_id>` - Supprimer une session
- `POST /api/winux/cleanup` - Nettoyer manuellement les sessions expirées

### Exemples d'utilisation de l'API

```bash
# Créer une session
curl -X POST http://localhost:5000/api/winux/sessions \
  -H "Content-Type: application/json" \
  -d '{"duration_minutes": 30}'

# Lister les sessions
curl http://localhost:5000/api/winux/sessions

# Obtenir une session spécifique
curl http://localhost:5000/api/winux/sessions/<session_id>

# Supprimer une session
curl -X DELETE http://localhost:5000/api/winux/sessions/<session_id>

# Nettoyer les sessions expirées
curl -X POST http://localhost:5000/api/winux/cleanup
```

## ⚙️ Configuration

### Durée de session par défaut

Modifier dans `api_winux.py` :

```python
SESSION_DURATION_MINUTES = 30  # Changer la valeur (en minutes)
```

### Plage de container IDs

Modifier dans `api_winux.py` :

```python
CONTAINER_ID_MIN = 30001
CONTAINER_ID_MAX = 30999
```

### Fichier de stockage des sessions

Par défaut, les sessions sont stockées dans `/tmp/winux_sessions.json`. Pour changer :

```python
SESSIONS_FILE = '/chemin/vers/votre/fichier.json'
```

## 🔍 Dépannage

### L'API ne répond pas

- Vérifier que Flask est démarré : `ps aux | grep python`
- Vérifier les logs de l'API
- Vérifier que le port 5000 n'est pas utilisé : `netstat -tuln | grep 5000`

### Erreur 502 Bad Gateway dans nginx

- Vérifier que l'API Flask est démarrée sur `127.0.0.1:5000`
- Vérifier la configuration nginx : `sudo nginx -t`
- Vérifier les logs nginx : `sudo tail -f /var/log/nginx/error.log`

### Les sessions ne sont pas créées

- Vérifier les permissions d'écriture sur `/tmp/winux_sessions.json`
- Vérifier les logs de l'API pour les erreurs
- Vérifier qu'un container ID est disponible (30001-30999)

### CORS errors dans le navigateur

- Vérifier que `flask-cors` est installé
- Vérifier que les headers CORS sont correctement configurés dans nginx
- Vérifier que l'API répond bien via le proxy nginx

## 📝 Notes Techniques

- Les sessions sont stockées dans `/tmp/winux_sessions.json` (modifiable)
- Chaque session utilise un container ID unique (30001-30999)
- L'IP est calculée automatiquement : `10.0.0.{container_id % 254 + 1}`
- Le nettoyage automatique vérifie toutes les minutes
- L'API utilise Flask-CORS pour gérer les requêtes cross-origin
- Compatible avec nginx en tant que reverse proxy

## 🔒 Sécurité

- L'API écoute uniquement sur `127.0.0.1` (localhost)
- Nginx fait office de reverse proxy public
- Les sessions expirent automatiquement
- Pas d'authentification par défaut (à ajouter si nécessaire)

## 🚀 Production

Pour la production, utilisez Gunicorn avec plusieurs workers :

```bash
pip install gunicorn
gunicorn -w 4 -b 127.0.0.1:5000 --access-logfile - --error-logfile - api_winux:app
```

Ou créez un service systemd :

```ini
[Unit]
Description=Winux API
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/winux
Environment="PATH=/usr/bin:/usr/local/bin"
ExecStart=/usr/local/bin/gunicorn -w 4 -b 127.0.0.1:5000 api_winux:app
Restart=always

[Install]
WantedBy=multi-user.target
```

## 📚 Dépendances

- Python 3.7+
- Flask 3.0.0+
- flask-cors 4.0.0+
- nginx (pour le reverse proxy)
