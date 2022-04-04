import * as os from 'os';
import { INTERVAL, TIME_WINDOW } from './constants';

export const getPlatform = () => {
    return os.platform();
}

export const getTotalUptime = () => {
    return os.uptime();
}

export const getCpusCounts = () => {
    return os.cpus().length;
}

export const getTotalMemory = () => {
    return os.totalmem();
}

export const getFreeMemory = () => {
    return os.freemem();
}

export const normalizeAverageCpuLoad = () => {
    return (os.loadavg()[0] / getCpusCounts()) * 100;
}

/**
 * Generates an empty timeseries data when the app is
 * started for the first time. The data spans back
 * 10 minutes in time, with the y points being
 * set to a negative number. Negative numbers are ignored
 * because the min is set to 0 for our yAxis in Higcharts.
 */
export const initTimeSeriesData = () => {
    const timeSeries = [];
    for (let i = TIME_WINDOW; i > 0; i--) {
        timeSeries.push([
            new Date().getTime() - i * 1000,
            -1
        ]);
    }
    return timeSeries;
}

export const initSystemOverviewData = () => {
    return {
        platform: getPlatform(),
        uptime: getTotalUptime(),
        cpuCount: getCpusCounts(),
        totalMemory: getTotalMemory(),
        freeMemory: getFreeMemory()
    }
}

/**
 * Updates the timeseries data by pushing a new point at the end
 * of the array and removing the first point from the array. This
 * results in a "moving time window" effect.
 */
export const updateTimeSeriesData = (timeSeries: number[][]) => {
    timeSeries.push([new Date().getTime(), normalizeAverageCpuLoad()]);
    timeSeries.shift();
    return timeSeries;
}