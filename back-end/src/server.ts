import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import * as os from 'os';

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server:server });

wss.on('connection', function connection(ws) {
    ws.send(createMessage());
});

const interval = setInterval(function ping() {
    wss.clients.forEach(function each(ws) {
        console.log(new Date().getTime())
        ws.send(createMessage());
    });
}, 10000);

//start our server
server.listen(3000);

interface Message {
    timeSeries: {
        timestamp: number,
        value: number
    },
    systemOverview: {
        platform: any,
        uptime: number,
        cpuCount: number,
        totalMem: number,
        freeMem: number
    }
}

function createMessage() {

    const msg: Message = {
        timeSeries: {
            timestamp: new Date().getTime(),
            value: (os.loadavg()[0] / os.cpus().length) * 100
        },
        systemOverview: {
            platform: os.platform(),
            uptime: os.uptime(),
            cpuCount: os.cpus().length,
            totalMem: os.totalmem(),
            freeMem: os.freemem()
        }
    };

    return JSON.stringify(msg);
}
