import {Component, OnDestroy, OnInit} from '@angular/core';
import {WebsocketApiService} from "../../services/websocket-api.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  public systemOverview: any;
  public timeSeries: any;

  constructor(private websocketApi: WebsocketApiService) { }

  ngOnInit(): void {
    this.websocketApi.metricsPayload.subscribe((msg) => {
      this.timeSeries = msg.timeSeries;
      this.systemOverview = msg.systemOverview;
    });
  }

  ngOnDestroy(): void {
    this.websocketApi.metricsPayload.unsubscribe();
  }

}
