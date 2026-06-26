import { Component, DestroyRef, inject, input, output, signal, SimpleChanges } from '@angular/core';
import { ModalComponent } from '../../../shared/components/modal/modal';
import { HttpErrorResponse } from '@angular/common/http';
import { InboxApiService } from '../services/inbox-api.service';
import { Transaction } from '../models/transaction.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-reject-inbox-modal',
  standalone: true,
  imports: [ModalComponent],
  templateUrl: './reject-inbox-modal.html',
  styleUrl: './reject-inbox-modal.css',
})
export class RejectInboxModal {
  private api = inject(InboxApiService);
  private destroyRef = inject(DestroyRef);

  open = input.required<boolean>();
  tx = input<Transaction | null>(null);

  openChange = output<boolean>();
  rejected = output<void>();

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
      .reject(t.transactionCode, t.version, this.reason().trim())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.submitting.set(false);
          this.openChange.emit(false);
          this.rejected.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.submitting.set(false);
          this.errorMessage.set(err.error?.message ?? 'Có lỗi xảy ra, vui lòng thử lại.');
        },
      });
  }
}
