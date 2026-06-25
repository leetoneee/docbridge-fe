import { TestBed } from '@angular/core/testing';

import { OutboxApiService } from './outbox-api.service';

describe('OutboxApiService', () => {
  let service: OutboxApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OutboxApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
