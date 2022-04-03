import { TestBed } from '@angular/core/testing';

import { WebsocketApiService } from './websocket-api.service';

describe('WebsocketApiService', () => {
  let service: WebsocketApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebsocketApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
