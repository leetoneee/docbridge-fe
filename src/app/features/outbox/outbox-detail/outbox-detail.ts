import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { LocalDatePipe } from '../../../shared/pipes/local-date-pipe';
import { OutboxApiService } from '../services/outbox-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Transaction } from '../../inbox/models/transaction.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InfoRowComponent } from '../../../shared/components/info-card/info-row/info-row';
import { InfoGridComponent } from '../../../shared/components/info-card/info-grid/info-grid';
import { InfoCardComponent } from '../../../shared/components/info-card/info-card/info-card';
import { CancelOutboxModal } from '../cancel-outbox-modal/cancel-outbox-modal';

@Component({
  selector: 'app-outbox-detail',
  standalone: true,
  imports: [
    StatusBadgeComponent,
    LocalDatePipe,
    InfoCardComponent,
    InfoGridComponent,
    InfoRowComponent,
    CancelOutboxModal,
  ],
  templateUrl: './outbox-detail.html',
  styleUrl: './outbox-detail.css',
})
export class OutboxDetail implements OnInit {
  private api = inject(OutboxApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  tx = signal<Transaction | null>(null);
  loading = signal(true);
  // cancelling = signal(false);

  showCancelModal = signal(false); // đổi sang signal

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
          this.router.navigate(['/portal/outbox']);
        },
      });
  }

  onCancelModalOpenChange(isOpen: boolean) {
    this.showCancelModal.set(isOpen);
    if (!isOpen) this.loadDetail();
  }

  goBack() {
    this.router.navigate(['/portal/outbox']);
  }
}
