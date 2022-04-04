import express, { Application } from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';

import {PUBLISH_INTERVAL} from './app/constants';
import {
    generateEmptyTimeSeriesData,
    generateSystemOverviewData,
    updateTimeSeriesData
} from './app/utils';
import {CpuLoadPayload} from "../../front-end/src/app/shared/interfaces/interfaces";

// loadavg-windows serves as a platform-independent implementation of os.loadavg()
// that can be used on Windows (or any other system that for some reasons does
// not supports loadavg).
const { windowsLoadAvg } = require('loadavg-windows');

const app: Application = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server: server });

const port: number = 3000;

// The CPU load payload that is sent to the front-end.
// The payload consists of the time series data and details
// about the user's system
let cpuLoadPayload: CpuLoadPayload = {
    timeSeries: generateEmptyTimeSeriesData(),
    systemOverview: generateSystemOverviewData()
};

// Publish the whole payload once a connection has been opened
wss.on('connection', (ws: WebSocket) => {
    ws.send(JSON.stringify(cpuLoadPayload));
});

// Update the CPU payload every second, but serve it to the client based on the
// PUBLISH_INTERVAL (the default is set to 10 seconds). Fixes an edge case where
// the timestamps start to diverge for more than the time window (ten minutes)
// after a while after a while.
let counter = 0;

setInterval(() => {
    // Update the CPU payload
    cpuLoadPayload.timeSeries = updateTimeSeriesData(cpuLoadPayload.timeSeries);
    cpuLoadPayload.systemOverview = generateSystemOverviewData();

    if (counter !== PUBLISH_INTERVAL) {
        counter++;
        return;
    }

    wss.clients.forEach((ws) => {
        ws.send(JSON.stringify(cpuLoadPayload));
    });

    counter = 0;

}, 1000);


server.listen(port, () => {
    console.log(`App is listening on port ${port}`)
})