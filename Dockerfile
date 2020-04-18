FROM node:8
WORKDIR /usr/src/app
COPY src ./src/
COPY dist ./dist/
COPY *.json ./
RUN ls -a
RUN npm install -g typescript@2.7
RUN npm install socket.io
RUN npm install @types/socket.io
RUN npm i ts-node
RUN npm install express
RUN npm install firebase-admin
RUN tsc -p src/server
RUN npm install
EXPOSE 8080
CMD node dist/server/server.js