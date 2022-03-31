import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {CPU_HIGH_LOAD_DURATION, CPU_HIGH_LOAD_THRESHOLD} from "../../../../constants/constants";
import {CpuLoadMonitorService} from "../../../../services/cpu-load-monitor.service";

@Component({
  selector: 'app-thresholds',
  templateUrl: './thresholds.component.html',
  styleUrls: ['./thresholds.component.scss']
})
export class ThresholdsComponent implements OnInit {
  public cpuLoadThreshold: number = CPU_HIGH_LOAD_THRESHOLD;
  public cpuLoadDuration: number = CPU_HIGH_LOAD_DURATION;

  constructor(private cpuLoadMonitorService: CpuLoadMonitorService) { }

  ngOnInit(): void {
    this.cpuLoadMonitorService.cpuHighLoadThreshold.subscribe(threshold => {
      this.cpuLoadThreshold = threshold;
    })

    this.cpuLoadMonitorService.cpuHighLoadDurationThreshold.subscribe(threshold => {
      this.cpuLoadDuration = threshold;
    })
  }

  updateThreshold(event: any) {
    if (event.option === 'Threshold') {
      this.cpuLoadMonitorService.cpuHighLoadThreshold.next(event.value);
    } else if (event.option === 'Duration') {
      this.cpuLoadMonitorService.cpuHighLoadDurationThreshold.next(event.value);
    }
  }
}
