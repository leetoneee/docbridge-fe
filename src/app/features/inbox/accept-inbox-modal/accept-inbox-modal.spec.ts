import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptInboxModal } from './accept-inbox-modal';

describe('AcceptInboxModal', () => {
  let component: AcceptInboxModal;
  let fixture: ComponentFixture<AcceptInboxModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcceptInboxModal],
    }).compileComponents();

    fixture = TestBed.createComponent(AcceptInboxModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
