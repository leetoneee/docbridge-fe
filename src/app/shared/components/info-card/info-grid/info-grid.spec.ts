import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoGridComponent as InfoGrid } from './info-grid';

describe('InfoGrid', () => {
  let component: InfoGrid;
  let fixture: ComponentFixture<InfoGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoGrid],
    }).compileComponents();

    fixture = TestBed.createComponent(InfoGrid);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
