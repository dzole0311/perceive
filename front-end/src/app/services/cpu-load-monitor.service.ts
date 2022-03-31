import {Injectable} from '@angular/core';
import {WebsocketApiService} from "./websocket-api.service";
import {CPU_HIGH_LOAD_DURATION, CPU_HIGH_LOAD_THRESHOLD} from "../constants/constants";
import {BehaviorSubject} from "rxjs";

enum CpuLoadStates {
  DEFAULT,
  RECOVERED,
  HIGH_LOAD,
}

@Injectable({
  providedIn: 'root'
})
export class CpuLoadMonitorService {
  public cpuHighLoadThreshold: BehaviorSubject<number> = new BehaviorSubject<number>(CPU_HIGH_LOAD_THRESHOLD);
  public cpuHighLoadDurationThreshold: BehaviorSubject<number> = new BehaviorSubject<number>(CPU_HIGH_LOAD_DURATION);
  public cpuLoadState: BehaviorSubject<CpuLoadStates> = new BehaviorSubject<CpuLoadStates>(CpuLoadStates.DEFAULT);
  public historicalCpuLoadOverview: BehaviorSubject<number[][]> = new BehaviorSubject<number[][]>([]);
  private cpuHighLoadStartTime = 0;
  private cpuRecoveryStartTime = 0;
  private intervals: number[][] = [];

  constructor(private websocketApiService: WebsocketApiService) {
    this.websocketApiService.cpuPayload.subscribe(msg => {
      this.monitorCurrentCpuLoad(msg.timeSeries);
    });
  }

  monitorCurrentCpuLoad(timeseries: any): void {
    let currentCpuLoad = timeseries[timeseries.length - 1][1];
    let timestamp = timeseries[timeseries.length - 1][0];

    /**
     * If the CPU load average reaches or surpasses the threshold for the
     * first time, we want to save the timestamp of this message. We also
     * check if the previous cpu load average is bigger than the current one
     * that we check, in order to catch the first occurrence of a high CPU load.
     */
    if (this.cpuLoadThresholdReached(currentCpuLoad) && !this.isCpuUnderHighLoad() && !this.cpuHighLoadStartTime) {
      this.cpuHighLoadStartTime = timestamp;
    }

    /**
     * If the CPU load duration threshold has been reached and the CPU
     * has been under high load for more than the duration threshold, then
     * we have to notify the user by triggering a toast notification
     */
    if (this.cpuLoadDurationThresholdReached(timestamp) && !this.isCpuUnderHighLoad() && this.cpuHighLoadStartTime) {
      this.cpuLoadState.next(CpuLoadStates.HIGH_LOAD);
    }

    /**
     * If the CPU load average is below the high load threshold and at
     * the same time there is an ongoing high load event registered,
     * it means that the CPU started to recover
     */
    if (!this.cpuLoadThresholdReached(currentCpuLoad) && this.isCpuUnderHighLoad()) {

      if (!this.cpuRecoveryStartTime) {
        this.cpuRecoveryStartTime = timestamp;
      }

      /**
       * Once the recovery duration threshold has been reached,
       * we notify the user and reset the values back to their defaults.
       */
      if (this.cpuLoadRecoveryThresholdReached(timestamp)) {
        // We set the CpuLoadState to 'RECOVERED', in order to notify the user,
        // followed by a 'DEFAULT' state. The latter has no effect other
        // than being reset to it's initial value.
        this.cpuLoadState.next(CpuLoadStates.RECOVERED);
        this.cpuLoadState.next(CpuLoadStates.DEFAULT);
        this.cpuHighLoadStartTime = 0;
        this.cpuRecoveryStartTime = 0;
      }
    }

    this.generateHistoricalHighCpuOverview(timeseries);
  }

  isCpuUnderHighLoad() {
    return this.cpuLoadState.value === CpuLoadStates.HIGH_LOAD;
  }

  cpuLoadThresholdReached(cpuLoad: number) {
    return cpuLoad >= this.cpuHighLoadThreshold.value;
  }

  cpuLoadDurationThresholdReached(timestamp: number) {
    return (timestamp - this.cpuHighLoadStartTime) / 1000 > this.cpuHighLoadDurationThreshold.value;
  }

  cpuLoadRecoveryThresholdReached(timestamp: number) {
    return (timestamp - this.cpuRecoveryStartTime) / 1000 > this.cpuHighLoadDurationThreshold.value;
  }

  generateHistoricalHighCpuOverview(timeseries: any) {
    this.historicalCpuLoadOverview.next([]);
    this.intervals = [];
    let interval: number[] = [];
    let startTime = 0;
    let isPreviousLoadBigger = false;

    for (let i = 0; i < timeseries.length; i++) {
      if (this.cpuLoadThresholdReached(timeseries[i][1]) && !isPreviousLoadBigger) {
        startTime = timeseries[i][0];
        isPreviousLoadBigger = true;
      }

      if (!this.cpuLoadThresholdReached(timeseries[i][1]) && isPreviousLoadBigger) {

        if ((timeseries[i][0] - startTime) / 1000 > this.cpuHighLoadDurationThreshold.value) {
          interval.push(startTime, timeseries[i][0]);
          let historicalCpuLoadOverviewCurrentValue = this.historicalCpuLoadOverview.value;
          let historicalCpuLoadOverviewUpdatedValue = [...historicalCpuLoadOverviewCurrentValue, interval];
          this.historicalCpuLoadOverview.next(historicalCpuLoadOverviewUpdatedValue);
          startTime = 0;
          interval = [];
          isPreviousLoadBigger = false;
        }
      }
    }
  }
}
