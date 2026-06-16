import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalSidebar } from './portal-sidebar';

describe('PortalSidebar', () => {
  let component: PortalSidebar;
  let fixture: ComponentFixture<PortalSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortalSidebar],
    }).compileComponents();

    fixture = TestBed.createComponent(PortalSidebar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
