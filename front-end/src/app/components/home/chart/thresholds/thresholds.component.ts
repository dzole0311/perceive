import {Component, OnInit} from '@angular/core';
import {CPU_HIGH_LOAD_THRESHOLD} from '../../../../constants/constants';
import {CpuLoadMonitorService} from '../../../../services/cpu-load-monitor.service';

@Component({
  selector: 'app-thresholds',
  templateUrl: './thresholds.component.html',
  styleUrls: ['./thresholds.component.scss']
})
export class ThresholdsComponent implements OnInit {
  public cpuLoadThreshold: number = CPU_HIGH_LOAD_THRESHOLD;

  constructor(private cpuLoadMonitorService: CpuLoadMonitorService) { }

  ngOnInit(): void {
    this.cpuLoadMonitorService.cpuHighLoadThreshold.subscribe(threshold => {
      this.cpuLoadThreshold = threshold;
    });
  }

  updateThreshold(event: any) {
    if (event.name === 'Threshold') {
      this.cpuLoadMonitorService.cpuHighLoadThreshold.next(event.value);
    }
  }
}
