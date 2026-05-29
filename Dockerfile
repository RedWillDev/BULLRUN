FROM nginx:alpine

# Nettoyage du dossier web nginx
RUN rm -rf /usr/share/nginx/html/*

# Copie du build Astro
COPY dist/ /usr/share/nginx/html/

# Config SPA (important pour Astro routing)
RUN echo $'server {\n\
  listen 80;\n\
  server_name localhost;\n\
\n\
  root /usr/share/nginx/html;\n\
  index index.html;\n\
\n\
  location / {\n\
    try_files $uri $uri/ /index.html;\n\
  }\n\
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80