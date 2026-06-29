import { Component, effect, HostListener, input, output, signal } from '@angular/core';

export type ConfirmDialogTone = 'destructive' | 'warning' | 'primary';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.css',
})
export class ConfirmDialog {
  open = input.required<boolean>();
  title = input.required<string>();
  description = input<string>('');
  confirmLabel = input<string>('Xác nhận');
  cancelLabel = input<string>('Huỷ');
  destructive = input<boolean>(true);
  iconTone = input<ConfirmDialogTone>('destructive');
  loading = input<boolean>(false);
  requireReason = input<boolean>(false);
  reasonLabel = input<string>('Lý do');
  reasonPlaceholder = input<string>('Nhập lý do...');
  errorMessage = input<string>(''); 
  
  openChange = output<boolean>();
  confirm = output<string | undefined>();

  reason = signal('');

  constructor() {
    // reset lý do mỗi lần dialog mở lại
    effect(
      () => {
        if (this.open()) this.reason.set('');
      },
      { allowSignalWrites: true },
    );
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.open() && !this.loading()) this.close();
  }

  close() {
    if (this.loading()) return;
    this.openChange.emit(false);
  }

  onReasonInput(event: Event) {
    this.reason.set((event.target as HTMLTextAreaElement).value);
  }
  onConfirm() {
    if (this.requireReason() && this.reason().trim().length === 0) return;
    this.confirm.emit(this.requireReason() ? this.reason().trim() : undefined);
  }
}
