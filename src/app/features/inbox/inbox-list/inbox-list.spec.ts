import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InboxList } from './inbox-list';

describe('InboxList', () => {
  let component: InboxList;
  let fixture: ComponentFixture<InboxList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InboxList],
    }).compileComponents();

    fixture = TestBed.createComponent(InboxList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
