import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import {INTERVAL} from "./constants";
import {generatePayload} from "./utils";

// loadavg-windows serves as a platform-independent implementation of os.loadavg()
// that can be used on Windows (or any other system that for some reasons does
// not supports loadavg).
const { windowsLoadAvg } = require('loadavg-windows');

const app = express();
const server = http.createServer(app);
const ws = new WebSocket.Server({ server: server });

// Publish the payload once a connection has been opened
ws.on('connection', (ws: WebSocket) => {
    ws.send(JSON.stringify(generatePayload()));
});

// Trigger an interval that publishes a new system overview
// payload to the front-end via a websocket connection
const interval = setInterval(() => {
    ws.clients.forEach((ws: WebSocket) => {
        ws.send(generatePayload());
    });
}, INTERVAL);

// Start the server
server.listen(3000);