import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InboxDetail } from './inbox-detail';

describe('InboxDetail', () => {
  let component: InboxDetail;
  let fixture: ComponentFixture<InboxDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InboxDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(InboxDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
