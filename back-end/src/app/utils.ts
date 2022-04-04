import * as os from 'os';
import {POINTS_INTERVAL, TIME_WINDOW} from './constants';


/**
 * Utility functions for fetching various system information
 * that is later displayed in the UI
 */
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
 * Generates empty timeseries data when the app is started for
 * the first time. The data spans back 10 minutes in time, with
 * the y points being set to a negative number. Negative numbers
 * are ignored in Highcharts because the min property is set to 0
 * for our yAxis in Higcharts.
 */
export const generateEmptyTimeSeriesData = () => {
    const timeSeries = [];
    for (let i = TIME_WINDOW; i > 0; i--) {
        timeSeries.push([
            new Date().getTime() - i * POINTS_INTERVAL,
            -1
        ]);
    }
    return timeSeries;
}


/**
 * Returns an object of useful information about the user's system
 */
export const generateSystemOverviewData = () => {
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
 * results in a "moving time window" effect. Another approach would
 * be to use the 'shift' property in Higcharts, as seen in one of
 * their official demos in the docs:
 *
 * https://www.highcharts.com/demo/stock/dynamic-update
 */
export const updateTimeSeriesData = (timeSeries: number[][]) => {
    timeSeries.push([new Date().getTime(), normalizeAverageCpuLoad()]);
    timeSeries.shift();
    return timeSeries;
}