import { Component, effect, inject, input, output, signal } from '@angular/core';
import { ModalComponent } from '../../../shared/components/modal/modal';
import { AccountApiService } from '../../account/services/account-api.service';
import { ResetAccountPasswordResult } from '../../account/models/account.model';

@Component({
  selector: 'app-reset-password-modal',
  standalone: true,
  imports: [ModalComponent],
  templateUrl: './reset-password-modal.html',
  styleUrl: './reset-password-modal.css',
})
export class ResetPasswordModal {
  private accountApi = inject(AccountApiService);

  open = input.required<boolean>();
  accountId = input.required<number>();

  openChange = output<boolean>();
  reset = output<ResetAccountPasswordResult>();

  phase = signal<'confirm' | 'result'>('confirm');
  submitting = signal(false);
  errorMessage = signal<string | null>(null);
  result = signal<ResetAccountPasswordResult | null>(null);
  copied = signal(false);

  constructor() {
    effect(
      () => {
        if (this.open()) {
          this.phase.set('confirm');
          this.result.set(null);
          this.errorMessage.set(null);
          this.copied.set(false);
        }
      },
      { allowSignalWrites: true },
    );
  }

  close() {
    if (this.submitting()) return;
    if (this.phase() === 'result') return;
    this.openChange.emit(false);
  }

  closeAfterResult() {
    this.openChange.emit(false);
  }

  confirmReset() {
    this.submitting.set(true);
    this.errorMessage.set(null);

    this.accountApi.resetPassword(this.accountId()).subscribe({
      next: (res) => {
        this.submitting.set(false);
        if (res.data) {
          this.result.set(res.data);
          this.phase.set('result');
          this.reset.emit(res.data);
        }
      },
      error: (err) => {
        this.submitting.set(false);
        this.errorMessage.set(err?.error?.message ?? 'Không thể reset mật khẩu. Vui lòng thử lại.');
      },
    });
  }

  copyPassword() {
    const pwd = this.result()?.tempPassword;
    if (!pwd) return;
    navigator.clipboard.writeText(pwd).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1500);
    });
  }
}
