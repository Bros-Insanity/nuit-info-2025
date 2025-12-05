# 🚀 Winux - Client Web

Interface web client pour Winux - Système de sessions temporaires Linux avec accès RDP.

## 📋 Description

Cette branche contient uniquement le **client web** de Winux. Il s'agit d'une interface HTML/JavaScript moderne permettant aux utilisateurs de lancer et gérer des sessions Winux temporaires.

## 🗂️ Structure

```
public/
  └── html/
      └── winux/
          └── index.html  # Interface client Winux
```

## 🎯 Fonctionnalités

- **Création de session** : Lancer une nouvelle session Winux temporaire
- **Affichage des informations** : Afficher les détails de la session (IP, port RDP, etc.)
- **Compteur de temps** : Afficher le temps restant avant expiration
- **Destruction de session** : Terminer une session manuellement
- **Rafraîchissement automatique** : Mise à jour automatique des informations toutes les 30 secondes
- **Interface moderne** : Design responsive avec animations

## 🔧 Configuration

Le client communique avec une API backend via `/api/winux`. Assurez-vous que :

1. L'API backend est accessible sur `/api/winux`
2. Le serveur web est configuré pour servir les fichiers statiques
3. Le proxy nginx (ou équivalent) est configuré pour rediriger `/api/winux` vers l'API backend

### Exemple de configuration nginx

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

## 🎨 Interface

L'interface est entièrement contenue dans un seul fichier HTML avec :
- CSS intégré pour le style
- JavaScript intégré pour la logique
- Design responsive et moderne
- Animations et transitions fluides

## 📝 Notes

- Ce client nécessite une API backend pour fonctionner
- L'API doit implémenter les endpoints suivants :
  - `POST /api/winux/sessions` : Créer une session
  - `GET /api/winux/sessions` : Lister les sessions
  - `GET /api/winux/sessions/<session_id>` : Obtenir les infos d'une session
  - `DELETE /api/winux/sessions/<session_id>` : Supprimer une session

## 🚀 Utilisation

1. Déployer le fichier `public/html/winux/index.html` sur votre serveur web
2. Configurer le serveur web pour servir les fichiers statiques
3. Configurer le proxy pour l'API backend
4. Accéder à `/winux/` ou `/winux/index.html` dans un navigateur
