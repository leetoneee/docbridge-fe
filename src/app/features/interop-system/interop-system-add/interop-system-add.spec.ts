import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteropSystemAdd } from './interop-system-add';

describe('InteropSystemAdd', () => {
  let component: InteropSystemAdd;
  let fixture: ComponentFixture<InteropSystemAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InteropSystemAdd],
    }).compileComponents();

    fixture = TestBed.createComponent(InteropSystemAdd);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
