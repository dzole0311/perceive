import {ComponentFixture, TestBed} from '@angular/core/testing';
import { ChartComponent } from './chart.component';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import {HighchartsChartModule} from "highcharts-angular";
import {ChartModule} from "angular-highcharts";
import {By} from "@angular/platform-browser";
import {SimpleChange} from "@angular/core";

describe('ChartComponent', () => {
  let component: ChartComponent;
  let fixture: ComponentFixture<ChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, HighchartsChartModule, ChartModule ],
      declarations: [ ChartComponent ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the correct title)', () => {
    const title = fixture.debugElement.query(By.css('.highcharts-title')).nativeElement;
    expect(title.textContent).toBe('CPU Load History');
  });

  it('should set useUTC to false for axis scaling', () => {
    expect(component.chartOptions.time?.useUTC).toBeFalse();
  });

  it('should update the chart when the timeSeries have been updated', () => {
    const updateChartLineSpy = spyOn(component, 'updateChartLine');
    component.ngOnChanges({
      // Mock only the timeSeries prop, as that's the one that is
      // checked. No need to fill in the other values
      timeSeries: new SimpleChange('', '', false),
    });
    expect(updateChartLineSpy).toHaveBeenCalled();
  });

  it('should display the legend for the chart', () => {
    expect(component.chartOptions.legend?.enabled).toBeTrue();
  });
});
