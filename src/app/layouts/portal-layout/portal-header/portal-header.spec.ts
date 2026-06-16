import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalHeader } from './portal-header';

describe('PortalHeader', () => {
  let component: PortalHeader;
  let fixture: ComponentFixture<PortalHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortalHeader],
    }).compileComponents();

    fixture = TestBed.createComponent(PortalHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
