# Nuit de l'Info 2025 - Projet Complet

Projet développé dans le cadre de la Nuit de l'Info 2025 par l'**USDJPA**. Ce projet comprend plusieurs composants : déploiement automatisé, API Winux, documentation IA éco-responsable, et système de gestion de sessions temporaires.

---

## Table des Matières

1. [Vue d'ensemble](#-vue-densemble)
2. [Architecture](#-architecture)
3. [Composants du Projet](#-composants-du-projet)
4. [Installation et Configuration](#-installation-et-configuration)
5. [Documentation Détaillée](#-documentation-détaillée)
6. [Déploiement](#-déploiement)
7. [Dépannage](#-dépannage)
8. [Ressources](#-ressources)

---

## Vue d'ensemble

Ce projet est une plateforme complète comprenant :

- **Site Web** : Interface principale avec pages de contact, diplômes, et documentation
- **API Winux** : Backend Node.js/Express pour gérer des sessions temporaires Windows
- **Documentation IA** : Documentation interactive sur les modèles d'IA et l'éco-responsabilité
- **CI/CD** : Déploiement automatique via Semaphore CI/CD et Ansible
- **Docker** : Conteneurisation pour un déploiement simplifié

---

## Architecture

### Architecture Globale

```
GitHub → Semaphore CI/CD → Ansible → Proxmox → Container LXC/Docker → Nginx
```

### Composants

- **GitHub** : Stocke le code source et les playbooks Ansible
- **Semaphore** : Automatise l'exécution des playbooks à chaque push
- **Ansible** : Orchestre la création et la configuration des containers
- **Proxmox** : Héberge les containers LXC et les machines virtuelles
- **Docker** : Conteneurisation de l'API Winux
- **Nginx** : Serveur web et reverse proxy
- **Node.js** : Backend API pour Winux

---

## Composants du Projet

### 1. Site Web Principal

Interface web accessible via nginx avec :
- Page d'accueil sur la dépendance numérique
- Formulaire de contact
- Générateur de diplômes
- Documentation IA éco-responsable

**Localisation** : `public/html/`

### 2. API Winux

API REST Node.js/Express pour gérer des sessions temporaires Windows :
- Création de sessions temporaires
- Gestion automatique de l'expiration
- Interface web pour lancer des sessions
- Compatible avec nginx en reverse proxy

**Localisation** : `api_winux.js`, `public/html/winux/`

**Documentation** : Voir [README_WINUX.md](README_WINUX.md)

### 3. Documentation IA Éco-Responsable

Documentation web interactive expliquant :
- Les modèles d'IA (ANN, CNN, RNN, Transformers)
- Les fondements mathématiques
- L'impact environnemental
- Les solutions éco-responsables
- Les LLM et la collecte de données

**Localisation** : `public/html/ia-eco-responsable/`, `docs/ia-eco-responsable/`

**Documentation** : Voir [docs/ia-eco-responsable/README.md](docs/ia-eco-responsable/README.md)

### 4. Déploiement Automatisé

Système de déploiement via :
- **Semaphore CI/CD** : Automatisation des déploiements
- **Ansible** : Orchestration de l'infrastructure
- **Docker** : Conteneurisation

**Documentation** : Voir [.semaphore/README_SEMAPHORE.md](.semaphore/README_SEMAPHORE.md)

---

## Installation et Configuration

### Prérequis

1. **Serveur Proxmox** accessible (ex: `10.0.0.100`)
2. **Semaphore CI/CD** installé et configuré
3. **Docker** >= 20.10 (pour l'API Winux)
4. **Node.js** >= 14.0.0 (pour l'API Winux)
5. **Nginx** (pour servir le site web)
6. **Compte GitHub** avec ce repository

### Installation Rapide

#### 1. Configuration Proxmox

1. Créez un utilisateur API dans Proxmox :
   - Utilisateur : `terraform@pam`
   - Token ID : `terraform`
   - Permissions : `TerraformProvision` sur `/` et `/nodes/pve1`

2. Configurez SSH :
   ```bash
   ssh-keygen -t ed25519 -f ~/.ssh/semaphore_proxmox -N "" -C "semaphore-proxmox"
   ssh-copy-id -i ~/.ssh/semaphore_proxmox.pub root@10.0.0.100
   ```

#### 2. Configuration Semaphore

1. Créez un projet dans Semaphore
2. Configurez l'environnement avec les variables :
   ```json
   {
     "proxmox_api_host": "10.0.0.100",
     "proxmox_api_user": "terraform@pam!terraform",
     "proxmox_api_token_secret": "VOTRE_TOKEN",
     "proxmox_node": "pve1",
     "proxmox_ssh_private_key": "VOTRE_CLE_PRIVEE"
   }
   ```

3. Créez un template de tâche pointant vers `ansible/create-debian-container.yml`

#### 3. Installation de l'API Winux

**Option A : Avec Docker (recommandé)**

```bash
# Avec Docker Compose
docker-compose up -d

# Vérifier
docker ps | grep winux-api
```

**Option B : Installation directe**

```bash
# Installer les dépendances
npm install

# Démarrer l'API
npm start
```

Voir [README_WINUX.md](README_WINUX.md) et [README_DOCKER.md](README_DOCKER.md) pour plus de détails.

#### 4. Configuration Nginx

Exemple de configuration pour l'API Winux :

```nginx
location /api/winux {
    proxy_pass http://127.0.0.1:5000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

---

## Documentation Détaillée

### Documentation par Composant

- **[README_WINUX.md](README_WINUX.md)** : Documentation complète de l'API Winux
  - Installation et configuration
  - Utilisation de l'API
  - Endpoints disponibles
  - Dépannage

- **[README_DOCKER.md](README_DOCKER.md)** : Guide de déploiement Docker
  - Déploiement avec Docker Compose
  - Configuration des containers
  - Monitoring et logs

- **[.semaphore/README_SEMAPHORE.md](.semaphore/README_SEMAPHORE.md)** : Guide CI/CD
  - Configuration Semaphore
  - Déploiement automatique
  - Pipeline de déploiement

- **[docs/ia-eco-responsable/README.md](docs/ia-eco-responsable/README.md)** : Documentation IA
  - Utilisation de la documentation
  - Structure des fichiers
  - Personnalisation

### Structure du Projet

```
nuit-info-2025/
├── ansible/                    # Playbooks Ansible
│   ├── create-debian-container.yml
│   ├── create-winux-session.yml
│   ├── deploy-winux-api-docker.yml
│   └── destroy-winux-session.yml
├── .semaphore/                 # Configuration Semaphore CI/CD
│   ├── winux-api.yml
│   └── README_SEMAPHORE.md
├── docs/                       # Documentation
│   └── ia-eco-responsable/
│       ├── index.html
│       ├── styles.css
│       ├── visualizations.js
│       └── README.md
├── public/                     # Fichiers web statiques
│   ├── html/
│   │   ├── index.html         # Page d'accueil
│   │   ├── contact/
│   │   ├── diplome/
│   │   ├── winux/             # Interface Winux
│   │   └── ia-eco-responsable/ # Documentation IA
│   ├── css/
│   └── js/
├── api_winux.js               # API Winux (Node.js)
├── Dockerfile                  # Image Docker pour l'API
├── docker-compose.yml          # Configuration Docker Compose
├── package.json               # Dépendances Node.js
├── README.md                  # Ce fichier
├── README_WINUX.md            # Documentation Winux
└── README_DOCKER.md           # Documentation Docker
```

---

##  Déploiement

### Déploiement Automatique

Le déploiement se fait automatiquement via Semaphore CI/CD :

1. **Push sur GitHub** → Semaphore détecte le changement
2. **Exécution du playbook Ansible** → Création/configuration du container
3. **Déploiement des fichiers** → Mise à jour du site web
4. **Redémarrage des services** → Application des changements

### Déploiement Manuel

#### Déployer le site web

```bash
# Via Ansible
ansible-playbook ansible/create-debian-container.yml

# Ou manuellement
scp -r public/* root@10.0.0.20:/var/www/html/
```

#### Déployer l'API Winux

**Avec Docker :**

```bash
# Sur le serveur
cd /opt/winux-api
docker-compose up -d --build
```

**Sans Docker :**

```bash
# Sur le serveur
npm install
pm2 start api_winux.js --name winux-api
```

Voir [README_WINUX.md](README_WINUX.md) pour plus de détails.

---

## Dépannage

### Problèmes Généraux

#### Le container ne se crée pas

- Vérifiez les permissions Proxmox
- Vérifiez que le token API est valide
- Consultez les logs Semaphore

#### L'API Winux ne répond pas

- Vérifiez que le container Docker tourne : `docker ps | grep winux-api`
- Vérifiez les logs : `docker logs winux-api`
- Testez l'API : `curl http://localhost:5000/api/winux/health`

#### Nginx ne sert pas les pages

- Vérifiez la configuration : `sudo nginx -t`
- Vérifiez les logs : `sudo tail -f /var/log/nginx/error.log`
- Vérifiez que les fichiers sont présents : `ls -la /var/www/html/`

### Dépannage par Composant

- **API Winux** : Voir [README_WINUX.md](README_WINUX.md) - Section Dépannage
- **Docker** : Voir [README_DOCKER.md](README_DOCKER.md) - Section Dépannage
- **Semaphore** : Voir [.semaphore/README_SEMAPHORE.md](.semaphore/README_SEMAPHORE.md) - Section Dépannage

---

## Utilisation

### Site Web

Accédez au site via votre navigateur :
- **Page d'accueil** : `http://votre-serveur/`
- **Contact** : `http://votre-serveur/contact/contact_form.html`
- **Diplômes** : `http://votre-serveur/diplome/diplome_form.html`
- **Documentation IA** : `http://votre-serveur/ia-eco-responsable/index.html`
- **Winux** : `http://votre-serveur/winux/`

### API Winux

**Endpoints disponibles :**

- `GET /api/winux/health` - Vérification de santé
- `GET /api/winux/sessions` - Lister les sessions
- `POST /api/winux/sessions` - Créer une session
- `GET /api/winux/sessions/<id>` - Obtenir une session
- `DELETE /api/winux/sessions/<id>` - Supprimer une session

**Exemple :**

```bash
# Créer une session
curl -X POST http://localhost:5000/api/winux/sessions \
  -H "Content-Type: application/json" \
  -d '{"duration_minutes": 30}'
```

Voir [README_WINUX.md](README_WINUX.md) pour plus d'exemples.

---

## Sécurité

### Recommandations

- L'API Winux écoute uniquement sur `127.0.0.1` (localhost)
- Nginx fait office de reverse proxy public
- Utilisez HTTPS en production
- Configurez un firewall approprié
- Limitez les accès SSH
- Utilisez des tokens API sécurisés

### Variables d'Environnement

Ne commitez jamais :
- Clés SSH privées
- Tokens API
- Mots de passe
- Informations sensibles

Utilisez les secrets Semaphore ou des fichiers `.env` (non versionnés).

---

## Performance

### Optimisations

- **Nginx** : Cache statique, compression gzip
- **Docker** : Images Alpine Linux (légères)
- **Node.js** : Gestion asynchrone native
- **CDN** : Pour les assets statiques (optionnel)

### Monitoring

- **Healthchecks** : `/api/winux/health`
- **Logs** : Docker logs, nginx logs, Semaphore logs
- **Métriques** : Utilisez des outils comme Prometheus (optionnel)

---

## Mise à Jour

### Mise à jour du Site Web

```bash
# Push sur GitHub → Déploiement automatique via Semaphore
git push origin main
```

### Mise à jour de l'API Winux

**Avec Docker :**

```bash
docker-compose build
docker-compose up -d
```

**Sans Docker :**

```bash
git pull
npm install
pm2 restart winux-api
```

---

## Ressources

### Documentation Externe

- [Documentation Proxmox API](https://pve.proxmox.com/pve-docs/api-viewer/)
- [Documentation Ansible](https://docs.ansible.com/)
- [Documentation Semaphore](https://docs.semaphoreui.com/)
- [Documentation Docker](https://docs.docker.com/)
- [Documentation Node.js](https://nodejs.org/docs/)
- [Documentation Nginx](https://nginx.org/en/docs/)

### Liens Utiles

- [GitHub Ansible Semaphore](https://github.com/ansible-semaphore/semaphore)
- [Express.js Documentation](https://expressjs.com/)
- [Chart.js Documentation](https://www.chartjs.org/)
- [MathJax Documentation](https://www.mathjax.org/)

---

## Auteurs

**Bros Insanity** - Nuit de l'Info 2025
Andreas Mulard
Romain Brouard
Tran Decaudin

---

## Licence

Ce projet a été développé dans le cadre de la Nuit de l'Info 2025.

---

## Support

Pour toute question ou problème :

1. Consultez la documentation détaillée de chaque composant
2. Vérifiez la section Dépannage
3. Consultez les logs des services
4. Ouvrez une issue sur GitHub

---

## Prochaines Étapes

1. Configuration de l'infrastructure
2. Déploiement du site web
3. Mise en place de l'API Winux
4.  Configuration CI/CD
5. Amélioration continue

---

**Note** : Ce README fusionne toutes les documentations du projet. Pour plus de détails sur un composant spécifique, consultez les README dédiés mentionnés dans ce document.
