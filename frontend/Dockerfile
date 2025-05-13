# Étape 1 : Construire l'application Vue.js
FROM node:18 AS build-stage

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers du projet
COPY . .

# Assurer que tous les fichiers dans /app ont les bonnes permissions
RUN chmod -R 777 /app

# Construire l'application pour la production
RUN npm run build

# Étape 2 : Servir l'application avec un serveur web
FROM nginx:stable-alpine AS production-stage

# Copier les fichiers construits depuis l'étape précédente
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Exposer le port 80
EXPOSE 80

# Commande par défaut pour démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]
