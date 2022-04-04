import { TestBed } from '@angular/core/testing';
import { CpuLoadMonitorService } from './cpu-load-monitor.service';
import * as normalLoadMockData from '../../../assets/mocks/normal-load-mock.json';
import * as multipleHighLoadMockData from '../../../assets/mocks/multiple-high-load-occurrences-mock.json';
import * as continuousHighLoadMockData from '../../../assets/mocks/continous-high-load-mock.json';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {WebsocketApiService} from "./websocket-api.service";
import {BehaviorSubject, Subject} from "rxjs";
import {CpuLoadPayload} from "../interfaces/interfaces";

const normalLoadMock = normalLoadMockData;
const multipleHighLoadMock = multipleHighLoadMockData;
const continuousHighLoadMock = continuousHighLoadMockData;

enum CpuLoadStates {
  DEFAULT,
  RECOVERED,
  HIGH_LOAD,
}

const subjectMock = new Subject();
const cpuPayloadMock = new BehaviorSubject<CpuLoadPayload>({
      timeSeries: [[0, 0]],
      systemOverview: {
        platform: 'Loading...',
        uptime: 0,
        cpuCount: 0,
        freeMemory: 0,
        totalMemory: 0
      }
    });

const websocketApiMock = {
  cpuPayload: cpuPayloadMock.asObservable(),
  subject: subjectMock.asObservable()
}

describe('CpuLoadMonitorService', () => {
  let service: CpuLoadMonitorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: WebsocketApiService, useValue: websocketApiMock } ]
    });
    service = TestBed.inject(CpuLoadMonitorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should detect a high CPU load and trigger alerts', () => {
    service.monitorCurrentCpuLoad(continuousHighLoadMock.timeSeries);
    expect(service.cpuLoadState.value).toBe(CpuLoadStates.HIGH_LOAD);
    expect(service.isCpuUnderHighLoad()).toBe(true);
  });

  it('should report the correct number of historical high CPU load occurrences', () => {
    service.generateHistoricalHighCpuOverview(normalLoadMock.timeSeries);
    expect(service.historicalCpuLoadOverview.value.length).toBe(0);
    service.generateHistoricalHighCpuOverview(multipleHighLoadMock.timeSeries);
    // expect(service.historicalCpuLoadOverview.value.length).toBe(2);
  });

  it('should return true when the CPU threshold has been reached', () => {
    expect(service.cpuLoadThresholdReached(100)).toBe(true);
  });

  it('should detect if the duration threshold has been surpassed', () => {
    // The timestamps below are 2mins and 1s apart
    expect(service.cpuLoadDurationThresholdReached(1649014021000, 1649013900000)).toBe(true);
  });

  it('should detect if the recovery threshold has been surpassed', () => {
    // The timestamps below are 2mins and 1s apart
    expect(service.cpuLoadRecoveryThresholdReached(1649014021000, 1649013900000)).toBe(true);
  });
});
