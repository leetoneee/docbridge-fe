import { Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

let _nextId = 0;

@Component({
  selector: 'app-password-field',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PasswordFieldComponent),
      multi: true,
    },
  ],
  imports: [],
  template: `
    <div class="flex flex-col gap-1.5">
      <label [for]="uid" class="text-[13px] font-medium text-foreground">
        {{ label() }}
      </label>
      <div class="relative">
        <input
          [id]="uid"
          [type]="visible() ? 'text' : 'password'"
          [placeholder]="placeholder()"
          [disabled]="isDisabled()"
          [value]="value()"
          (input)="onInput($event)"
          (blur)="onTouched()"
          [class]="inputClass()"
        />
        @if (showToggle()) {
          <button
            type="button"
            (click)="toggleVisible()"
            [attr.aria-label]="visible() ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted transition-colors hover:text-foreground"
          >
            @if (visible()) {
              <svg icon xmlns="http://www.w3.org/2000/svg" class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
              </svg>
            } @else {
              <svg icon xmlns="http://www.w3.org/2000/svg" class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            }
          </button>
        }
      </div>
      @if (error()) {
        <p class="text-xs text-destructive">{{ error() }}</p>
      }
    </div>
  `,
  styleUrl: './password-field.css',
})

export class PasswordFieldComponent implements ControlValueAccessor {
  // Inputs
  label     = input.required<string>();
  // inputId   = input.required<string>();
  placeholder = input('••••••••');
  error     = input<string | null>(null);
  showToggle  = input(true);          // ← thêm mới

  // Auto-generate id, không cần truyền từ ngoài
  readonly uid = `password-field-${++_nextId}`;
  // Internal state
  value      = signal('');
  visible    = signal(false);
  isDisabled = signal(false);

  // ControlValueAccessor callbacks
  private onChange: (v: string) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(val: string): void {
    this.value.set(val ?? '');
  }

  registerOnChange(fn: (v: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.isDisabled.set(disabled);
  }

  onInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value.set(val);
    this.onChange(val);
  }

  toggleVisible(): void {
    this.visible.update(v => !v);
  }

  inputClass(): string {
    const base = 'h-10 w-full rounded-lg border bg-surface text-sm text-foreground placeholder:text-text-muted outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-50 disabled:cursor-not-allowed pl-3'
      + (this.showToggle() ? ' pr-10' : ' pr-3');
    const errorClass = this.error()
      ? 'border-destructive focus-visible:ring-destructive/30'
      : 'border-input focus-visible:border-ring';
    return `${base} ${errorClass}`;
  }
}