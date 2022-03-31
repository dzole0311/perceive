import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import {INTERVAL} from "./constants";
import {generatePayload} from "./utils";

// Used only for Windows
const { windowsLoadAvg } = require('loadavg-windows');

const app = express();
const server = http.createServer(app);
const ws = new WebSocket.Server({ server: server });


// Events

ws.on('connection', function connection(ws) {
    ws.send(JSON.stringify(generatePayload()));
});

//start our server
server.listen(3000);

const interval = setInterval(() => {
    ws.clients.forEach((ws: WebSocket) => {
        ws.send(generatePayload());
    });
}, INTERVAL);
