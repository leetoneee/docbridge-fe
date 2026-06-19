import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteropUnitAdd } from './interop-unit-add';

describe('InteropUnitAdd', () => {
  let component: InteropUnitAdd;
  let fixture: ComponentFixture<InteropUnitAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InteropUnitAdd],
    }).compileComponents();

    fixture = TestBed.createComponent(InteropUnitAdd);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
