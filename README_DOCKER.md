# 🐳 Winux API - Déploiement Docker

Guide pour déployer l'API Winux dans un container Docker.

## 📋 Prérequis

- Docker >= 20.10
- Docker Compose >= 2.0 (optionnel mais recommandé)

## 🚀 Déploiement rapide avec Docker Compose

### 1. Construire et démarrer le container

```bash
docker-compose up -d
```

### 2. Vérifier que le container tourne

```bash
docker-compose ps
```

### 3. Voir les logs

```bash
docker-compose logs -f winux-api
```

### 4. Arrêter le container

```bash
docker-compose down
```

## 🔧 Déploiement manuel avec Docker

### 1. Construire l'image

```bash
docker build -t winux-api:latest .
```

### 2. Lancer le container

```bash
docker run -d \
  --name winux-api \
  --restart unless-stopped \
  -p 127.0.0.1:5000:5000 \
  -v /tmp:/tmp:rw \
  -e NODE_ENV=production \
  -e PORT=5000 \
  -e HOST=0.0.0.0 \
  winux-api:latest
```

### 3. Vérifier que le container tourne

```bash
docker ps | grep winux-api
```

### 4. Voir les logs

```bash
docker logs -f winux-api
```

### 5. Arrêter le container

```bash
docker stop winux-api
docker rm winux-api
```

## 🔍 Vérification

### Tester l'API depuis l'hôte

```bash
curl http://localhost:5000/api/winux/health
```

Réponse attendue :

```json
{
  "success": true,
  "status": "healthy",
  "message": "API Winux opérationnelle"
}
```

## ⚙️ Configuration

### Variables d'environnement

Vous pouvez modifier les variables d'environnement dans `docker-compose.yml` :

```yaml
environment:
  - NODE_ENV=production
  - PORT=5000
  - HOST=0.0.0.0
```

### Volume pour les sessions

Le fichier de sessions est stocké dans `/tmp/winux_sessions.json` sur l'hôte via un volume monté :

```yaml
volumes:
  - /tmp:/tmp:rw
```

Pour changer l'emplacement, modifiez le volume dans `docker-compose.yml`.

## 🔄 Mise à jour

### Avec Docker Compose

```bash
# Reconstruire l'image
docker-compose build

# Redémarrer le container
docker-compose up -d
```

### Avec Docker

```bash
# Arrêter le container
docker stop winux-api
docker rm winux-api

# Reconstruire l'image
docker build -t winux-api:latest .

# Relancer le container
docker run -d \
  --name winux-api \
  --restart unless-stopped \
  -p 127.0.0.1:5000:5000 \
  -v /tmp:/tmp:rw \
  -e NODE_ENV=production \
  winux-api:latest
```

## 🔒 Sécurité

- Le container écoute uniquement sur `127.0.0.1:5000` côté hôte (via le port mapping)
- Nginx fait office de reverse proxy public
- Le container utilise un utilisateur non-root (`nodejs`)
- Image Alpine Linux (légère et sécurisée)

## 🌐 Intégration avec nginx

La configuration nginx reste identique. Le container expose l'API sur `127.0.0.1:5000` de l'hôte, donc nginx peut y accéder directement :

```nginx
location /api/winux {
    proxy_pass http://127.0.0.1:5000;
    # ... reste de la configuration
}
```

## 📊 Monitoring

### Healthcheck

Le container inclut un healthcheck qui vérifie l'endpoint `/api/winux/health` toutes les 30 secondes.

Vérifier le statut :

```bash
docker inspect winux-api | grep -A 10 Health
```

### Logs

```bash
# Logs en temps réel
docker-compose logs -f

# Dernières 100 lignes
docker-compose logs --tail=100
```

## 🐛 Dépannage

### Le container ne démarre pas

```bash
# Voir les logs d'erreur
docker-compose logs winux-api

# Vérifier les ressources
docker stats winux-api
```

### L'API ne répond pas

```bash
# Vérifier que le container tourne
docker ps | grep winux-api

# Tester depuis l'intérieur du container
docker exec winux-api wget -q -O- http://localhost:5000/api/winux/health

# Vérifier les ports
netstat -tuln | grep 5000
```

### Problèmes de permissions sur /tmp

Si vous avez des problèmes d'écriture dans `/tmp`, vérifiez les permissions :

```bash
# Depuis l'hôte
ls -la /tmp/winux_sessions.json

# Depuis le container
docker exec winux-api ls -la /tmp/winux_sessions.json
```

## 🔄 Redémarrage automatique

Le container est configuré avec `restart: unless-stopped`, ce qui signifie qu'il redémarrera automatiquement en cas de crash ou après un redémarrage de l'hôte.

## 📝 Notes

- L'image est basée sur `node:18-alpine` (légère, ~50MB)
- Le container utilise un utilisateur non-root pour la sécurité
- Les sessions sont persistées via un volume monté
- Le healthcheck permet à Docker de détecter si l'API est en panne

