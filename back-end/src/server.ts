import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import * as os from 'os';

// Utilities
// ToDo: Re-factor to separate module
const cpuCount = os.cpus().length;

const loadAverage = os.loadavg()[0] / cpuCount;

const platform = os.platform();

const uptime = os.uptime();

const osSystemType = os.release();

// App

const app = express();

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

interface ExtWebSocket extends WebSocket {
    isAlive: boolean;
}

function createMessage(content: string, isBroadcast = false, sender = 'NS', systemOverview: any): string {
    return JSON.stringify(new Message(content, isBroadcast, sender, systemOverview));
}

export class Message {
    constructor(
        public content: string,
        public isBroadcast = false,
        public sender: string,
        public systemOverview = {
            platform: platform,
            uptime: uptime,
            cpuCount: cpuCount,
            osSystemType: osSystemType
        }
    ) { }
}

wss.on('connection', (ws: WebSocket) => {

    const extWs = ws as ExtWebSocket;

    extWs.isAlive = true;

    ws.on('pong', () => {
        extWs.isAlive = true;
    });

    //connection is up, let's add a simple simple event
    ws.on('message', (msg: string) => {

        const message = JSON.parse(msg) as Message;

        setTimeout(() => {
            if (message.isBroadcast) {

                //send back the message to the other clients
                wss.clients
                    .forEach(client => {
                        if (client != ws) {
                            client.send(createMessage(message.content, true, message.sender, message.systemOverview));
                        }
                    });

            }

            ws.send(createMessage(`You sent -> ${message.content}`, message.isBroadcast, message.sender, message.systemOverview));

        }, 1000);

    });

    //send immediatly a feedback to the incoming connection
    ws.send(createMessage('Hi there, I am a WebSocket server'));

    setInterval(() => {
        ws.send(createMessage('Hi there, I am a WebSocket server'));
    }, 6000);

    ws.on('error', (err) => {
        console.warn(`Client disconnected - reason: ${err}`);
    })
});

setInterval(() => {
    wss.clients.forEach((ws: WebSocket) => {

        const extWs = ws as ExtWebSocket;

        if (!extWs.isAlive) return ws.terminate();

        extWs.isAlive = false;
        ws.ping(null, undefined);
    });
}, 10000);

//start our server
server.listen(process.env.PORT || 8999, () => {
    console.log(`Server started on port ${server.address().port} :)`);
});