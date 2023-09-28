import { TestBed } from '@angular/core/testing';

import { UUIDService } from './uuid.service';

describe('UUIDService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UUIDService = TestBed.get(UUIDService);
    expect(service).toBeTruthy();
  });
});
