import * as os from 'os';
import { INTERVAL, TIME_WINDOW } from './constants';
import { CpuLoadPayload } from '../../../front-end/src/app/interfaces/interfaces';

let cpuLoadPayload: CpuLoadPayload;

/**
 * Generates the payload used by the front-end components
 */
export const generateCpuPayload = () => {
    cpuLoadPayload = {
        timeSeries: updateTimeSeriesData(),
        systemOverview: {
            platform: os.platform(),
            uptime: os.uptime(),
            cpuCount: os.cpus().length,
            totalMemory: os.totalmem(),
            freeMemory: os.freemem()
        }
    }

    console.log(cpuLoadPayload.timeSeries[0][0]);

    return JSON.stringify(cpuLoadPayload);
}

/**
 * Generates an empty timeseries data when the app is
 * started for the first time. The data spans back
 * 10 minutes in time, with the y points being
 * set to a negative number. Negative numbers are ignored
 * because the min is set to 0 for our yAxis in Higcharts.
 */
const generateDefaultTimeSeriesData = () => {
    const timeSeries = [];
    for (let i = TIME_WINDOW; i > 0; i--) {
        timeSeries.push([
            new Date().getTime() - i * INTERVAL,
            -1
        ]);
    }
    return timeSeries;
}

/**
 * The reference timeseries variable that keeps the up-to-date
 * timeseries data that ends up being sent to the front-end.
 */
export const timeSeries = generateDefaultTimeSeriesData();

/**
 * Updates the timeseries data by pushing a new point at the end
 * of the array and removing the first point from the array. This
 * results in a "moving time window" effect.
 */
export const updateTimeSeriesData = () => {
    timeSeries.push([new Date().getTime(), (os.loadavg()[0] / os.cpus().length) * 100]);
    timeSeries.shift();
    return timeSeries;
}