import { TestBed } from '@angular/core/testing';

import { InteropUnitApiService } from './interop-unit-api.service';

describe('InteropUnitApiService', () => {
  let service: InteropUnitApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InteropUnitApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
