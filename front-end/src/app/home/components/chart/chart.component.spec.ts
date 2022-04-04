import {ComponentFixture, TestBed} from '@angular/core/testing';
import { ChartComponent } from './chart.component';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import * as normalLoadMockData from "../../../../assets/mocks/normal-load-mock.json";
import {TIME_WINDOW} from "../../../shared/constants/constants";

const normalLoadMock = normalLoadMockData;

describe('ChartComponent', () => {
  let component: ChartComponent;
  let fixture: ComponentFixture<ChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ ChartComponent ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartComponent);
    component = fixture.componentInstance;
    component.timeSeries = normalLoadMock.timeSeries;
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain the correct amount of points for the past 10 minutes (the TIME_WINDOW)', () => {
    let chart = component['chart'];
    expect(chart.series[0].data.length).toBe(TIME_WINDOW);
  });

  it('should display the legend for the chart', () => {
    let chart = component['chart'];
    expect(chart.options.legend?.enabled).toBe(true);
  });

  it('should display the correct title', () => {
    let chart = component['chart'];
    expect(chart.options.title?.text).toBe('CPU Load History');
  });

  it('should not use UTC time for axis scaling', () => {
    let chart = component['chart'];
    expect(chart.options.time?.useUTC).toBe(false);
  });
});
