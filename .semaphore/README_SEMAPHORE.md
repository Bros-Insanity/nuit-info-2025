# 🚀 Déploiement Winux API avec Semaphore

> 📖 **Documentation complète disponible dans [DEPLOYMENT_WINUX.md](../DEPLOYMENT_WINUX.md)**

Guide rapide pour configurer le déploiement automatique de l'API Winux Node.js via Semaphore CI/CD.

## 📋 Prérequis

1. **Semaphore Ansible Semaphore** installé et configuré
2. **Container LXC** existant sur Proxmox
3. **Accès SSH** au serveur Proxmox configuré

## ⚙️ Configuration rapide

### 1. Variables d'environnement dans Semaphore

Créez un environnement avec ces variables :

```json
{
  "proxmox_api_host": "10.0.0.100",
  "proxmox_ssh_private_key": "-----BEGIN OPENSSH PRIVATE KEY-----\n...\n-----END OPENSSH PRIVATE KEY-----",
  "container_id": "30000"
}
```

### 2. Créer le template

1. **Projects** → **New Project** → Connectez votre repository
2. **Templates** → **New Template**
3. Configurez :
   - **Name** : `Winux API Deployment`
   - **Playbook File** : `.semaphore/winux-api.yml`
   - **Environment** : Votre environnement avec les variables
   - **Repository** : Votre repository GitHub
   - **Branch** : `winux-nodejs`

### 3. Lancer le déploiement

- **Automatique** : Push sur `winux-nodejs` déclenche le déploiement
- **Manuel** : Cliquez sur **Run** dans Semaphore

## 📊 Ce que fait le playbook

1. ✅ Se connecte au serveur Proxmox via SSH
2. ✅ Installe Docker et Docker Compose dans le container LXC
3. ✅ Clone le repository et copie les fichiers
4. ✅ Construit et démarre le container Docker
5. ✅ Configure nginx pour proxy vers `/api/winux`
6. ✅ Vérifie que l'API fonctionne

## 🔍 Vérification

```bash
# Dans le container LXC
docker ps | grep winux-api
curl http://localhost:5000/api/winux/health

# Via nginx
curl http://IP_CONTAINER/api/winux/health
```

## 🐛 Dépannage rapide

| Problème | Solution |
|----------|----------|
| SSH failed | Vérifiez `proxmox_ssh_private_key` et `proxmox_api_host` |
| Container not found | Vérifiez `container_id` avec `pct list` |
| Docker install failed | Vérifiez les ressources du container (RAM, disque) |
| API not responding | Voir les logs : `docker logs winux-api` |
| Nginx not working | Vérifiez : `nginx -t` et `systemctl status nginx` |

## 📚 Documentation complète

Pour plus de détails, consultez **[DEPLOYMENT_WINUX.md](../DEPLOYMENT_WINUX.md)** qui contient :
- Guide complet étape par étape
- Détails de toutes les variables
- Dépannage approfondi
- Structure des fichiers
- Monitoring et logs

## 🔗 Liens utiles

- [Documentation Semaphore](https://docs.semaphoreui.com/)
- [Documentation Ansible](https://docs.ansible.com/)
- [Documentation Docker](https://docs.docker.com/)
