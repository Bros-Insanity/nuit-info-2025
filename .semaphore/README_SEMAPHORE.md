# 🚀 Déploiement Winux API avec Semaphore CI/CD

Guide pour configurer le déploiement automatique de l'API Winux Node.js via Semaphore CI/CD.

## 📋 Prérequis

1. **Semaphore CI/CD** installé et configuré
2. **Accès SSH** au serveur de déploiement (Proxmox ou autre)
3. **Docker** installé sur le serveur de déploiement
4. **Docker Compose** installé sur le serveur de déploiement

## 🔧 Configuration Semaphore

### 1. Créer les secrets nécessaires

Dans Semaphore, allez dans **Secrets** et créez :

#### Secret: `proxmox-ssh-key`
- **Type**: File
- **Contenu**: Votre clé SSH privée pour accéder au serveur
- **Nom du fichier**: `proxmox_key`

#### Secret: `proxmox-host`
- **Type**: Env Var
- **Variable**: `PROXMOX_HOST`
- **Valeur**: L'adresse IP ou hostname de votre serveur (ex: `10.0.0.100`)

### 2. Créer un nouveau projet dans Semaphore

1. Allez dans **Projects** → **New Project**
2. Sélectionnez votre repository GitHub
3. Configurez les paramètres du projet

### 3. Créer un nouveau template

1. Dans votre projet, allez dans **Templates** → **New Template**
2. Nommez-le : `Winux API Deployment`
3. Sélectionnez le fichier de configuration :
   - **Option 1 (recommandée)** : `.semaphore/winux-api.yml` - Déploiement complet avec tests
   - **Option 2 (simple)** : `.semaphore/winux-api-simple.yml` - Déploiement rapide

### 4. Configurer le template

Dans les paramètres du template :

- **Repository**: Votre repository GitHub
- **Branch**: `winux-nodejs` (ou la branche que vous utilisez)
- **Playbook File**: `.semaphore/winux-api.yml` (ou `winux-api-simple.yml`)
- **Secrets**: Sélectionnez `proxmox-ssh-key` et `proxmox-host`

## 🚀 Utilisation

### Déploiement automatique

Le pipeline se déclenche automatiquement à chaque push sur la branche configurée.

### Déploiement manuel

1. Allez dans Semaphore
2. Sélectionnez votre projet
3. Cliquez sur **Run** sur le template "Winux API Deployment"
4. Sélectionnez la branche à déployer
5. Cliquez sur **Start**

## 📊 Étapes du pipeline

### Version complète (winux-api.yml)

1. **Build Docker Image** : Construit l'image Docker de l'API
2. **Test API Health** : Teste que l'API fonctionne dans un container
3. **Deploy to Server** : Déploie l'API sur le serveur

### Version simple (winux-api-simple.yml)

1. **Build and Deploy** : Construit l'image et la déploie directement

## 🔍 Vérification

Après le déploiement, vérifiez que l'API fonctionne :

```bash
# Depuis le serveur
curl http://localhost:5000/api/winux/health

# Vérifier le container
docker ps | grep winux-api

# Voir les logs
docker logs winux-api
```

## ⚙️ Configuration serveur

### Prérequis sur le serveur

```bash
# Installer Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Installer Docker Compose
apt-get update
apt-get install -y docker-compose-plugin

# Ou avec pip
pip install docker-compose
```

### Structure des fichiers sur le serveur

Les fichiers seront déployés dans `/opt/winux-api/` :

```
/opt/winux-api/
├── Dockerfile
├── docker-compose.yml
├── api_winux.js
└── package.json
```

## 🔄 Mise à jour

Pour mettre à jour l'API :

1. Faites vos modifications
2. Committez et pushez sur la branche configurée
3. Semaphore déclenchera automatiquement le déploiement
4. Ou lancez manuellement le template dans Semaphore

## 🐛 Dépannage

### Le build échoue

- Vérifiez les logs Semaphore
- Vérifiez que Docker est installé sur l'agent Semaphore
- Vérifiez que le Dockerfile est correct

### Le déploiement échoue

- Vérifiez que la clé SSH est correcte dans Semaphore
- Vérifiez que le serveur est accessible
- Vérifiez que Docker est installé sur le serveur
- Vérifiez les logs SSH dans Semaphore

### L'API ne répond pas après déploiement

- Connectez-vous au serveur : `ssh root@${PROXMOX_HOST}`
- Vérifiez le container : `docker ps | grep winux-api`
- Voir les logs : `docker logs winux-api`
- Tester l'API : `curl http://localhost:5000/api/winux/health`

### Problèmes de permissions

- Vérifiez que `/tmp` est accessible en écriture
- Vérifiez les permissions du répertoire `/opt/winux-api`

## 📝 Notes

- Le container écoute sur `127.0.0.1:5000` côté hôte
- Nginx doit être configuré pour proxy vers `http://127.0.0.1:5000`
- Les sessions sont stockées dans `/tmp/winux_sessions.json`
- Le container redémarre automatiquement en cas de crash

## 🔗 Liens utiles

- [Documentation Semaphore](https://docs.semaphoreui.com/)
- [Documentation Docker](https://docs.docker.com/)
- [Documentation Docker Compose](https://docs.docker.com/compose/)

