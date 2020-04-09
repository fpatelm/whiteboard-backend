import express from "express"
import path from "path"
import http from "http"
import socketIO from "socket.io"
import * as firebase from "firebase-admin"
import * as serviceAccount from "./serviceAccountKey.json"
const port: number = 8080

class App {
    private server: http.Server
    private port: number
    private io: socketIO.Server


    registerEvents() {
        this.io.on('connection', (socket: socketIO.Socket) => {
            console.log('a user connected : ' + socket.id)
            
            socket.on('disconnect', function () {
                console.log('socket disconnected : ' + socket.id);
            });   

            socket.on("message", (m: Object) => {
                console.log("[server](message): %s", JSON.stringify(m));
                this.io.emit("message", m);
            });
            socket.on('mouseup', (m: Object) => {
                console.log("[server](mouseup)");
                socket.broadcast.emit('mouseup', undefined);
            });  
            socket.on("clear", (m: Object) => {
                console.log("[server](clear)");
                socket.broadcast.emit('clear', undefined);
              });
            socket.on("chat", (m: Object) => {
                console.log("[server](chat): %s", JSON.stringify(m));
                socket.broadcast.emit('broadcast', m);
            //this.io.emit("chat", m);
            });
        })
    }

    initializeFirbase() {
        const params = {
            type: serviceAccount.type,
            projectId: serviceAccount.project_id,
            privateKeyId: serviceAccount.private_key_id,
            privateKey: serviceAccount.private_key,
            clientEmail: serviceAccount.client_email,
            clientId: serviceAccount.client_id,
            authUri: serviceAccount.auth_uri,
            tokenUri: serviceAccount.token_uri,
            authProviderX509CertUrl: serviceAccount.auth_provider_x509_cert_url,
            clientC509CertUrl: serviceAccount.client_x509_cert_url
          }


        firebase.initializeApp({
            credential: firebase.credential.cert(params),
            databaseURL: "https://midyear-nebula-113706.firebaseio.com"
          });

          firebase.firestore().collection('messages').doc('payload').set({key:"value"}).then(() => {})

    }

    constructor(port: number) {
        this.port = port
        const app = express();
        this.server = new http.Server();
        this.io = socketIO(this.server,{serveClient:false});
        this.registerEvents();
        this.initializeFirbase();    
    }

   

    public Start() {
        this.server.listen(this.port, () => {
            console.log( `Server listening on port ${this.port}.` )
        })
    }
}

new App(port).Start()