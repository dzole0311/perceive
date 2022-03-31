import {Component, Input, OnChanges, OnInit} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { animate, style, transition, trigger } from "@angular/animations";
import {CpuLoadMonitorService} from "../../../services/cpu-load-monitor.service";

enum ToastMessages {
  HIGH_LOAD = 'Your CPU has been under high load.',
  RECOVERED = 'Your CPU has recovered from a high load'
}

enum CpuLoadStates {
  DEFAULT,
  RECOVERED,
  HIGH_LOAD,
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
export class IncidentsComponent implements OnInit {
  @Input() timeSeries: any;
  public cpuLoadState: CpuLoadStates;
  public historicalCpuLoadOverview: number[][];

  constructor(private cpuLoadMonitorService: CpuLoadMonitorService,
              private toast: ToastrService) { }

  ngOnInit(): void {
    this.cpuLoadMonitorService.cpuLoadState.subscribe((state: CpuLoadStates) => {
      this.cpuLoadState = state;

      if (state === CpuLoadStates.HIGH_LOAD) {
        this.toast.info(ToastMessages.HIGH_LOAD);
      } else if (state === CpuLoadStates.RECOVERED) {
        this.toast.info(ToastMessages.RECOVERED);
      }
    });

    this.cpuLoadMonitorService.historicalCpuLoadOverview.subscribe((overview: number[][]) => {
      this.historicalCpuLoadOverview = overview;
    });
  }


}
