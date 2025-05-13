FROM node:18 

WORKDIR /app

COPY package*.json ./

# ci signifie clean install et --quiet réduit les messages logs qui n'ont aucune utilité
RUN npm ci --quiet 

# Forcer l'installation d'express 4.17.1 si tu rencontres un problème avec la version 5.1.0
RUN npm install express@4.17.1 --save

COPY . . 

EXPOSE 3000

# change l'utilisateur en non-root, avec moins de privilèges.
USER node

CMD [ "node","index.js" ]