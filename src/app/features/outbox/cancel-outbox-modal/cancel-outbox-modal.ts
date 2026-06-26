import { Component, DestroyRef, inject, input, output, signal, SimpleChanges } from '@angular/core';
import { ModalComponent } from '../../../shared/components/modal/modal';
import { HttpErrorResponse } from '@angular/common/http';
import { OutboxApiService } from '../services/outbox-api.service';
import { Transaction } from '../../inbox/models/transaction.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-cancel-outbox-modal',
  standalone: true,
  imports: [ModalComponent],
  templateUrl: './cancel-outbox-modal.html',
  styleUrl: './cancel-outbox-modal.css',
})
export class CancelOutboxModal {
  private api = inject(OutboxApiService);
  private destroyRef = inject(DestroyRef);

  open = input.required<boolean>();
  tx = input<Transaction | null>(null);

  openChange = output<boolean>();
  cancelled = output<void>();

  reason = signal('');
  submitting = signal(false);
  errorMessage = signal<string | null>(null);

  ngOnChanges(changes: SimpleChanges) {
    if (changes['open'] && this.open()) {
      this.reason.set('');
      this.errorMessage.set(null);
    }
  }

  close() {
    if (this.submitting()) return;
    this.openChange.emit(false);
  }

  onReasonInput(event: Event) {
    this.reason.set((event.target as HTMLTextAreaElement).value);
  }

  onConfirm() {
    const t = this.tx();
    if (!t || !this.reason().trim()) return;
    this.submitting.set(true);
    this.errorMessage.set(null);

    this.api
      .cancel(t.transactionCode, t.version, this.reason().trim())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.submitting.set(false);
          this.openChange.emit(false);
          this.cancelled.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.submitting.set(false);
          this.errorMessage.set(err.error?.message ?? 'Có lỗi xảy ra, vui lòng thử lại.');
        },
      });
  }
}
