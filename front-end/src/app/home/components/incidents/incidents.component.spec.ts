import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IncidentsComponent } from './incidents.component';
import {ToastrService} from "ngx-toastr";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {CpuLoadMonitorService} from '../../../shared/services/cpu-load-monitor.service';
import {BehaviorSubject} from "rxjs";
import {By} from "@angular/platform-browser";
import * as multipleHighLoadMockData from "../../../../assets/mocks/multiple-high-load-occurrences-mock.json";

enum CpuLoadStates {
  DEFAULT,
  RECOVERED,
  HIGH_LOAD,
}

const multipleHighLoadMock = multipleHighLoadMockData;

const mockToastService = {
  info: function() {},
  success: function() {}
}

const cpuLoadStateMock: BehaviorSubject<CpuLoadStates> = new BehaviorSubject<CpuLoadStates>(CpuLoadStates.DEFAULT);
const historicalCpuLoadOverviewMock: BehaviorSubject<number[][]> = new BehaviorSubject<number[][]>([[0, 0]]);

const cpuLoadMonitorServiceMock = {
  cpuLoadState: cpuLoadStateMock.asObservable(),
  historicalCpuLoadOverview: historicalCpuLoadOverviewMock.asObservable()
};

describe('IncidentsComponent', () => {
  let component: IncidentsComponent;
  let fixture: ComponentFixture<IncidentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ IncidentsComponent ],
      providers: [
        { provide: ToastrService, useValue: mockToastService },
        { provide: CpuLoadMonitorService, useValue: cpuLoadMonitorServiceMock }
      ]
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

  it('should call the toast message when the CPU reaches a HIGH_LOAD state', () => {
    spyOn(mockToastService, 'info');
    let cpuLoadState = CpuLoadStates.HIGH_LOAD;
    cpuLoadStateMock.next(cpuLoadState);
    expect(mockToastService.info).toHaveBeenCalled();
    expect(component.cpuLoadState).toBe(cpuLoadState);
  });

  it('should call the toast message when the CPU reaches a RECOVERED state', () => {
    spyOn(mockToastService, 'success');
    let cpuLoadState = CpuLoadStates.RECOVERED;
    cpuLoadStateMock.next(cpuLoadState);
    expect(mockToastService.success).toHaveBeenCalled();
    expect(component.cpuLoadState).toBe(cpuLoadState);
  });

  it('should show the correct number of items in the historical CPU load overview list', () => {
    const mockedHighCpuLoadIntervals = [[1648807544000, 1648807724000], [1648808324000, 1648808564000], [1648809464000, 1648809764000]]
    historicalCpuLoadOverviewMock.next(mockedHighCpuLoadIntervals);
    expect(component.historicalCpuLoadOverview.length).toBe(3);
  });

  it('should show a blinking alert icon in the UI if the CPU is under HIGH_LOAD state', () => {
    let cpuLoadState = CpuLoadStates.HIGH_LOAD;
    cpuLoadStateMock.next(cpuLoadState);
    fixture.detectChanges();
    const notificationIconAlert = fixture.debugElement.query(By.css('.card__notification-icon')).nativeElement;
    expect(notificationIconAlert.classList.contains('blink')).toBeTruthy();
    expect(notificationIconAlert.getAttribute('src')).toBe('./assets/images/circle-exclamation-solid.svg');
  });

  it('should show a warning text in the UI if the CPU is under HIGH_LOAD state', () => {
    let cpuLoadState = CpuLoadStates.HIGH_LOAD;
    cpuLoadStateMock.next(cpuLoadState);
    fixture.detectChanges();
    const notificationDescription = fixture.debugElement.query(By.css('.card__notification span')).nativeElement;
    expect(notificationDescription.textContent).toBe('High CPU load detected');
  });

  it('should set the correct text and icon when the CPU has recovered, or is in the DEFAULT state', () => {
    let cpuLoadState = CpuLoadStates.HIGH_LOAD;
    cpuLoadStateMock.next(cpuLoadState);
    cpuLoadState = CpuLoadStates.RECOVERED;
    cpuLoadStateMock.next(cpuLoadState);
    fixture.detectChanges();
    const notificationDescription = fixture.debugElement.query(By.css('.card__notification span')).nativeElement;
    const notificationIconNormal = fixture.debugElement.query(By.css('.card__notification img')).nativeElement;
    expect(notificationDescription.textContent).toBe('The CPU load is currently stable');
    expect(notificationIconNormal.getAttribute('src')).toBe('./assets/images/circle-check-solid.svg');
  });

});
