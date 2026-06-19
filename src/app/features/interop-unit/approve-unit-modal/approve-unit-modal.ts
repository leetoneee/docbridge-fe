import { Component, effect, inject, input, output, signal } from '@angular/core';
import { ModalComponent } from '../../../shared/components/modal/modal';
import { InteropUnitApiService } from '../services/interop-unit-api.service';
import { ApproveInteropUnitResult } from '../models/interop-unit.model';

@Component({
  selector: 'app-approve-unit-modal',
  standalone: true,
  imports: [ModalComponent],
  templateUrl: './approve-unit-modal.html',
  styleUrl: './approve-unit-modal.css',
})
export class ApproveUnitModal {
  private api = inject(InteropUnitApiService);

  open = input.required<boolean>();
  unitId = input.required<number>();
  unitName = input.required<string>();
  systemName = input.required<string>();

  openChange = output<boolean>();
  approved = output<ApproveInteropUnitResult>();

  phase = signal<'confirm' | 'result'>('confirm');
  submitting = signal(false);
  errorMessage = signal<string | null>(null);
  result = signal<ApproveInteropUnitResult | null>(null);
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
    if (this.phase() === 'result') return; // bắt buộc bấm "Đóng" sau khi thấy mật khẩu
    this.openChange.emit(false);
  }

  closeAfterResult() {
    this.openChange.emit(false);
  }

  confirmApprove() {
    this.submitting.set(true);
    this.errorMessage.set(null);

    this.api.approve(this.unitId()).subscribe({
      next: (res) => {
        this.submitting.set(false);
        if (res.data) {
          this.result.set(res.data);
          this.phase.set('result');
          this.approved.emit(res.data);
        }
      },
      error: (err) => {
        this.submitting.set(false);
        this.errorMessage.set(
          err?.error?.message ?? 'Không thể phê duyệt đơn vị. Vui lòng thử lại.',
        );
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
