import {Injectable} from '@angular/core';
import {webSocket} from "rxjs/webSocket";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class WebsocketApiService {
  public cpuPayload = new BehaviorSubject<any>(this.initDefaults());
  private subject = webSocket("ws://localhost:3000");

  constructor() {
    this.subject.subscribe(
      msg => this.cpuPayload.next(msg),
      err => console.log('error'),
      () => console.log('complete')
    );
  }

  initDefaults() {
    return {
      timeSeries: [[0, 0]],
      systemOverview: {
        platform: '',
        uptime: 0,
        cpuCount: 0
      }
    };
  }
}
