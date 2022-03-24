import { Component, Input, OnChanges } from '@angular/core';
import { WebsocketApiService } from "../../../services/websocket-api.service";
import { ToastrService } from 'ngx-toastr';
import { animate, style, transition, trigger } from "@angular/animations";

enum ToastMessages {
  CpuViolationDetected = 'Your CPU has been under high load.',
  CpuViolationRecovery = 'Your CPU has recovered from a high load'
}

@Component({
  selector: 'app-incidents',
  templateUrl: './incidents.component.html',
  styleUrls: ['./incidents.component.scss'],
  animations: [
    trigger('cardAnimate', [
      transition(':enter', [style({transform: 'scale(0.7)'}), animate('200ms')])
    ])
  ]
})
export class IncidentsComponent implements OnChanges {
  @Input() timeSeriesData: any;
  public currentlyOngoingIncident = false;
  public mostRecentCpuViolationStartTime = 0;
  public historicalCpuIncidents: [number[]] = [[]];
  private incidentLoadThreshold = 20;
  private incidentDurationThreshold = 10;
  private isCpuLoadThresholdReached = false;
  private isCpuDurationThresholdReached = false;

  constructor(private websocketApiService: WebsocketApiService,
              private toast: ToastrService) { }

  ngOnChanges(): void {
    this.updateTimeSeriesData(this.timeSeriesData);
  }

  updateTimeSeriesData(timeseries: any): void {
    /**
     * If the CPU average load reaches or surpasses the threshold for the
     * first time, we want to save the timestamp of this message.
     */
    if (this.cpuLoadThresholdReached(timeseries.value) && !this.isCpuLoadThresholdReached) {
      this.mostRecentCpuViolationStartTime = timeseries.timestamp ? timeseries.timestamp : 0;
      this.isCpuLoadThresholdReached = true;
    }

    /**
     * Notify the user of a CPU load violation
     */
    if (this.isCpuLoadThresholdReached && !this.isCpuDurationThresholdReached && this.cpuLoadDurationThresholdReached(timeseries.timestamp)) {
      this.toast.error(ToastMessages.CpuViolationDetected);
      this.isCpuDurationThresholdReached = true;
      this.currentlyOngoingIncident = true;
    }

    /**
     * Notify the user of a recovery of the CPU
     */
    if (!this.cpuLoadThresholdReached(timeseries.value) && this.currentlyOngoingIncident) {
      this.currentlyOngoingIncident = false;
      this.isCpuDurationThresholdReached = false;
      this.isCpuLoadThresholdReached = false;
      this.toast.success(ToastMessages.CpuViolationRecovery);
      this.updateHistoricalOverview(timeseries.timestamp);
    }
  }

  cpuLoadThresholdReached(cpuLoad: number) {
    return cpuLoad >= this.incidentLoadThreshold;
  }

  cpuLoadDurationThresholdReached(timestamp: number) {
    if (!timestamp) return;
    return (timestamp - this.mostRecentCpuViolationStartTime) / 1000 > this.incidentDurationThreshold;
  }

  updateHistoricalOverview(timestamp: number) {
    this.historicalCpuIncidents.push([this.mostRecentCpuViolationStartTime, timestamp]);
  }
}
