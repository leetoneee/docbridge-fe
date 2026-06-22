import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOperatorModal } from './add-operator-modal';

describe('AddOperatorModal', () => {
  let component: AddOperatorModal;
  let fixture: ComponentFixture<AddOperatorModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddOperatorModal],
    }).compileComponents();

    fixture = TestBed.createComponent(AddOperatorModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
