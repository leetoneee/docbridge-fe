import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectUnitModal } from './reject-unit-modal';

describe('RejectUnitModal', () => {
  let component: RejectUnitModal;
  let fixture: ComponentFixture<RejectUnitModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RejectUnitModal],
    }).compileComponents();

    fixture = TestBed.createComponent(RejectUnitModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
