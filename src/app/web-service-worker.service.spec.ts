import { TestBed } from '@angular/core/testing';

import { WebServiceWorkerService } from './web-service-worker.service';

describe('WebServiceWorkerService', () => {
  let service: WebServiceWorkerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebServiceWorkerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
