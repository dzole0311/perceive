import { Injectable } from '@angular/core';
import { webSocket } from "rxjs/webSocket";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class WebsocketApiService {
  public metricsPayload: BehaviorSubject<any> = new BehaviorSubject<any>({
    timeSeries: {
      timestamp: 0,
      value: 0
    },
    systemOverview: {
      platform: '',
      uptime: 0,
      cpuCount: 0,
      totalMem: 0,
      freeMem: 0
    }
  });
  private subject = webSocket("ws://localhost:3000");

  constructor() {
    this.subject.subscribe(
      msg => this.metricsPayload.next(msg),
      err => console.log('error'),
      () => console.log('complete')
    );
  }
}
