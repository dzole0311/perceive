import {Injectable} from '@angular/core';
import {webSocket} from "rxjs/webSocket";
import {BehaviorSubject} from "rxjs";

interface CpuLoadPayload {
    timeSeries: number[][],
    systemOverview: {
        platform: any,
        uptime: number,
        cpuCount: number
    }
}

@Injectable({
  providedIn: 'root'
})
export class WebsocketApiService {
  public cpuPayload = new BehaviorSubject<CpuLoadPayload>(this.initDefaults());
  private subject = webSocket("ws://localhost:3000");

  constructor() {
    this.connect();
  }

  connect() {
    this.subject.subscribe(
      msg => this.cpuPayload.next(<CpuLoadPayload>msg),
      err => {
        console.log('An error occurred, reconnecting...', err);
        // Try to reconnect after a timeout, in case an error occurs
        // with the websocket connection
        setTimeout(() => {
          this.connect();
        }, 1000);
      },
      () => {
        console.log('complete')
      }
    );
  }

  /**
   * Initiate default values for the cpuPayload.
   */
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
