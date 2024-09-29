FROM node:22-alpine3.19

RUN npm i -g vite

WORKDIR /app

COPY eslint.config.js .
COPY vite.config.js .
COPY package.json .

RUN npm create --silent vite@latest

COPY index.html .

RUN npm i

EXPOSE 5173

CMD ["vite", "--host"]