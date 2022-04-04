import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CpuLoadComponent } from './cpu-load.component';
import {HighchartsChartComponent, HighchartsChartModule} from "highcharts-angular";
import {ChartModule} from "angular-highcharts";

describe('CpuLoadComponent', () => {
  let component: CpuLoadComponent;
  let fixture: ComponentFixture<CpuLoadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HighchartsChartComponent, CpuLoadComponent ],
      imports: [ HighchartsChartModule, ChartModule ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CpuLoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
