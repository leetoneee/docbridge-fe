import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectInboxModal } from './reject-inbox-modal';

describe('RejectInboxModal', () => {
  let component: RejectInboxModal;
  let fixture: ComponentFixture<RejectInboxModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RejectInboxModal],
    }).compileComponents();

    fixture = TestBed.createComponent(RejectInboxModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
