FROM node:16.13.1

ENV CI=true

WORKDIR /app
COPY package.json ./
RUN npm install
COPY ./ ./

CMD [ "npm", "start" ]