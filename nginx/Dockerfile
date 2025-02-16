# nginx/Dockerfile
FROM nginx:latest

RUN mkdir -p /etc/nginx/ssl

COPY nginx.conf /etc/nginx/nginx.conf

CMD ["nginx", "-g", "daemon off;"]