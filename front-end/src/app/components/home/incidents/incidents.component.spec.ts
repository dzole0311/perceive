import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentsComponent } from './incidents.component';
import {Toast} from "ngx-toastr";
import {CpuLoadMonitorService} from "../../../services/cpu-load-monitor.service";

describe('IncidentsComponent', () => {
  let component: IncidentsComponent;
  let fixture: ComponentFixture<IncidentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [ CpuLoadMonitorService ],
      declarations: [ IncidentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
