import { Component, computed, input } from '@angular/core';
import { AuditResult } from '../../../../features/log/models/log.model';

@Component({
  selector: 'app-result-badge',
  imports: [],
  templateUrl: './result-badge.html',
  styleUrl: './result-badge.css',
})
export class ResultBadgeComponent {
  result = input.required<AuditResult>();
  success = computed(() => this.result() === 'SUCCESS');
}
