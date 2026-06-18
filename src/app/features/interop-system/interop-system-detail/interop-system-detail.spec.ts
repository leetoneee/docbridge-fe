import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteropSystemDetail } from './interop-system-detail';

describe('InteropSystemDetail', () => {
  let component: InteropSystemDetail;
  let fixture: ComponentFixture<InteropSystemDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InteropSystemDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(InteropSystemDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
