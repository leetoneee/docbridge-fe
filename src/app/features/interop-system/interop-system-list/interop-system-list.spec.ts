import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteropSystemList } from './interop-system-list';

describe('InteropSystemList', () => {
  let component: InteropSystemList;
  let fixture: ComponentFixture<InteropSystemList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InteropSystemList],
    }).compileComponents();

    fixture = TestBed.createComponent(InteropSystemList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
