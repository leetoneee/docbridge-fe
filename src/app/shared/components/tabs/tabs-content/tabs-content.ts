import { Component, computed, inject, input } from '@angular/core';
import { TabsService } from '../tabs.service';

@Component({
  selector: 'app-tabs-content',
  standalone: true,
  imports: [],
  templateUrl: './tabs-content.html',
  styleUrl: './tabs-content.css',
})
export class TabsContentComponent {
  value = input.required<string>();
  private tabsService = inject(TabsService);

  isActive = computed(() => this.tabsService.activeTab() === this.value());
}
