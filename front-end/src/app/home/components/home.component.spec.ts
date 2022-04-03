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

function mockToastService() {

}

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
      providers: [ {provide: ToastrService, useValue: mockToastService } ]
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
