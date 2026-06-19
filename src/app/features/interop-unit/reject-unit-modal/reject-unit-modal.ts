import { Component, inject, input, output, signal } from '@angular/core';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { InteropUnitApiService } from '../services/interop-unit-api.service';

@Component({
  selector: 'app-reject-unit-modal',
  standalone: true,
  imports: [ConfirmDialog],
  templateUrl: './reject-unit-modal.html',
  styleUrl: './reject-unit-modal.css',
})
export class RejectUnitModal {
  private api = inject(InteropUnitApiService);

  open = input.required<boolean>();
  unitId = input.required<number>();

  openChange = output<boolean>();
  rejected = output<void>();

  submitting = signal(false);

  onConfirm(reason: string | undefined) {
    if (!reason) return;
    this.submitting.set(true);
    this.api.reject(this.unitId(), { reason }).subscribe({
      next: () => {
        this.submitting.set(false);
        this.openChange.emit(false);
        this.rejected.emit();
      },
      error: () => {
        this.submitting.set(false);
        // TODO: ConfirmDialog hiện chưa có vùng hiển thị lỗi riêng, cân nhắc bổ sung nếu cần báo lỗi rõ ràng hơn
      },
    });
  }
}
