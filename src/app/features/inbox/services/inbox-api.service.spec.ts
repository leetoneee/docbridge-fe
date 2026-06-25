import { TestBed } from '@angular/core/testing';

import { InboxApiService } from './inbox-api.service';

describe('InboxApiService', () => {
  let service: InboxApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InboxApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
