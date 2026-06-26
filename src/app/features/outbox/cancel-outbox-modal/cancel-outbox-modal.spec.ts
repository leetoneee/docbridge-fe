import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelOutboxModal } from './cancel-outbox-modal';

describe('CancelOutboxModal', () => {
  let component: CancelOutboxModal;
  let fixture: ComponentFixture<CancelOutboxModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CancelOutboxModal],
    }).compileComponents();

    fixture = TestBed.createComponent(CancelOutboxModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
