import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalComponent } from '../../../shared/components/modal/modal';
import { CreateOperatorResult } from '../models/account.model';
import { AccountApiService } from '../services/account-api.service';

@Component({
  selector: 'app-add-operator-modal',
  standalone: true,
  imports: [ReactiveFormsModule, ModalComponent],
  templateUrl: './add-operator-modal.html',
  styleUrl: './add-operator-modal.css',
})
export class AddOperatorModal {
  private fb = inject(FormBuilder);
  private api = inject(AccountApiService);

  open = input.required<boolean>();
  openChange = output<boolean>();
  created = output<CreateOperatorResult>();

  phase = signal<'form' | 'success'>('form');
  submitting = signal(false);
  errorMessage = signal<string | null>(null);
  result = signal<CreateOperatorResult | null>(null);
  copied = signal(false);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  constructor() {
    effect(
      () => {
        if (this.open()) {
          this.phase.set('form');
          this.result.set(null);
          this.errorMessage.set(null);
          this.copied.set(false);
          this.form.reset();
        }
      },
      { allowSignalWrites: true },
    );
  }

  close() {
    if (this.submitting()) return;
    if (this.phase() === 'success') return;
    this.openChange.emit(false);
  }

  closeAfterSuccess() {
    this.openChange.emit(false);
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set(null);

    this.api.createOperator({ email: this.form.getRawValue().email.trim() }).subscribe({
      next: (res) => {
        this.submitting.set(false);
        if (res.data) {
          this.result.set(res.data);
          this.phase.set('success');
          this.created.emit(res.data);
        }
      },
      error: (err) => {
        this.submitting.set(false);
        this.errorMessage.set(err?.error?.message ?? 'Không thể tạo tài khoản. Vui lòng thử lại.');
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
