import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import * as os from 'os';

const app = express();
const server = http.createServer(app);
const ws = new WebSocket.Server({ server: server });

// Interfaces

interface Message {
    timeSeries: (number | null)[][],
    systemOverview: {
        platform: any,
        uptime: number,
        cpuCount: number
    }
}

// Utility functions

function generateEmptyData() {
    let interval = 10000, // 10 seconds,
        numberOfPoints = 60,
        now = (new Date()).getTime(),
        min = now - interval * numberOfPoints,
        points = [];

    while (min < now) {
        points.push([min, null]); // set null points
        min += interval;
    }

    return points;
}


function generatePayload() {
    msg.timeSeries = updateTimeSeries(timeSeries);
    msg.systemOverview.platform = os.platform();
    msg.systemOverview.uptime = os.uptime();
    msg.systemOverview.cpuCount = os.cpus().length;

    return JSON.stringify(msg);
}

function updateTimeSeries(timeSeries: (number | null)[][]) {
    timeSeries.push([new Date().getTime(), (os.loadavg()[0] / os.cpus().length) * 100]);
    timeSeries.shift();
    return timeSeries;
}

// Events

ws.on('connection', function connection(ws) {
    ws.send(JSON.stringify(msg));
});

const interval = setInterval(function ping() {
    ws.clients.forEach(function each(ws) {
        ws.send(generatePayload());
    });
}, 10000);

//start our server
server.listen(3000);

// init an empty reference array and on connection, fill in the empty array with nulls
let timeSeries = generateEmptyData();

// build up an initial payload
let msg: Message = {
    timeSeries: updateTimeSeries(timeSeries),
    systemOverview: {
        platform: os.platform(),
        uptime: os.uptime(),
        cpuCount: os.cpus().length
    }
}

// then, set interval on every 10 seconds to:

// update the reference array by adding a x, y point at the end and shifting it's first value

// send the updated array to the front-end