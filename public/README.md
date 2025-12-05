# Structure du site web

Ce dossier contient tous les fichiers statiques du site web déployé sur nginx.

## Structure

```
public/
├── index.html              # Page d'accueil
├── pages/                  # Pages supplémentaires
│   └── contact.html
├── assets/
│   ├── css/               # Feuilles de style
│   │   └── main.css
│   ├── js/                # Scripts JavaScript
│   └── images/            # Images
│       └── nv_sans_fond.png
└── README.md              # Ce fichier
```

## Déploiement

Le playbook Ansible déploie automatiquement tout le contenu de ce dossier dans `/var/www/html/` du container nginx.

