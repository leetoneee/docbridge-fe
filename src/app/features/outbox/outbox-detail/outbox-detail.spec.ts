import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutboxDetail } from './outbox-detail';

describe('OutboxDetail', () => {
  let component: OutboxDetail;
  let fixture: ComponentFixture<OutboxDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutboxDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(OutboxDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
