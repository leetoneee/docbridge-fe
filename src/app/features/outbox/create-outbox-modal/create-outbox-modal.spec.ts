import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOutboxModal } from './create-outbox-modal';

describe('CreateOutboxModal', () => {
  let component: CreateOutboxModal;
  let fixture: ComponentFixture<CreateOutboxModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateOutboxModal],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateOutboxModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
