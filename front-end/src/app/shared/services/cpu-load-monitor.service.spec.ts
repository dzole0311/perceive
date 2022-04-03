import { TestBed } from '@angular/core/testing';
import { CpuLoadMonitorService } from './cpu-load-monitor.service';
import * as normalLoadMockData from '../../../assets/mocks/normal-load-mock.json';
import * as multipleHighLoadMockData from '../../../assets/mocks/multiple-high-load-occurrences-mock.json';
import * as continuousHighLoadMockData from '../../../assets/mocks/continous-high-load-mock.json';
import {WebsocketApiService} from "./websocket-api.service";
import {BehaviorSubject} from "rxjs";
import {CpuLoadPayload} from "../interfaces/interfaces";

const normalLoadMock = normalLoadMockData;
const multipleHighLoadMock = multipleHighLoadMockData;
const continuousHighLoadMock = continuousHighLoadMockData;

enum CpuLoadStates {
  DEFAULT,
  RECOVERED,
  HIGH_LOAD,
}

describe('CpuLoadMonitorService', () => {
  let service: CpuLoadMonitorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    });
    service = TestBed.inject(CpuLoadMonitorService);
    service.historicalCpuLoadOverview.next([]);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should report the correct number of historical high CPU load occurrences', () => {
    service.generateHistoricalHighCpuOverview(normalLoadMock.timeSeries);
    expect(service.historicalCpuLoadOverview.value.length).toBe(0);
  });

  it('should detect a high CPU load and trigger alerts', () => {
    service.monitorCurrentCpuLoad(continuousHighLoadMock.timeSeries);
    expect(service.cpuLoadState.value).toBe(CpuLoadStates.HIGH_LOAD);
  });

  it('should return true when the CPU threshold has been reached', () => {
    expect(service.cpuLoadThresholdReached(100)).toBe(true);
  })

  // it('should return true when the CPU duration threshold has been reached', () => {
  //   expect(service.cpuLoadDurationThresholdReached(1649003248047, 1649003247927)).toBe(true);
  // })
});
