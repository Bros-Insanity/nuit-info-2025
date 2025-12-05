# 🚀 Winux - Client Web + Backend API Node.js

Système de sessions temporaires Winux avec interface web et API backend Node.js/Express compatible nginx.

> 📖 **Pour le déploiement avec Semaphore CI/CD, consultez [DEPLOYMENT_WINUX.md](DEPLOYMENT_WINUX.md)**

## 📋 Description

Cette branche contient :
- **Client web** : Interface HTML/JavaScript moderne pour lancer et gérer les sessions
- **API backend Node.js** : API Express simple et performante compatible avec nginx

## 🗂️ Structure

```
.
├── api_winux.js              # API Express backend (Node.js)
├── package.json              # Dépendances Node.js
├── nginx_winux.conf.example  # Exemple de configuration nginx
├── winux-api-nodejs.service.example  # Service systemd pour Node.js
├── README_WINUX.md           # Cette documentation
└── public/
    └── html/
        └── winux/
            └── index.html    # Interface client Winux
```

## 🔧 Installation

### Prérequis

- Node.js >= 14.0.0
- npm >= 6.0.0

### 1. Installer les dépendances Node.js

```bash
npm install
```

Ou avec yarn :

```bash
yarn install
```

### 2. Démarrer l'API

**Mode développement :**

```bash
npm start
```

Ou directement :

```bash
node api_winux.js
```

L'API sera accessible sur `http://127.0.0.1:5000`

**Mode production avec nodemon (auto-reload) :**

```bash
npm run dev
```

**Note** : Pour la production, utilisez un gestionnaire de processus comme PM2 :

```bash
npm install -g pm2
pm2 start api_winux.js --name winux-api
pm2 save
pm2 startup
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

### Variables d'environnement

L'API peut être configurée via des variables d'environnement :

```bash
export PORT=5000              # Port d'écoute (défaut: 5000)
export HOST=127.0.0.1         # Adresse d'écoute (défaut: 127.0.0.1)
export NODE_ENV=production    # Environnement (production/development)
```

### Durée de session par défaut

Modifier dans `api_winux.js` :

```javascript
const SESSION_DURATION_MINUTES = 30; // Changer la valeur (en minutes)
```

### Plage de container IDs

Modifier dans `api_winux.js` :

```javascript
const CONTAINER_ID_MIN = 30001;
const CONTAINER_ID_MAX = 30999;
```

### Fichier de stockage des sessions

Par défaut, les sessions sont stockées dans `/tmp/winux_sessions.json`. Pour changer :

```javascript
const SESSIONS_FILE = '/chemin/vers/votre/fichier.json';
```

## 🔍 Dépannage

### L'API ne répond pas

- Vérifier que Node.js est démarré : `ps aux | grep node`
- Vérifier les logs de l'API
- Vérifier que le port 5000 n'est pas utilisé : `netstat -tuln | grep 5000` ou `lsof -i :5000`
- Vérifier que Node.js est installé : `node --version`

### Erreur 502 Bad Gateway dans nginx

- Vérifier que l'API Node.js est démarrée sur `127.0.0.1:5000`
- Vérifier la configuration nginx : `sudo nginx -t`
- Vérifier les logs nginx : `sudo tail -f /var/log/nginx/error.log`
- Vérifier les logs de l'API Node.js

### Les sessions ne sont pas créées

- Vérifier les permissions d'écriture sur `/tmp/winux_sessions.json`
- Vérifier les logs de l'API pour les erreurs
- Vérifier qu'un container ID est disponible (30001-30999)
- Vérifier que les dépendances sont installées : `npm list`

### CORS errors dans le navigateur

- Vérifier que `cors` est installé : `npm list cors`
- Vérifier que les headers CORS sont correctement configurés dans nginx
- Vérifier que l'API répond bien via le proxy nginx

### Erreur "Cannot find module"

- Réinstaller les dépendances : `rm -rf node_modules && npm install`
- Vérifier que `package.json` est correct
- Vérifier la version de Node.js : `node --version` (doit être >= 14.0.0)

## 📝 Notes Techniques

- Les sessions sont stockées dans `/tmp/winux_sessions.json` (modifiable)
- Chaque session utilise un container ID unique (30001-30999)
- L'IP est calculée automatiquement : `10.0.0.{container_id % 254 + 1}`
- Le nettoyage automatique vérifie toutes les minutes
- L'API utilise `cors` pour gérer les requêtes cross-origin
- Compatible avec nginx en tant que reverse proxy
- Utilise Express.js pour le routage et la gestion des requêtes
- Utilise UUID v4 pour générer les IDs de session

## 🔒 Sécurité

- L'API écoute uniquement sur `127.0.0.1` (localhost)
- Nginx fait office de reverse proxy public
- Les sessions expirent automatiquement
- Pas d'authentification par défaut (à ajouter si nécessaire)
- Gestion des erreurs non capturées pour éviter les crashes

## 🐳 Déploiement Docker

### Avec Docker Compose (recommandé)

```bash
# Construire et démarrer
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter
docker-compose down
```

Voir `README_DOCKER.md` pour plus de détails.

### Avec Docker manuel

```bash
# Construire l'image
docker build -t winux-api:latest .

# Lancer le container
docker run -d \
  --name winux-api \
  --restart unless-stopped \
  -p 127.0.0.1:5000:5000 \
  -v /tmp:/tmp:rw \
  -e NODE_ENV=production \
  winux-api:latest
```

## 🚀 Production

### Avec Docker (recommandé)

Voir la section "Déploiement Docker" ci-dessus.

### Avec PM2

```bash
# Installation globale
npm install -g pm2

# Démarrer l'API
pm2 start api_winux.js --name winux-api

# Sauvegarder la configuration
pm2 save

# Configurer le démarrage automatique
pm2 startup
pm2 save
```

### Avec systemd

Copiez le fichier de service :

```bash
sudo cp winux-api-nodejs.service.example /etc/systemd/system/winux-api.service
```

Modifiez le fichier pour adapter les chemins, puis :

```bash
sudo systemctl daemon-reload
sudo systemctl enable winux-api
sudo systemctl start winux-api
```

Vérifier le statut :

```bash
sudo systemctl status winux-api
```

### Variables d'environnement en production

Créez un fichier `.env` (ou utilisez systemd) :

```bash
PORT=5000
HOST=127.0.0.1
NODE_ENV=production
```

## 📊 Performance

- Node.js/Express est très performant pour les APIs REST
- Gestion asynchrone des opérations I/O
- Nettoyage automatique en arrière-plan
- Pas de blocage du thread principal

## 🔄 Migration depuis Python/Flask

Si vous migrez depuis la version Python :

1. Les fichiers de sessions JSON sont compatibles (même format)
2. Les endpoints API sont identiques
3. La configuration nginx reste la même
4. Seul le backend change (Node.js au lieu de Python)

## 📚 Dépendances

- **express** : Framework web pour Node.js
- **cors** : Middleware pour gérer CORS
- **uuid** : Génération d'UUIDs pour les sessions

### Dépendances de développement

- **nodemon** : Auto-reload en développement (optionnel)

## 🆚 Avantages Node.js vs Python

- ✅ Performance élevée pour les APIs REST
- ✅ Gestion asynchrone native
- ✅ Écosystème npm riche
- ✅ Déploiement simple
- ✅ Pas besoin d'environnement virtuel Python
- ✅ Meilleure intégration avec le frontend JavaScript
