export interface CpuLoadPayload {
    timeSeries: number[][],
    systemOverview: {
        platform: any,
        uptime: number,
        cpuCount: number,
        totalMemory: number,
        freeMemory: number
    }
}
