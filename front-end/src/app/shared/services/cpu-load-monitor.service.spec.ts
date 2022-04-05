import {TestBed} from '@angular/core/testing';
import { CpuLoadMonitorService } from './cpu-load-monitor.service';
import * as normalLoadMockData from '../../../assets/mocks/normal-load-mock.json';
import * as multipleHighLoadMockData from '../../../assets/mocks/multiple-high-load-occurrences-mock.json';
import * as continuousHighLoadMockData from '../../../assets/mocks/continous-high-load-mock.json';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {WebsocketApiService} from "./websocket-api.service";
import {BehaviorSubject, Subject} from "rxjs";
import {CpuLoadPayload} from "../interfaces/interfaces";
import {CPU_HIGH_LOAD_DURATION, CPU_HIGH_LOAD_THRESHOLD} from "../constants/constants";

enum CpuLoadStates {
  DEFAULT,
  RECOVERED,
  HIGH_LOAD,
}

describe('CpuLoadMonitorService', () => {
  let service: CpuLoadMonitorService;
  const normalLoadMock = normalLoadMockData;
  const multipleHighLoadMock = multipleHighLoadMockData;
  const continuousHighLoadMock = continuousHighLoadMockData;
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: WebsocketApiService, useValue: websocketApiMock } ]
    });
    service = TestBed.inject(CpuLoadMonitorService);
    service.cpuHighLoadThreshold.next(CPU_HIGH_LOAD_THRESHOLD);
    service.cpuHighLoadDurationThreshold.next(CPU_HIGH_LOAD_DURATION);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should detect a high CPU load and change state', () => {
    service.monitorCurrentCpuLoad(continuousHighLoadMock.timeSeries);
    expect(service.cpuLoadState.value).toBe(CpuLoadStates.HIGH_LOAD);
    expect(service.isCpuUnderHighLoad()).toBe(true);
  });

  it('should report the correct number of historical high CPU load occurrences', () => {
    service.generateHistoricalHighCpuOverview(normalLoadMock.timeSeries);
    expect(service.historicalCpuLoadOverview.value.length).toBe(0);
    service.cpuHighLoadThreshold.next(100);
    service.cpuHighLoadDurationThreshold.next(2);
    let variable = service.generateHistoricalHighCpuOverview(multipleHighLoadMock.timeSeries);
    expect(variable.length).toBe(3);
  });

  it('should correctly detect if the CPU threshold has been reached or surpassed', () => {
    expect(service.cpuLoadThresholdReached(101)).toBe(true);
    expect(service.cpuLoadThresholdReached(45)).toBe(false);
    expect(service.cpuLoadThresholdReached(100)).toBe(true);
    expect(service.cpuLoadThresholdReached(120)).toBe(true);
    expect(service.cpuLoadThresholdReached(10)).toBe(false);
  });

  it('should correctly detect if the duration threshold has been surpassed', () => {
    // Timestamps are 2 minutes apart, which is the value of the CPU_LOAD_DURATION_THRESHOLD
    expect(service.cpuLoadDurationThresholdReached(1649088120000, 1649088000000)).toBe(true);
    // Timestamps are 1 minute apart, which is less than the CPU_LOAD_DURATION_THRESHOLD
    expect(service.cpuLoadDurationThresholdReached(1649083800000, 1649083860000)).toBe(false);
    // Timestamps are 2 minutes and 5 seconds apart, which is bigger than the CPU_LOAD_DURATION_THRESHOLD
    expect(service.cpuLoadDurationThresholdReached(1649077625000, 1649077500000)).toBe(true);
  });

  it('should detect if the recovery threshold has been reached or surpassed', () => {
    // Timestamps are 2 minutes apart, which is the value of the CPU_LOAD_DURATION_THRESHOLD
    expect(service.cpuLoadRecoveryThresholdReached(1649088120000, 1649088000000)).toBe(true);
    // Timestamps are 1 minute apart, which is less than the CPU_LOAD_DURATION_THRESHOLD
    expect(service.cpuLoadRecoveryThresholdReached(1649083800000, 1649083860000)).toBe(false);
    // Timestamps are 2 minutes and 5 seconds apart, which is bigger than the CPU_LOAD_DURATION_THRESHOLD
    expect(service.cpuLoadRecoveryThresholdReached(1649077625000, 1649077500000)).toBe(true);
  });
});
