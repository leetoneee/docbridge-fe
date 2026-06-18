import { Component, computed, inject, input } from '@angular/core';
import { TabsService } from '../tabs.service';

@Component({
  selector: 'app-tabs-trigger',
  standalone: true,
  imports: [],
  templateUrl: './tabs-trigger.html',
  styleUrl: './tabs-trigger.css',
})
export class TabsTriggerComponent {
  value = input.required<string>();
  private tabsService = inject(TabsService);

  active = computed(() => this.tabsService.activeTab() === this.value());

  select() {
    this.tabsService.activeTab.set(this.value());
  }
}
