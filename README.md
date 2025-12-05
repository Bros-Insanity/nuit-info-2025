# Nuit de l'Info 2025 - Déploiement Automatique

## 📖 À propos du projet

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.

## 🏗️ Architecture

```
GitHub → Semaphore CI/CD → Ansible → Proxmox → Container LXC → Nginx
```

- **GitHub** : Stocke le code source et les playbooks Ansible
- **Semaphore** : Automatise l'exécution des playbooks à chaque push
- **Ansible** : Orchestre la création et la configuration du container
- **Proxmox** : Héberge le container LXC
- **Container** : Exécute nginx et sert la page web

## 📋 Prérequis

Avant de commencer, tu auras besoin de :

1. **Un serveur Proxmox** accessible (dans notre cas : `10.0.0.100`)
2. **Un serveur Ansible Semaphore** installé et configuré
   - Si tu n'as pas encore Semaphore, consulte la [documentation officielle](https://docs.semaphoreui.com/administration-guide/installation) pour l'installer
   - Dans notre cas : `https://semaphore.eidontrol.dev/`
3. **Un compte GitHub** avec ce repository
4. **Un utilisateur Proxmox** avec les permissions nécessaires (nous utilisons `terraform@pam`)

## 🔧 Guide d'installation

Ce projet permet de déployer automatiquement un serveur web sur Proxmox via Semaphore CI/CD. Chaque fois que tu pousses du code sur GitHub, Semaphore lance automatiquement un playbook Ansible qui crée un container Debian, installe nginx et déploie ta page web.

### 1. Configuration Proxmox

#### Créer un utilisateur API

1. Connecte-toi à l'interface Proxmox
2. Va dans **Datacenter** → **Permissions** → **Users**
3. Crée un utilisateur `terraform@pam` (ou utilise un utilisateur existant)
4. Crée un **API Token** pour cet utilisateur :
   - **Token ID** : `terraform`
   - **Privilege Separation** : Activé
   - **Permissions** : Donne les rôles suivants :
     - `TerraformProvision` sur `/` (avec propagation)
     - `TerraformProvision` sur `/nodes/pve1` (avec propagation)
     - `Datastore.AllocateSpace` et `Datastore.Audit` sur `/storage/local`

#### Configurer SSH pour l'accès root

1. Génère une paire de clés SSH sur ta machine :
   ```bash
   ssh-keygen -t ed25519 -f ~/.ssh/semaphore_proxmox -N "" -C "semaphore-proxmox"
   ```

2. Ajoute la clé publique sur Proxmox :
   ```bash
   ssh-copy-id -i ~/.ssh/semaphore_proxmox.pub root@10.0.0.100
   ```
   
   Ou manuellement :
   ```bash
   cat ~/.ssh/semaphore_proxmox.pub | ssh root@10.0.0.100 "cat >> ~/.ssh/authorized_keys"
   ```

3. Note la clé privée (tu en auras besoin pour Semaphore) :
   ```bash
   cat ~/.ssh/semaphore_proxmox
   ```

### 2. Configuration Semaphore

#### Créer un projet

1. Connecte-toi à Semaphore (`https://semaphore.eidontrol.dev/`)
2. Va dans **Projects** → **New Project**
3. Nomme-le (ex: "Nuit Info 2025")
4. Connecte le repository GitHub

#### Configurer l'environnement

1. Va dans **Environments** → **New Environment**
2. Nomme-le (ex: "Production")
3. Ajoute les variables suivantes en JSON :

```json
{
  "proxmox_api_host": "10.0.0.100",
  "proxmox_api_user": "terraform@pam!terraform",
  "proxmox_api_token_secret": "TON_TOKEN_SECRET_ICI",
  "proxmox_node": "pve1",
  "proxmox_ssh_private_key": "-----BEGIN OPENSSH PRIVATE KEY-----\nTA_CLE_PRIVEE_ICI_AVEC_\\n_POUR_LES_RETOURS_LIGNE\n-----END OPENSSH PRIVATE KEY-----"
}
```

**Important pour la clé SSH :**
- Remplace tous les retours à la ligne par `\n`
- Tout doit être sur une seule ligne dans le JSON
- Utilise la clé privée que tu as générée à l'étape précédente

#### Créer un template de tâche

1. Va dans **Task Templates** → **New Template**
2. Configure :
   - **Name** : "Create Debian Container"
   - **Playbook** : `ansible/create-debian-container.yml`
   - **Inventory** : `ansible/inventory` (ou laisse vide si tu utilises `localhost`)
   - **Environment** : Sélectionne l'environnement que tu viens de créer
   - **Repository** : Sélectionne ce repository

3. Sauvegarde le template

#### Configurer la clé SSH pour GitHub (si nécessaire)

1. Va dans **Key Store** → **New Key**
2. Ajoute ta clé SSH GitHub (pour cloner le repo)
3. Assure-toi que le template utilise cette clé

### 3. Premier déploiement

1. Lance manuellement le template depuis Semaphore
2. Vérifie les logs pour voir si tout se passe bien
3. Une fois terminé, ton site devrait être accessible sur `http://10.0.0.20/`

## 📝 Structure du projet

```
nuit-info-2025/
├── ansible/
│   └── create-debian-container.yml  # Playbook principal
├── test.html                         # Page web à déployer
└── README.md                         # Ce fichier
```

### Comment ça marche ?

Le playbook Ansible fait :

1. **Vérifie si le container existe** (ID 30000)
   - Si oui, le supprime pour repartir de zéro

2. **Télécharge le template Debian** si nécessaire
   - Utilise `debian-12-standard` depuis les serveurs Proxmox

3. **Crée le container LXC** avec :
   - IP fixe : `10.0.0.20/24`
   - Gateway : `10.0.0.254`
   - DNS : `1.1.1.1`
   - 512 MB RAM, 1 CPU, 8 GB disque

4. **Installe nginx et curl** via SSH
   - Se connecte au serveur Proxmox
   - Utilise `pct exec` pour exécuter les commandes dans le container

5. **Télécharge et déploie test.html**
   - Récupère le fichier depuis GitHub
   - Le place dans `/var/www/html/index.html`

6. **Démarre nginx**
   - Active et démarre le service nginx

### Déploiement automatique

Une fois configuré, chaque fois que tu :
- Pousses du code sur GitHub
- Lance manuellement le template dans Semaphore

Le container sera recréé avec la dernière version de `test.html`.

### Dépannage

### Le container ne se crée pas

- Vérifie que l'utilisateur Proxmox a les bonnes permissions
- Vérifie que le token API est valide
- Regarde les logs Semaphore pour voir l'erreur exacte

### SSH ne fonctionne pas

- Vérifie que la clé publique est bien dans `~/.ssh/authorized_keys` sur Proxmox
- Vérifie que la clé privée dans Semaphore est correctement formatée (avec `\n`)
- Teste la connexion SSH manuellement : `ssh -i /chemin/vers/cle root@10.0.0.100`

### Nginx ne s'installe pas

- Vérifie que le container a bien démarré
- Regarde les logs du container : `pct exec 30000 -- journalctl -u nginx`
- Vérifie que le container a accès à Internet pour télécharger les paquets

### La page ne s'affiche pas

- Vérifie que nginx est bien démarré : `pct exec 30000 -- systemctl status nginx`
- Vérifie que le fichier existe : `pct exec 30000 -- ls -la /var/www/html/`
- Teste la connexion : `curl http://10.0.0.20/`

## 📚 Ressources

- [Documentation Proxmox API](https://pve.proxmox.com/pve-docs/api-viewer/)
- [Documentation Ansible](https://docs.ansible.com/)
- [Documentation Ansible Semaphore](https://docs.semaphoreui.com/)
- [GitHub Ansible Semaphore](https://github.com/ansible-semaphore/semaphore)

## 👥 Auteurs

Bros Insanity - Nuit de l'Info 2025

---

**Note** : Ce projet a été développé dans le cadre de la Nuit de l'Info 2025. Il démontre comment automatiser le déploiement d'applications web sur infrastructure Proxmox via CI/CD.
