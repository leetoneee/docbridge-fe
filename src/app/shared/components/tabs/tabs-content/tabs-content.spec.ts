import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsContentComponent as TabsContent } from './tabs-content';

describe('TabsContent', () => {
  let component: TabsContent;
  let fixture: ComponentFixture<TabsContent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabsContent],
    }).compileComponents();

    fixture = TestBed.createComponent(TabsContent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
