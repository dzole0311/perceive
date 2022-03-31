import { TestBed } from '@angular/core/testing';

import { CpuLoadMonitorService } from './cpu-load-monitor.service';

describe('CpuLoadMonitorService', () => {
  let service: CpuLoadMonitorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CpuLoadMonitorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
