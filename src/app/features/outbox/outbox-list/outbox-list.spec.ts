import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutboxList } from './outbox-list';

describe('OutboxList', () => {
  let component: OutboxList;
  let fixture: ComponentFixture<OutboxList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutboxList],
    }).compileComponents();

    fixture = TestBed.createComponent(OutboxList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
