import { Injectable } from '@angular/core';
import { webSocket } from "rxjs/webSocket";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class WebsocketApiService {
  public metricsPayload: BehaviorSubject<[]> = new BehaviorSubject<[]>([]);
  private subject = webSocket("ws://localhost:8999");

  constructor() {
    this.subject.subscribe(
      (msg) => {
        console.log(msg);
      }, // Called whenever there is a message from the server.
      err => console.log(err), // Called if at any point WebSocket API signals some kind of error.
      () => console.log('complete') // Called when connection is closed (for whatever reason).
    );
  }
}
