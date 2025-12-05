# Dockerfile pour l'API Winux Node.js
FROM node:18-alpine

# Créer le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json package-lock.json* ./

# Installer les dépendances
RUN npm ci --only=production && npm cache clean --force

# Copier le code de l'application
COPY api_winux.js ./

# Créer le répertoire pour les sessions (volume monté)
RUN mkdir -p /tmp && chmod 777 /tmp

# Exposer le port
EXPOSE 5000

# Variables d'environnement par défaut
ENV NODE_ENV=production
ENV PORT=5000
ENV HOST=0.0.0.0

# Utilisateur non-root pour la sécurité
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001
USER nodejs

# Commande de démarrage
CMD ["node", "api_winux.js"]

