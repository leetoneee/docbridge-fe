import { TestBed } from '@angular/core/testing';

import { InteropSystemApiService } from './interop-system-api.service';

describe('InteropSystemApiService', () => {
  let service: InteropSystemApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InteropSystemApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
