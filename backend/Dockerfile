FROM node:18 

WORKDIR /app

COPY package*.json ./

# ci signifie clean install et --quiet réduit les messages logs qui n'ont aucune utilité
RUN npm ci --quiet 

COPY . . 

EXPOSE 3000

# change l'utilisateur en non-root, avec moins de privilèges.
USER node

CMD [ "node","app.js" ]