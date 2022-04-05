import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";
import {CpuLoadPayload} from "../../../shared/interfaces/interfaces";
import {formatBytes, formatPlatform, formatTime} from '../../../shared/utils';


@Component({
  selector: 'app-system-overview',
  templateUrl: './system-overview.component.html',
  styleUrls: ['./system-overview.component.scss'],
  animations: [
    trigger('cardAnimate', [
      transition(':enter', [style({transform: 'scale(0.7)'}), animate('200ms')])
    ])
  ]
})
export class SystemOverviewComponent implements OnInit, OnChanges {
  @Input() systemOverviewData: CpuLoadPayload['systemOverview'];
  public platform: string = '';
  public upTime: string = '';
  public cpuCount: number = 0;
  public totalMemory: number = 0;
  public freeMemory: number = 0;
  public memory: string = '';

  constructor() { }

  ngOnInit(): void {
    this.updateSystemOverviewDetails();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Update the system overview details each time the systemOverviewData @Input gets updated.
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'systemOverviewData': {
            this.updateSystemOverviewDetails();
          }
        }
      }
    }
  }

  updateSystemOverviewDetails() {
    if (!this.systemOverviewData) return;
    this.platform = formatPlatform(this.systemOverviewData.platform);
    this.upTime = formatTime(this.systemOverviewData.uptime);
    this.cpuCount = this.systemOverviewData.cpuCount;
    this.freeMemory = this.systemOverviewData.freeMemory;
    this.totalMemory = this.systemOverviewData.totalMemory;
    this.memory = `${formatBytes(this.freeMemory, 1)} / ${formatBytes(this.totalMemory, 1)}`;
  }
}
