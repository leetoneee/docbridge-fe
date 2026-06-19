import { Component, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalComponent } from '../../../shared/components/modal/modal';
import { InteropUnitApiService } from '../services/interop-unit-api.service';
import { InteropSystemSummary } from '../../interop-system/models/interop-system.model';
import { InteropUnit } from '../models/interop-unit.model';

@Component({
  selector: 'app-interop-unit-add',
  standalone: true,
  imports: [ReactiveFormsModule, ModalComponent],
  templateUrl: './interop-unit-add.html',
  styleUrl: './interop-unit-add.css',
})
export class InteropUnitAdd {
  private fb = inject(FormBuilder);
  private api = inject(InteropUnitApiService);

  open = input.required<boolean>();
  systemOptions = input.required<InteropSystemSummary[]>();
  openChange = output<boolean>();
  created = output<InteropUnit>();

  submitting = signal(false);
  errorMessage = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    systemId: [null as number | null, [Validators.required]],
    name: ['', [Validators.required, Validators.maxLength(255)]],
    email: ['', [Validators.required, Validators.email]],
    representativeName: ['', [Validators.required, Validators.maxLength(255)]],
    representativePhone: ['', [Validators.required, Validators.pattern(/^(0|\+84)[0-9]{9,10}$/)]],
    description: ['', [Validators.maxLength(1000)]],
  });

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
        systemId: raw.systemId as number,
        name: raw.name.trim(),
        description: raw.description.trim(),
        representativeName: raw.representativeName.trim(),
        representativePhone: raw.representativePhone.trim(),
        email: raw.email.trim(),
      })
      .subscribe({
        next: (res) => {
          this.submitting.set(false);
          if (res.data) this.created.emit(res.data);
          this.form.reset();
          this.openChange.emit(false);
        },
        error: (err) => {
          this.submitting.set(false);
          this.errorMessage.set(
            err?.error?.message ?? 'Không thể thêm đơn vị liên thông. Vui lòng thử lại.',
          );
        },
      });
  }
}
