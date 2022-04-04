import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {INTERVAL} from "../../../../../back-end/src/app/constants";

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
  // BehaviorSubjects should provide an initial value
  public cpuPayload = new BehaviorSubject<CpuLoadPayload>(this.initDefaults());
  private cpuPayloadUrl = 'http://localhost:3000/cpu-metrics';

  constructor(private http: HttpClient) {
    // Start an interval that would regularly ping the back-end
    // and retrieve the up-to-date CPU payload metrics
    setInterval(() => {
      this.fetchCpuPayload();
    }, INTERVAL);
  }

  fetchCpuPayload() {
    return this.http.get<CpuLoadPayload>(this.cpuPayloadUrl)
      .subscribe(result => this.cpuPayload.next(result));
  }

  /**
   * Initiate default values for the cpuPayload.
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
