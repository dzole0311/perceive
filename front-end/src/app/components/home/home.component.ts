import {Component, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {WebsocketApiService} from "../../services/websocket-api.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  public metricsPayload: BehaviorSubject<[]> = new BehaviorSubject<[]>([]);

  constructor(private websocketApi: WebsocketApiService) { }

  ngOnInit(): void {
    this.websocketApi.metricsPayload.subscribe((msg) => {
      this.metricsPayload.next(msg);
    });
  }

  ngOnDestroy(): void {
    this.websocketApi.metricsPayload.unsubscribe();
  }

}
