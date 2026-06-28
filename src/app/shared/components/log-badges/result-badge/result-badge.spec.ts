import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultBadgeComponent as ResultBadge } from './result-badge';

describe('ResultBadge', () => {
  let component: ResultBadge;
  let fixture: ComponentFixture<ResultBadge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultBadge],
    }).compileComponents();

    fixture = TestBed.createComponent(ResultBadge);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
