import express, { Application } from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';

import { INTERVAL } from './app/constants';
import { generateCpuPayload } from './app/utils';

// loadavg-windows serves as a platform-independent implementation of os.loadavg()
// that can be used on Windows (or any other system that for some reasons does
// not supports loadavg).
const { windowsLoadAvg } = require('loadavg-windows');

const app: Application = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server: server });

const port: number = 3000;

// Publish the whole payload once a connection from the front-end
// has been opened
wss.on('connection', (ws: WebSocket) => {
    ws.send(JSON.stringify(generateCpuPayload()));
});

// Start an interval that publishes an updated CPU payload
// to the front-end via a websocket connection
setInterval(() => {
    let updatedCpuPayload = generateCpuPayload();
    wss.clients.forEach((ws) => {
        ws.send(updatedCpuPayload);
    });
}, INTERVAL);

server.listen(port, () => {
    console.log(`App is listening on port ${port}`)
})
