import {Component, Input, OnInit} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { animate, style, transition, trigger } from '@angular/animations';
import {CpuLoadMonitorService} from '../../../services/cpu-load-monitor.service';
import {TIME_WINDOW} from '../../../constants/constants';
import {formatTime} from "../../../shared/utils";

enum ToastMessages {
  HIGH_LOAD = 'Your CPU is experiencing a high load',
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
  public timeWindow: string = formatTime(TIME_WINDOW);

  constructor(private cpuLoadMonitorService: CpuLoadMonitorService,
              private toast: ToastrService) { }

  ngOnInit(): void {
    this.cpuLoadMonitorService.cpuLoadState.subscribe((state: CpuLoadStates) => {
      this.cpuLoadState = state;

      if (state === CpuLoadStates.HIGH_LOAD) {
        // We trigger a toast message of type 'info', since the
        // high CPU load alert is simply an information for the user
        this.toast.info(ToastMessages.HIGH_LOAD);
      } else if (state === CpuLoadStates.RECOVERED) {
        this.toast.success(ToastMessages.RECOVERED);
      }
    });

    this.cpuLoadMonitorService.historicalCpuLoadOverview.subscribe((overview: number[][]) => {
      console.log(overview)
      this.historicalCpuLoadOverview = overview;
    });
  }

  isCpuUnderHighLoad() {
    return this.cpuLoadState === CpuLoadStates.HIGH_LOAD;
  }
}
