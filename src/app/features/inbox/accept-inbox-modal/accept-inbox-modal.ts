import { Component, DestroyRef, inject, input, output, signal, SimpleChanges } from '@angular/core';
import { ModalComponent } from '../../../shared/components/modal/modal';
import { HttpErrorResponse } from '@angular/common/http';
import { InboxApiService } from '../services/inbox-api.service';
import { Transaction } from '../models/transaction.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-accept-inbox-modal',
  standalone: true,
  imports: [ModalComponent],
  templateUrl: './accept-inbox-modal.html',
  styleUrl: './accept-inbox-modal.css',
})
export class AcceptInboxModal {
  private api = inject(InboxApiService);
  private destroyRef = inject(DestroyRef);

  open = input.required<boolean>();
  tx = input<Transaction | null>(null);

  openChange = output<boolean>();
  accepted = output<void>();

  submitting = signal(false);
  errorMessage = signal<string | null>(null);

  ngOnChanges(changes: SimpleChanges) {
    if (changes['open'] && this.open()) {
      this.errorMessage.set(null);
    }
  }

  close() {
    if (this.submitting()) return;
    this.openChange.emit(false);
  }

  onConfirm() {
    const t = this.tx();
    if (!t) return;
    this.submitting.set(true);
    this.errorMessage.set(null);

    this.api
      .accept(t.transactionCode, t.version)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.submitting.set(false);
          this.openChange.emit(false);
          this.accepted.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.submitting.set(false);
          this.errorMessage.set(err.error?.message ?? 'Có lỗi xảy ra, vui lòng thử lại.');
        },
      });
  }
}
