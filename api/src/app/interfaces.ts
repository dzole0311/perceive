export interface CpuLoadPayload {
    timeSeries: number[][],
    systemOverview: {
        platform: string,
        uptime: number,
        cpuCount: number,
        totalMemory: number,
        freeMemory: number
    }
}