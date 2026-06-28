import { TestBed } from '@angular/core/testing';

import { LogApiService } from './log-api.service';

describe('LogApiService', () => {
  let service: LogApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
