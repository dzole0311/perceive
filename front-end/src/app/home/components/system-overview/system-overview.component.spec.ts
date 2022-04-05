import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SystemOverviewComponent } from './system-overview.component';
import {CardMediaComponent} from "./card-media/card-media.component";
import {CpuCountComponent} from "./cpu-count/cpu-count.component";
import {FreeMemoryComponent} from "./free-memory/free-memory.component";
import {PlatformComponent} from "./platform/platform.component";
import {UptimeComponent} from "./uptime/uptime.component";
import * as normalLoadMockData from "../../../../assets/mocks/normal-load-mock.json";

describe('SystemOverviewComponent', () => {
  let component: SystemOverviewComponent;
  let fixture: ComponentFixture<SystemOverviewComponent>;
  const normalLoadMock = normalLoadMockData;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SystemOverviewComponent, CardMediaComponent, CpuCountComponent, FreeMemoryComponent, PlatformComponent, UptimeComponent ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemOverviewComponent);
    component = fixture.componentInstance;
    component.systemOverviewData = normalLoadMock.systemOverview;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update the system overview details', () => {
    component.systemOverviewData = normalLoadMock.systemOverview;
    expect(component.platform).toBe('linux');
    expect(component.upTime).toBe('7.9 h');
    expect(component.cpuCount).toBe(12);
    expect(component.totalMemory).toBe(33276669952);
    expect(component.freeMemory).toBe(20498292736);
    expect(component.memory).toBe('19.1 / 31');
  });

});
