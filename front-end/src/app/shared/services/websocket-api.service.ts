import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {webSocket} from "rxjs/webSocket";

interface CpuLoadPayload {
  timeSeries: number[][],
  systemOverview: {
    platform: string,
    uptime: number,
    cpuCount: number,
    freeMemory: number,
    totalMemory: number
  }
}

@Injectable({
  providedIn: 'root'
})
export class WebsocketApiService {
  public cpuPayload: BehaviorSubject<CpuLoadPayload> = new BehaviorSubject<CpuLoadPayload>(this.initDefaults());
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
        setTimeout(() => {
          this.connect();
        }, 1000);
      },
      () => {
        console.log('Complete');
      }
    );
  }

  /**
   * Initiates default values for the cpuPayload BehaviorSubject.
   */
  initDefaults() {
    return {
      timeSeries: [[0, 0]],
      systemOverview: {
        platform: 'Loading...',
        uptime: 0,
        cpuCount: 0,
        freeMemory: 0,
        totalMemory: 0
      }
    };
  }
}
