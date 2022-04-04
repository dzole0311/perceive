import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import {ChartComponent} from "./chart/chart.component";
import {CpuLoadComponent} from "./cpu-load/cpu-load.component";
import {IncidentsComponent} from "./incidents/incidents.component";
import {SystemOverviewComponent} from "./system-overview/system-overview.component";
import {ToastrService} from "ngx-toastr";
import {CardMediaComponent} from "./system-overview/card-media/card-media.component";
import {CpuCountComponent} from "./system-overview/cpu-count/cpu-count.component";
import {FreeMemoryComponent} from "./system-overview/free-memory/free-memory.component";
import {PlatformComponent} from "./system-overview/platform/platform.component";
import {UptimeComponent} from "./system-overview/uptime/uptime.component";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {HighchartsChartModule} from "highcharts-angular";
import {WebsocketApiService} from "../../shared/services/websocket-api.service";
import {BehaviorSubject, Subject} from "rxjs";
import {CpuLoadPayload} from "../../shared/interfaces/interfaces";

// Mock of the ToastService, no need to be provided to the component
function mockToastService() {}

const subjectMock = new Subject();
const cpuPayloadMock = new BehaviorSubject<CpuLoadPayload>({
  timeSeries: [[0, 0]],
  systemOverview: {
    platform: 'Loading...',
    uptime: 0,
    cpuCount: 0,
    freeMemory: 0,
    totalMemory: 0
  }
});

// Mock the Websocket connection
const websocketApiMock = {
  cpuPayload: cpuPayloadMock.asObservable(),
  subject: subjectMock.asObservable()
}

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, HighchartsChartModule],
      declarations: [
        HomeComponent,
        ChartComponent,
        CpuLoadComponent,
        IncidentsComponent,
        SystemOverviewComponent,
        CardMediaComponent,
        CpuCountComponent,
        FreeMemoryComponent,
        PlatformComponent,
        UptimeComponent
      ],
      providers: [
        { provide: ToastrService, useValue: mockToastService },
        { provide: WebsocketApiService, useValue: websocketApiMock }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
