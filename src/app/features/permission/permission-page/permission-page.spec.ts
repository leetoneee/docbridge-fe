import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionPage } from './permission-page';

describe('PermissionPage', () => {
  let component: PermissionPage;
  let fixture: ComponentFixture<PermissionPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PermissionPage],
    }).compileComponents();

    fixture = TestBed.createComponent(PermissionPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
