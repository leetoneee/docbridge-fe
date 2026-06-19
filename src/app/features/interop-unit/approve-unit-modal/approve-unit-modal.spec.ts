import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveUnitModal } from './approve-unit-modal';

describe('ApproveUnitModal', () => {
  let component: ApproveUnitModal;
  let fixture: ComponentFixture<ApproveUnitModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApproveUnitModal],
    }).compileComponents();

    fixture = TestBed.createComponent(ApproveUnitModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
