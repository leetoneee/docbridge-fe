import { Component, input, output } from '@angular/core';
import { ModalComponent } from '../../../shared/components/modal/modal';
import { InfoCardComponent } from '../../../shared/components/info-card/info-card/info-card';
import { InfoGridComponent } from '../../../shared/components/info-card/info-grid/info-grid';
import { InfoRowComponent } from '../../../shared/components/info-card/info-row/info-row';
import { RoleBadgeComponent } from '../../../shared/components/role-badge/role-badge';
import { ActionBadgeComponent } from '../../../shared/components/log-badges/action-badge/action-badge';
import { ResultBadgeComponent } from '../../../shared/components/log-badges/result-badge/result-badge';
import { LocalDatePipe } from '../../../shared/pipes/local-date-pipe';
import { AuditLog, TARGET_LABEL } from '../models/log.model';

@Component({
  selector: 'app-log-detail-modal',
  standalone: true,
  imports: [
    ModalComponent,
    InfoCardComponent,
    InfoGridComponent,
    InfoRowComponent,
    RoleBadgeComponent,
    ActionBadgeComponent,
    ResultBadgeComponent,
    LocalDatePipe,
  ],
  templateUrl: './log-detail-modal.html',
  styleUrl: './log-detail-modal.css',
})
export class LogDetailModal {
  open = input.required<boolean>();
  log = input<AuditLog | null>(null);
  openChange = output<boolean>();

  readonly TARGET_LABEL = TARGET_LABEL;

  close() {
    this.openChange.emit(false);
  }
}
