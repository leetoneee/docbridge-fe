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

@Component({
  selector: 'app-inbox-detail',
  standalone: true,
  imports: [
    StatusBadgeComponent,
    ConfirmDialog,
    LocalDatePipe,
    InfoCardComponent,
    InfoGridComponent,
    InfoRowComponent,
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
  accepting = signal(false);
  rejecting = signal(false);

  showAcceptConfirm = signal(false); // đổi sang signal
  showRejectDialog = signal(false); // đổi sang signal

  acceptDescription = computed(() => {
    const t = this.tx();
    if (!t) return 'Xác nhận đã tiếp nhận văn bản này. Hành động này không thể hoàn tác.';
    return `Xác nhận tiếp nhận văn bản ${t.documentCode} từ ${t.sender.name}. Hành động này không thể hoàn tác.`;
  });

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

  onAccept() {
    if (!this.tx()) return;
    this.accepting.set(true);
    this.api
      .accept(this.transactionCode, this.tx()!.version)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.accepting.set(false);
          this.showAcceptConfirm.set(false);
          this.loadDetail();
        },
        error: () => {
          this.accepting.set(false);
        },
      });
  }

  onReject(reason: string | undefined) {
    if (!this.tx() || !reason) return;
    this.rejecting.set(true);
    this.api
      .reject(this.transactionCode, this.tx()!.version, reason)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.rejecting.set(false);
          this.showRejectDialog.set(false);
          this.loadDetail();
        },
        error: () => {
          this.rejecting.set(false);
        },
      });
  }

  goBack() {
    this.router.navigate(['/portal/inbox']);
  }
}
