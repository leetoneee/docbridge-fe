import { Component, computed, input } from '@angular/core';
import { ACTION_BADGE, ACTION_LABEL } from '../../../../features/log/models/log.model';

@Component({
  selector: 'app-action-badge',
  standalone: true,
  imports: [],
  templateUrl: './action-badge.html',
  styleUrl: './action-badge.css',
})
export class ActionBadgeComponent {
  action = input.required<string>();
  style = computed(() => ACTION_BADGE[this.action()] ?? { bg: '#F1F5F9', text: '#64748B' });
  label = computed(() => ACTION_LABEL[this.action()] ?? this.action());
}
