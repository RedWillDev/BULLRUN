FROM alpine:3.22.4
WORKDIR /app
COPY . .
EXPOSE 4321
RUN apk update && apk add nodejs npm bash
RUN npm ci
RUN npm update npm -g
RUN npm run build && cd dist/
ENTRYPOINT ["npm", "start"]