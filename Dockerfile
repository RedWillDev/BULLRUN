FROM node:22.12-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

EXPOSE 4321

USER node

CMD ["npm", "start"]