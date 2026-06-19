import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteropUnitDetail } from './interop-unit-detail';

describe('InteropUnitDetail', () => {
  let component: InteropUnitDetail;
  let fixture: ComponentFixture<InteropUnitDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InteropUnitDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(InteropUnitDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
