import express from "express"
import path from "path"
import http from "http"
import socketIO from "socket.io"
import * as firebase from "firebase-admin"
import * as dotenv from "dotenv"
//import * as serviceAccount from "./serviceAccountKey.json"
const port: number = 8080

class App {
    private server: http.Server
    private port: number
    private io: socketIO.Server


    registerEvents() {
        this.io.on('connection', (socket: socketIO.Socket) => {
            console.log('a socket id connected : ' + socket.id)
            
            socket.on('disconnect', function () {
                console.log('socket id disconnected : ' + socket.id);
            });   

            socket.on("message", (m: Object) => {
                console.log("[server](message): %s", JSON.stringify(m));
                this.io.emit("message", m);
            });
            socket.on('mouseup', (m: Object) => {
                console.log("[server](mouseup)");
                socket.broadcast.emit('mouseup', m);
                //xfirestore().collection('messages').doc('payload').collection('points').add({status:'NULL'});
            });  
            socket.on("clear", (m: Object) => {
                console.log("[server](clear)");
                socket.broadcast.emit('clear', undefined);
                //firebase.firestore().collection('messages').doc('payload').delete();
              });
            socket.on("chat", (m: Object) => {
                console.log("[server](chat): %s", JSON.stringify(m));
                socket.broadcast.emit('broadcast', m);
                //firebase.firestore().collection('messages').doc('payload').collection('points').add(m)
            //this.io.emit("chat", m);
            });
            socket.on("userid", (m: Object) => {
                console.log("[server](userid): %s", JSON.stringify(m));
                //collection(JSON.stringify(m)).add({socketid:socket.id});
                firebase.firestore().collection('users').doc(JSON.stringify(m)).set({socketid:socket.id});
                socket.broadcast.emit('usersaved', m);
            //this.io.emit("chat", m);
            });

        
        })
    }

    initializeFirbase() {

        const params = {
            type: process.env.type,
            projectId: process.env.project_id,
            privateKeyId: process.env.private_key_id,
            privateKey: process.env.private_key.replace(/\\n/g, '\n'),
            clientEmail: process.env.client_email,
            clientId: process.env.client_id,
            authUri: process.env.auth_uri,
            tokenUri: process.env.token_uri,
            authProviderX509CertUrl: process.env.auth_provider_x509_cert_url,
            clientC509CertUrl: process.env.client_x509_cert_url
          }
          /*
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
          }*/


        firebase.initializeApp({
            credential: firebase.credential.cert(params),
            databaseURL: "https://midyear-nebula-113706.firebaseio.com"
          });

    }

    constructor(port) {
        dotenv.config()
        this.port = port
        const app = express();
        this.server = new http.Server();
        this.io = socketIO(this.server,{serveClient: false, origins: '*:*'});
        this.registerEvents();
        this.initializeFirbase();    
    }

   

    public Start() {
        this.server.listen(this.port, () => {
            console.log( `Server listening on port ${this.port}.` )
        })
    }
}

new App(process.env.PORT || port).Start()