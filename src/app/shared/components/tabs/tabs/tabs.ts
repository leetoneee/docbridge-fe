import { Component, inject, input, OnInit } from '@angular/core';
import { TabsService } from '../tabs.service';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [],
  templateUrl: './tabs.html',
  styleUrl: './tabs.css',
})
export class TabsComponent implements OnInit {
  defaultValue = input.required<string>();
  private tabsService = inject(TabsService);

  ngOnInit() {
    this.tabsService.activeTab.set(this.defaultValue());
  }
}
