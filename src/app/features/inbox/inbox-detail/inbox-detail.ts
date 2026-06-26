import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { LocalDatePipe } from '../../../shared/pipes/local-date-pipe';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge';
import { InboxApiService } from '../services/inbox-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Transaction } from '../models/transaction.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InfoCardComponent } from '../../../shared/components/info-card/info-card/info-card';
import { InfoGridComponent } from '../../../shared/components/info-card/info-grid/info-grid';
import { InfoRowComponent } from '../../../shared/components/info-card/info-row/info-row';
import { AcceptInboxModal } from '../accept-inbox-modal/accept-inbox-modal';
import { RejectInboxModal } from '../reject-inbox-modal/reject-inbox-modal';

@Component({
  selector: 'app-inbox-detail',
  standalone: true,
  imports: [
    StatusBadgeComponent,
    LocalDatePipe,
    InfoCardComponent,
    InfoGridComponent,
    InfoRowComponent,
    AcceptInboxModal,
    RejectInboxModal,
  ],
  templateUrl: './inbox-detail.html',
  styleUrl: './inbox-detail.css',
})
export class InboxDetail implements OnInit {
  private api = inject(InboxApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  tx = signal<Transaction | null>(null);
  loading = signal(true);
  // accepting = signal(false);
  // rejecting = signal(false);

  showAcceptModal = signal(false); // đổi sang signal
  showRejectModal = signal(false); // đổi sang signal

  private transactionCode = '';

  ngOnInit() {
    this.transactionCode = this.route.snapshot.paramMap.get('transactionCode') ?? '';
    this.loadDetail();
  }

  loadDetail() {
    this.loading.set(true);
    this.api
      .getDetail(this.transactionCode)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.tx.set(data);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.router.navigate(['/portal/inbox']);
        },
      });
  }

  onAcceptModalOpenChange(isOpen: boolean) {
    this.showAcceptModal.set(isOpen);
    if (!isOpen) this.loadDetail();
  }

  onRejectModalOpenChange(isOpen: boolean) {
    this.showRejectModal.set(isOpen);
    if (!isOpen) this.loadDetail();
  }

  goBack() {
    this.router.navigate(['/portal/inbox']);
  }
}
