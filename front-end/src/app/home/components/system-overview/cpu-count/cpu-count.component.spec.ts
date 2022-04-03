import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpuCountComponent } from './cpu-count.component';
import {CardMediaComponent} from "../card-media/card-media.component";

describe('CpuCountComponent', () => {
  let component: CpuCountComponent;
  let fixture: ComponentFixture<CpuCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CpuCountComponent, CardMediaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CpuCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
