import { Component, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalComponent } from '../../../shared/components/modal/modal';
import { InteropSystemApiService } from '../services/interop-system-api.service';
import { InteropSystem } from '../models/interop-system.model';

@Component({
  selector: 'app-interop-system-add',
  imports: [ReactiveFormsModule, ModalComponent],
  templateUrl: './interop-system-add.html',
  styleUrl: './interop-system-add.css',
})
export class InteropSystemAdd {
  private fb = inject(FormBuilder);
  private api = inject(InteropSystemApiService);

  open = input.required<boolean>();
  openChange = output<boolean>();
  created = output<InteropSystem>();

  submitting = signal(false);
  errorMessage = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(255)]],
    code: ['', [Validators.required, Validators.pattern(/^[A-Z0-9_]+$/), Validators.maxLength(50)]],
    description: ['', [Validators.maxLength(1000)]],
  });

  onCodeInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const upper = target.value.toUpperCase();
    target.value = upper;
    this.form.controls.code.setValue(upper);
  }

  close() {
    if (this.submitting()) return;
    this.openChange.emit(false);
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set(null);

    const raw = this.form.getRawValue();

    this.api
      .create({
        code: raw.code,
        name: raw.name.trim(),
        description: raw.description.trim(),
      })
      .subscribe({
        next: (res) => {
          this.submitting.set(false);
          if (res.data) {
            this.created.emit(res.data);
          }
          this.form.reset();
          this.openChange.emit(false);
        },
        error: (err) => {
          this.submitting.set(false);
          this.errorMessage.set(
            err?.error?.message ?? 'Không thể tạo hệ thống liên thông. Vui lòng thử lại.',
          );
        },
      });
  }
}
