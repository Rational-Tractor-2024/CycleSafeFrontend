FROM node:22-alpine3.19

WORKDIR /www/

VOLUME ./

CMD npm create --silent vite@latest