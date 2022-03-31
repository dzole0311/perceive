import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";
import {CpuLoadPayload} from "../../../interfaces/interfaces";


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
  public os: string = '';
  public upTime: string = '';
  public cpuCount: number = 0;
  public totalMemory: number = 0;
  public freeMemory: number = 0;
  public memory: string = '';

  constructor() { }

  ngOnInit(): void {
    this.updateSystemOverviewDetails();
  }

  ngOnChanges(): void {
    this.updateSystemOverviewDetails();
  }

  updateSystemOverviewDetails() {
    if (!this.systemOverviewData) return;
    this.os = this.systemOverviewData.platform;
    this.upTime = this.systemOverviewData.uptime.toString();
    this.cpuCount = this.systemOverviewData.cpuCount;
    this.freeMemory = this.systemOverviewData.freeMemory;
    this.totalMemory = this.systemOverviewData.totalMemory;
    this.memory = `${this.formatBytes(this.freeMemory, 1)} / ${this.formatBytes(this.totalMemory, 1)}`;
  }

  formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return 0;
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm));
  }
}
