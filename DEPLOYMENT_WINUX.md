# 🚀 Guide de Déploiement Winux API avec Semaphore

Guide complet pour déployer l'API Winux Node.js dans un container Docker via Semaphore CI/CD.

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture](#architecture)
3. [Prérequis](#prérequis)
4. [Configuration Semaphore](#configuration-semaphore)
5. [Variables d'environnement](#variables-denvironnement)
6. [Déploiement](#déploiement)
7. [Vérification](#vérification)
8. [Dépannage](#dépannage)
9. [Structure des fichiers](#structure-des-fichiers)

## 🎯 Vue d'ensemble

Ce guide explique comment déployer automatiquement l'API Winux Node.js dans un container Docker LXC sur Proxmox via Semaphore CI/CD.

**Fonctionnalités :**
- ✅ Déploiement automatique à chaque push
- ✅ Installation automatique de Docker et Docker Compose
- ✅ Configuration automatique de nginx comme reverse proxy
- ✅ Health checks et vérifications
- ✅ Gestion des erreurs et logs détaillés

## 🏗️ Architecture

```
GitHub → Semaphore CI/CD → Ansible → Proxmox → Container LXC → Docker → API Winux Node.js
                                                              ↓
                                                          Nginx (proxy)
```

**Flux de déploiement :**
1. Push sur GitHub déclenche Semaphore
2. Semaphore exécute le playbook Ansible `.semaphore/winux-api.yml`
3. Ansible se connecte au serveur Proxmox via SSH
4. Installation de Docker dans le container LXC
5. Clonage du repository et copie des fichiers
6. Construction et démarrage du container Docker
7. Configuration de nginx pour proxy vers l'API
8. Vérification de santé de l'API

## 📦 Prérequis

### Sur le serveur Proxmox

1. **Container LXC existant** avec :
   - Debian 12 (ou similaire)
   - Accès root
   - Connexion réseau fonctionnelle
   - Au moins 1GB RAM et 5GB disque

2. **Accès SSH** configuré :
   - Clé SSH publique ajoutée sur Proxmox
   - Accès root@proxmox_api_host fonctionnel

### Dans Semaphore

1. **Semaphore Ansible Semaphore** installé et configuré
2. **Repository GitHub** connecté
3. **Environnement** créé avec les variables nécessaires

## ⚙️ Configuration Semaphore

### 1. Créer un projet

1. Connectez-vous à Semaphore
2. Allez dans **Projects** → **New Project**
3. Nommez le projet (ex: "Nuit Info 2025")
4. Connectez le repository GitHub

### 2. Créer un environnement

1. Allez dans **Environments** → **New Environment**
2. Nommez-le (ex: "Production")
3. Ajoutez les variables d'environnement (voir section suivante)

### 3. Créer un template

1. Allez dans **Templates** → **New Template**
2. Configurez :
   - **Name** : `Winux API Deployment`
   - **Repository** : Votre repository
   - **Playbook File** : `.semaphore/winux-api.yml`
   - **Environment** : L'environnement créé précédemment
   - **Inventory** : Créez un inventaire avec `localhost` ou laissez vide

### 4. Configurer l'inventaire (optionnel)

Si vous utilisez un inventaire :
- Créez un fichier d'inventaire avec `localhost`
- Ou laissez Semaphore utiliser l'inventaire par défaut

## 🔐 Variables d'environnement

Configurez ces variables dans l'environnement Semaphore :

### Variables requises

```json
{
  "proxmox_api_host": "10.0.0.100",
  "proxmox_ssh_private_key": "-----BEGIN OPENSSH PRIVATE KEY-----\n...\n-----END OPENSSH PRIVATE KEY-----",
  "container_id": "30000"
}
```

### Variables optionnelles

```json
{
  "proxmox_ssh_key_path": "/path/to/key",
  "github_branch": "winux-nodejs",
  "github_repo": "Bros-Insanity/nuit-info-2025"
}
```

### Détails des variables

| Variable | Description | Exemple | Requis |
|----------|-------------|---------|--------|
| `proxmox_api_host` | Adresse IP ou hostname du serveur Proxmox | `10.0.0.100` | ✅ |
| `proxmox_ssh_private_key` | Clé SSH privée pour accéder à Proxmox | `-----BEGIN...` | ✅ |
| `container_id` | ID du container LXC cible | `30000` | ✅ |
| `proxmox_ssh_key_path` | Chemin vers la clé SSH (alternative) | `/tmp/key` | ❌ |
| `github_branch` | Branche à déployer | `winux-nodejs` | ❌ |
| `github_repo` | Repository GitHub | `Bros-Insanity/nuit-info-2025` | ❌ |

**⚠️ Important pour la clé SSH :**
- Utilisez `\n` pour les retours à la ligne dans JSON
- La clé doit être complète (BEGIN à END)
- Pas d'espaces supplémentaires

## 🚀 Déploiement

### Déploiement automatique

Le déploiement se déclenche automatiquement à chaque push sur la branche configurée.

### Déploiement manuel

1. Allez dans Semaphore → Votre projet
2. Cliquez sur **Run** sur le template "Winux API Deployment"
3. Sélectionnez la branche (ex: `winux-nodejs`)
4. Cliquez sur **Start**

### Étapes du déploiement

Le playbook exécute les étapes suivantes :

1. **Préparation SSH**
   - Création du fichier de clé SSH
   - Validation de la clé
   - Test de connexion à Proxmox

2. **Installation Docker**
   - Vérification de Docker
   - Installation si nécessaire
   - Démarrage du service Docker

3. **Installation Docker Compose**
   - Vérification de Docker Compose
   - Installation si nécessaire

4. **Déploiement de l'API**
   - Clonage du repository
   - Copie des fichiers (Dockerfile, docker-compose.yml, api_winux.js, package.json)
   - Arrêt de l'ancien container
   - Construction de l'image Docker
   - Démarrage du container

5. **Configuration nginx**
   - Vérification/installation de nginx
   - Configuration du proxy vers `/api/winux`
   - Redémarrage de nginx

6. **Vérification**
   - Health check de l'API
   - Vérification du container Docker

## ✅ Vérification

### Vérifier le déploiement dans Semaphore

1. Allez dans **Tasks** → Votre tâche
2. Vérifiez les logs pour :
   - ✅ "SSH test result: SSH OK"
   - ✅ "Le container Docker a été démarré avec succès"
   - ✅ "Health check: ✅ OK"
   - ✅ "Nginx configuré avec proxy vers /api/winux ✅"

### Vérifier sur le serveur

Connectez-vous au container LXC :

```bash
ssh root@proxmox_api_host
pct exec container_id -- bash
```

Vérifications :

```bash
# Vérifier Docker
docker ps | grep winux-api

# Vérifier l'API
curl http://localhost:5000/api/winux/health

# Vérifier nginx
nginx -t
systemctl status nginx

# Voir les logs Docker
docker logs winux-api
```

### Tester l'API depuis l'extérieur

```bash
# Depuis votre machine
curl http://IP_DU_CONTAINER/api/winux/health

# Ou via nginx
curl http://IP_DU_CONTAINER/api/winux/sessions
```

## 🐛 Dépannage

### Erreur : "SSH key not configured or connection failed"

**Cause :** Problème de connexion SSH

**Solutions :**
- Vérifiez que `proxmox_ssh_private_key` est correctement formatée dans Semaphore
- Vérifiez que la clé publique est sur Proxmox : `cat ~/.ssh/authorized_keys`
- Testez la connexion manuellement : `ssh -i key root@proxmox_api_host`
- Vérifiez `proxmox_api_host` dans les variables

### Erreur : "Container ID not found"

**Cause :** Le container LXC n'existe pas

**Solutions :**
- Vérifiez que `container_id` correspond à un container existant
- Listez les containers : `pct list` sur Proxmox
- Vérifiez que le container est démarré : `pct status container_id`

### Erreur : "Docker installation failed"

**Cause :** Problème lors de l'installation de Docker

**Solutions :**
- Vérifiez les logs dans Semaphore pour l'erreur exacte
- Vérifiez que le container a assez de ressources (RAM, disque)
- Vérifiez la connexion internet du container
- Installez Docker manuellement pour voir l'erreur

### Erreur : "Health check failed"

**Cause :** L'API ne répond pas

**Solutions :**
- Vérifiez les logs du container : `docker logs winux-api`
- Vérifiez que le port 5000 n'est pas utilisé : `netstat -tuln | grep 5000`
- Vérifiez les permissions sur `/tmp/winux_sessions.json`
- Attendez quelques secondes (le container démarre)

### Erreur : "Nginx configuration failed"

**Cause :** Problème de configuration nginx

**Solutions :**
- Vérifiez la syntaxe nginx : `nginx -t`
- Vérifiez les logs nginx : `journalctl -u nginx`
- Vérifiez que nginx est installé : `which nginx`
- Vérifiez les permissions sur `/etc/nginx/`

### Le container Docker ne démarre pas

**Solutions :**
```bash
# Voir les logs
docker logs winux-api

# Vérifier les ressources
docker stats winux-api

# Redémarrer manuellement
cd /opt/winux-api
docker-compose down
docker-compose up -d
```

### L'API ne répond pas via nginx

**Solutions :**
- Vérifiez que le container Docker tourne : `docker ps`
- Vérifiez la configuration nginx : `cat /etc/nginx/sites-available/default`
- Testez directement l'API : `curl http://localhost:5000/api/winux/health`
- Vérifiez les logs nginx : `tail -f /var/log/nginx/error.log`

## 📁 Structure des fichiers

```
nuit-info-2025/
├── .semaphore/
│   └── winux-api.yml          # Playbook Ansible pour déploiement
├── api_winux.js               # API Node.js/Express
├── Dockerfile                  # Image Docker pour l'API
├── docker-compose.yml         # Configuration Docker Compose
├── package.json               # Dépendances Node.js
└── DEPLOYMENT_WINUX.md        # Cette documentation
```

### Fichiers déployés dans le container

```
/opt/winux-api/
├── Dockerfile
├── docker-compose.yml
├── api_winux.js
└── package.json
```

### Configuration nginx créée

```
/etc/nginx/sites-available/default
/etc/nginx/sites-enabled/default -> /etc/nginx/sites-available/default
```

## 🔄 Mise à jour

Pour mettre à jour l'API :

1. Faites vos modifications dans le code
2. Committez et pushez sur la branche `winux-nodejs`
3. Semaphore déclenchera automatiquement le déploiement
4. Ou lancez manuellement le template dans Semaphore

Le playbook va :
- Arrêter l'ancien container
- Construire une nouvelle image avec les modifications
- Démarrer le nouveau container
- Vérifier que tout fonctionne

## 📊 Monitoring

### Logs Semaphore

- Allez dans **Tasks** → Votre tâche → **Logs**
- Les logs montrent chaque étape du déploiement
- Les erreurs sont clairement indiquées

### Logs Docker

```bash
# Voir les logs en temps réel
docker logs -f winux-api

# Dernières 100 lignes
docker logs --tail=100 winux-api
```

### Logs nginx

```bash
# Logs d'accès
tail -f /var/log/nginx/access.log

# Logs d'erreur
tail -f /var/log/nginx/error.log
```

## 🔒 Sécurité

- ✅ L'API écoute uniquement sur `127.0.0.1:5000` (localhost)
- ✅ Nginx fait office de reverse proxy public
- ✅ Les sessions expirent automatiquement
- ✅ Container Docker isolé
- ✅ Utilisateur non-root dans le container Docker

## 📚 Ressources

- [Documentation Semaphore](https://docs.semaphoreui.com/)
- [Documentation Ansible](https://docs.ansible.com/)
- [Documentation Docker](https://docs.docker.com/)
- [Documentation nginx](https://nginx.org/en/docs/)

## 🆘 Support

En cas de problème :

1. Vérifiez les logs Semaphore
2. Vérifiez les logs Docker : `docker logs winux-api`
3. Vérifiez les logs nginx : `journalctl -u nginx`
4. Consultez la section [Dépannage](#dépannage)
5. Vérifiez la configuration des variables d'environnement

---

**Dernière mise à jour :** Décembre 2025

