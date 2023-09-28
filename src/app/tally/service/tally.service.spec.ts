import { TestBed } from '@angular/core/testing';

import { TallyService } from './tally.service';

describe('TallyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TallyService = TestBed.get(TallyService);
    expect(service).toBeTruthy();
  });
});
