FROM node:22-alpine3.19

WORKDIR /app

COPY package.json .
COPY vite.config.js .
COPY index.html .

RUN npm i

EXPOSE 5173

CMD ["node", "node_modules/vite/bin/vite.js", "--host"]