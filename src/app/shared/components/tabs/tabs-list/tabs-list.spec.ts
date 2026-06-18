import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsListComponent as TabsList } from './tabs-list';

describe('TabsList', () => {
  let component: TabsList;
  let fixture: ComponentFixture<TabsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabsList],
    }).compileComponents();

    fixture = TestBed.createComponent(TabsList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
