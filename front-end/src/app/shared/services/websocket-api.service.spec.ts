import { TestBed } from '@angular/core/testing';

import { WebsocketApiService } from './websocket-api.service';
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('WebsocketApiService', () => {
  let service: WebsocketApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(WebsocketApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
