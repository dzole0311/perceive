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
    // the CPU is under high load.
    this.websocketApiService.cpuPayload.subscribe(msg => {
      this.monitorCurrentCpuLoad(msg.timeSeries);
    });
  }

  /**
   * Monitors the current CPU load and triggers the different CPU load states
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

      if (!this.cpuLoadDroppedBelowThreshold(currentCpuLoad)) {

        // Save the start time when the CPU load started to normalize again
        if (!this.cpuRecoveryStartTime) {
          this.cpuRecoveryStartTime = timestamp;
        }

        // Once the CPU load recovery threshold has been reached, change
        // from 'HIGH_LOAD' to a 'RECOVERED' state
        if (this.cpuLoadRecoveryThresholdReached(timestamp, this.cpuRecoveryStartTime)) {
          this.cpuLoadState.next(CpuLoadStates.RECOVERED);
          this.cpuHighLoadStartTime = 0;
          this.cpuRecoveryStartTime = 0;
        }
      }
    }

    // Update the historical high CPU overview each time the timeseries data
    // is updated. This keeps track of all high CPU load occurrences in the
    // last 10 minutes only, which is the fixed time window used by the app.
    this.generateHistoricalHighCpuOverview(timeseries);
  }

  /**
   * Indicates whether the CPU is under ongoing high load
   */
  isCpuUnderHighLoad() {
    return this.cpuLoadState.value === CpuLoadStates.HIGH_LOAD;
  }

  /**
   * Indicates whether the CPU load threshold has been reached
   *
   * @param cpuLoad
   */
  cpuLoadThresholdReached(cpuLoad: number) {
    return cpuLoad >= this.cpuHighLoadThreshold.value;
  }

  /**
   * Indicates whether the CPU load dropped below the high load threshold
   *
   * @param cpuLoad
   */
  cpuLoadDroppedBelowThreshold(cpuLoad: number) {
    return cpuLoad < this.cpuHighLoadThreshold.value;
  }

  /**
   * Indicates whether the CPU load duration has been reached
   *
   * @param timestamp
   * @param highLoadStartTime
   */
  cpuLoadDurationThresholdReached(timestamp: number, highLoadStartTime: number) {
    return (timestamp - highLoadStartTime) / 1000 >= this.cpuHighLoadDurationThreshold.value;
  }

  /**
   * Indicates whether the CPU load recovery threshold has been reached
   *
   * @param timestamp
   * @param recoveryStartTime
   */
  cpuLoadRecoveryThresholdReached(timestamp: number, recoveryStartTime: number) {
    return (timestamp - recoveryStartTime) / 1000 >= this.cpuHighLoadDurationThreshold.value;
  }

  /**
   * Generates intervals [start, end] from all of the high cpu load occurrences
   * in the past 10 minutes. The result is used by the incidents component to
   * provide an overview of the past high CPU load cases.
   *
   * @param timeseries
   */
  generateHistoricalHighCpuOverview(timeseries: number[][]) {
    // Reset the existing historical CPU overview data
    this.historicalCpuLoadOverview.next([]);
    let interval: number[] = [];
    let startTime = 0;
    let endTime = 0;
    let isPreviousLoadBigger = false;

    // Loop through the timeseries
    for (let i = 0; i < timeseries.length; i++) {

      // Keep a reference of the start time if a data point has surpassed the
      // CPU_HIGH_LOAD_THRESHOLD and check if the previous point did not surpass
      // the threshold as well.
      if (this.cpuLoadThresholdReached(timeseries[i][1]) && !isPreviousLoadBigger) {
        // Save the start time as it might be that we have found a potential high CPU
        // load interval. Furthermore, set the isPreviousLoadBigger flag to true.
        startTime = timeseries[i][0];
        isPreviousLoadBigger = true;
      } else if (this.cpuLoadDroppedBelowThreshold(timeseries[i][1]) && isPreviousLoadBigger) {

        // If the current data point dropped below the CPU_HIGH_LOAD_THRESHOLD, but we
        // have a record of the preceding CPU load value going over the threshold, we keep
        // the end time of the preceding data point. This marks the end time of a potential
        // high CPU load time range.
        if (!endTime) endTime = timeseries[i - 1][0];

        // If both the CPU load duration threshold and the CPU load recovery thresholds have
        // been reached, push the interval into the historical CPU load overview list
        if (this.cpuLoadDurationThresholdReached(timeseries[i][0], startTime) &&
          this.cpuLoadRecoveryThresholdReached(timeseries[i][0], endTime)) {
          interval.push(startTime, endTime);
          let historicalCpuLoadOverviewCurrentValue = this.historicalCpuLoadOverview.value;
          let historicalCpuLoadOverviewUpdatedValue = [...historicalCpuLoadOverviewCurrentValue, interval];
          this.historicalCpuLoadOverview.next(historicalCpuLoadOverviewUpdatedValue);
          // And finally, resets.
          startTime = 0;
          endTime = 0;
          interval = [];
          isPreviousLoadBigger = false;
        }
      }
    }
  }
}
