import { Component, HostListener, input, output } from '@angular/core';

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

  openChange = output<boolean>();
  confirm = output<void>();

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.open() && !this.loading()) this.close();
  }

  close() {
    if (this.loading()) return;
    this.openChange.emit(false);
  }

  onConfirm() {
    this.confirm.emit();
  }
}
