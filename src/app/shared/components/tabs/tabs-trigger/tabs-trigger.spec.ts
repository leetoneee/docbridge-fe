import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsTriggerComponent as TabsTrigger } from './tabs-trigger';

describe('TabsTrigger', () => {
  let component: TabsTrigger;
  let fixture: ComponentFixture<TabsTrigger>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabsTrigger],
    }).compileComponents();

    fixture = TestBed.createComponent(TabsTrigger);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
