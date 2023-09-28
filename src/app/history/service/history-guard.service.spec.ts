import { TestBed } from '@angular/core/testing';

import { HistoryGuardService } from './history-guard.service';

describe('HistoryGuardService', () => {
  let service: HistoryGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoryGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
