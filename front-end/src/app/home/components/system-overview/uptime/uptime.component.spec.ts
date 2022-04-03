import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UptimeComponent } from './uptime.component';
import {CardMediaComponent} from "../card-media/card-media.component";

describe('UptimeComponent', () => {
  let component: UptimeComponent;
  let fixture: ComponentFixture<UptimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UptimeComponent, CardMediaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UptimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
