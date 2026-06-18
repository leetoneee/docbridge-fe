import { Component, HostListener, input, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class ModalComponent {
  open = input.required<boolean>();
  title = input.required<string>();
  maxWidth = input<string>('560px');
  closeOnBackdrop = input<boolean>(true);

  openChange = output<boolean>();

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.open()) this.close();
  }

  close() {
    this.openChange.emit(false);
  }

  onBackdropClick() {
    if (this.closeOnBackdrop()) this.close();
  }
}
