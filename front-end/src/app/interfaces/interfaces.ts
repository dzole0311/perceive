export interface Message {
    timeSeries: (number | null)[][],
    systemOverview: {
        platform: any,
        uptime: number,
        cpuCount: number
    }
}
