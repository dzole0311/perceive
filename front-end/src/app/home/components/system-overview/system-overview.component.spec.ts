import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemOverviewComponent } from './system-overview.component';
import {CardMediaComponent} from "./card-media/card-media.component";
import {CpuCountComponent} from "./cpu-count/cpu-count.component";
import {FreeMemoryComponent} from "./free-memory/free-memory.component";
import {PlatformComponent} from "./platform/platform.component";
import {UptimeComponent} from "./uptime/uptime.component";

describe('SystemOverviewComponent', () => {
  let component: SystemOverviewComponent;
  let fixture: ComponentFixture<SystemOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SystemOverviewComponent, CardMediaComponent, CpuCountComponent, FreeMemoryComponent, PlatformComponent, UptimeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
