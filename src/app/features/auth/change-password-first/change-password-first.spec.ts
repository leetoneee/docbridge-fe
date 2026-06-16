import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePasswordFirst } from './change-password-first';

describe('ChangePasswordFirst', () => {
  let component: ChangePasswordFirst;
  let fixture: ComponentFixture<ChangePasswordFirst>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangePasswordFirst],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangePasswordFirst);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
