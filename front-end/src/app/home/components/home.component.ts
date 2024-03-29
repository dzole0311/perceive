import {Component, OnDestroy, OnInit} from '@angular/core';
import {WebsocketApiService} from "../../shared/services/websocket-api.service";
import {CpuLoadPayload} from "../../shared/interfaces/interfaces";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  public systemOverview: any;
  public timeSeries: number[][];
  private websocketApiSubscription: Subscription;

  constructor(private websocketApi: WebsocketApiService) { }

  ngOnInit(): void {
    this.websocketApiSubscription = this.websocketApi.cpuPayload.subscribe((msg: CpuLoadPayload) => {
      this.timeSeries = msg.timeSeries;
      this.systemOverview = msg.systemOverview;
    });
  }

  ngOnDestroy(): void {
    this.websocketApiSubscription.unsubscribe();
  }
}
