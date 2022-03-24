import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";


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
  @Input() systemOverviewData: any;
  public os = '';
  public upTime = 0;
  public cpuCount = 0;
  public totalMem = 0;
  public freeMem = 0;

  constructor() { }

  ngOnInit(): void {
    this.updateSystemOverviewDetails();
  }

  ngOnChanges(): void {
    this.updateSystemOverviewDetails();
  }

  updateSystemOverviewDetails() {
    this.os = this.systemOverviewData.platform;
    this.upTime = this.systemOverviewData.uptime;
    this.cpuCount = this.systemOverviewData.cpuCount;
    this.totalMem = this.formatBytes(this.systemOverviewData.totalMem, 2);
    this.freeMem = this.formatBytes(this.systemOverviewData.freeMem, 2);
    console.log(this.systemOverviewData);
  }

  formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return 0;
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm));
  }
}
