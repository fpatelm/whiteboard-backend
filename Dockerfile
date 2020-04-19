FROM node:10-alpine
WORKDIR /usr/src/app
COPY src ./src/
COPY dist ./dist/
COPY *.json ./
RUN ls -a
RUN npm install -g typescript@3.1
RUN npm install -g @types/typescript
RUN npm install socket.io
RUN npm install @types/socket.io
RUN npm i ts-node
RUN npm install express
RUN npm install firebase-admin
RUN npm i dotenv
RUN tsc -p src/server
RUN npm install
EXPOSE 8080
CMD node dist/server/server.js