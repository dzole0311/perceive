import {Injectable} from '@angular/core';
import {WebsocketApiService} from './websocket-api.service';
import {CPU_HIGH_LOAD_DURATION, CPU_HIGH_LOAD_THRESHOLD, TIME_WINDOW} from '../constants/constants';
import {BehaviorSubject} from 'rxjs';

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

  constructor(private websocketApiService: WebsocketApiService) {
    // Subscribe to the websocket payload which contains the CPU load data
    // and pass it on to the monitorCurrentCpuLoad method to check whether
    // the CPU is under high load or if it has recovered from a high load.
    this.websocketApiService.cpuPayload.subscribe(msg => {
      this.monitorCurrentCpuLoad(msg.timeSeries);
    });
  }

  /**
   * Monitors the current CPU load and triggers the appropriate
   * alerting logic
   *
   * @param timeseries
   */
  monitorCurrentCpuLoad(timeseries: number[][]): void {
    if (!timeseries) return;

    let currentCpuLoad = timeseries[timeseries.length - 1][1];
    let timestamp = timeseries[timeseries.length - 1][0];

    // Check if the most recent data point we have for the CPU load
    // has reached or surpassed the configured CPU load threshold
    if (!this.isCpuUnderHighLoad()) {

      if (this.cpuLoadThresholdReached(currentCpuLoad)) {

        // If there is no active high CPU load ongoing, record
        // the start timestamp of the occurrence of this data point
        if (!this.cpuHighLoadStartTime) {
          this.cpuHighLoadStartTime = timestamp;

          // Check if the high load started earlier, especially if the page was
          // refreshed by the user. Like this, we also consider any preceding points
          // that surpassed the load threshold and use them in the calculation when
          // checking if the duration threshold has been surpassed, before publishing
          // an alert.
          for (let i = timeseries.length - 1; i >= TIME_WINDOW - this.cpuHighLoadDurationThreshold.value; i--) {
            if (this.cpuLoadThresholdReached(timeseries[i][1])) {
              // Re-assign the start time of the high load occurrence to the
              // earliest known data point that has surpassed the threshold
              this.cpuHighLoadStartTime = timeseries[i][0];
            } else {
              break;
            }
          }
        }

        // If the CPU high load duration threshold has been also
        // reached or surpassed, switch the CPU load state to HIGH_LOAD
        if (this.cpuLoadDurationThresholdReached(timestamp, this.cpuHighLoadStartTime)) {
          this.cpuLoadState.next(CpuLoadStates.HIGH_LOAD);
        }
      }
    } else if (this.isCpuUnderHighLoad()) {

      if (!this.cpuLoadThresholdReached(currentCpuLoad)) {

        // Keep the start time of the recovery, because we need to count
        if (!this.cpuRecoveryStartTime) {
          this.cpuRecoveryStartTime = timestamp;
        }

        // Once the CPU load recovery threshold has been reached,
        // we change from 'HIGH_LOAD' to a 'RECOVERED' state
        if (this.cpuLoadRecoveryThresholdReached(timestamp, this.cpuRecoveryStartTime)) {
          this.cpuLoadState.next(CpuLoadStates.RECOVERED);
          this.cpuHighLoadStartTime = 0;
          this.cpuRecoveryStartTime = 0;
        }
      }
    }

    // Update the historical high CPU overview each time the timeseries data
    // is updated. The reason for that is that we want to keep track of all
    // high CPU load occurrences in the last 10 minutes window only.
    this.generateHistoricalHighCpuOverview(timeseries);
  }

  isCpuUnderHighLoad() {
    return this.cpuLoadState.value === CpuLoadStates.HIGH_LOAD;
  }

  cpuLoadThresholdReached(cpuLoad: number) {
    return cpuLoad >= this.cpuHighLoadThreshold.value;
  }

  cpuLoadDurationThresholdReached(timestamp: number, highLoadStartTime: number) {
    return (timestamp - highLoadStartTime) / 1000 > this.cpuHighLoadDurationThreshold.value;
  }

  cpuLoadRecoveryThresholdReached(timestamp: number, recoveryStartTime: number) {
    return (timestamp - recoveryStartTime) / 1000 > this.cpuHighLoadDurationThreshold.value;
  }

  /**
   * Generates intervals [from, to] from all of the high cpu load occurrences
   * in the past 10 minutes. The result is used by the cpu-load component to
   * give the user an overview of the past high CPU load occurrences.
   *
   * @param timeseries
   */
  generateHistoricalHighCpuOverview(timeseries: number[][]) {
    this.historicalCpuLoadOverview.next([]);
    let interval: number[] = [];
    let startTime = 0;
    let endTime = 0;
    let isPreviousLoadBigger = false;

    for (let i = 0; i < timeseries.length; i++) {
      if (this.cpuLoadThresholdReached(timeseries[i][1]) && !isPreviousLoadBigger) {
        startTime = timeseries[i][0];
        isPreviousLoadBigger = true;
      }

      if (!this.cpuLoadThresholdReached(timeseries[i][1]) && isPreviousLoadBigger) {

        if (!endTime) endTime = timeseries[i][0];

        if (this.cpuLoadDurationThresholdReached(timeseries[i][0], startTime) && this.cpuLoadRecoveryThresholdReached(timeseries[i][0], endTime)) {
          interval.push(startTime, timeseries[i][0]);
          let historicalCpuLoadOverviewCurrentValue = this.historicalCpuLoadOverview.value;
          let historicalCpuLoadOverviewUpdatedValue = [...historicalCpuLoadOverviewCurrentValue, interval];
          this.historicalCpuLoadOverview.next(historicalCpuLoadOverviewUpdatedValue);
          // Resets
          startTime = 0;
          endTime = 0;
          interval = [];
          isPreviousLoadBigger = false;
        }
      }
    }
  }
}
