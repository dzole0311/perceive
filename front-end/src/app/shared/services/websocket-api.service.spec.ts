import { TestBed } from '@angular/core/testing';

import { WebsocketApiService } from './websocket-api.service';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {BehaviorSubject, Subject} from "rxjs";
import {CpuLoadPayload} from "../interfaces/interfaces";

describe('WebsocketApiService', () => {
  let service: WebsocketApiService;
  const subjectMock = new Subject();
  const cpuPayloadMock = new BehaviorSubject<CpuLoadPayload>(<any>0);

  const websocketApiMock = {
    cpuPayload: cpuPayloadMock.asObservable(),
    subject: subjectMock.asObservable()
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: WebsocketApiService, useValue: websocketApiMock } ]
    });
    service = TestBed.inject(WebsocketApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
