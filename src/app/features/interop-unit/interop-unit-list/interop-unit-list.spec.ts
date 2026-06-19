import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteropUnitList } from './interop-unit-list';

describe('InteropUnitList', () => {
  let component: InteropUnitList;
  let fixture: ComponentFixture<InteropUnitList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InteropUnitList],
    }).compileComponents();

    fixture = TestBed.createComponent(InteropUnitList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
