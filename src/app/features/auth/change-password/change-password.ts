import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { PasswordFieldComponent } from '../../../shared/components/password-field/password-field';
import { PasswordStrengthComponent } from '../../../shared/components/password-strength/password-strength';
import { AuthApiService } from '../services/auth-api.service';
import { Router } from '@angular/router';
import { CurrentUserService } from '../../../core/services/current-user.service';

function passwordStrengthLevel(password: string): 0 | 1 | 2 | 3 {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8)                              score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password))                               score++;
  if (/[^A-Za-z0-9]/.test(password))                    score++;
  if (score <= 2) return 1;
  if (score === 3) return 2;
  return 3;
}

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const newPwd     = control.get('newPassword')?.value;
  const confirmPwd = control.get('confirmPassword')?.value;
  if (confirmPwd && newPwd !== confirmPwd) return { passwordMismatch: true };
  return null;
}

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [ReactiveFormsModule, PasswordFieldComponent, PasswordStrengthComponent],
  templateUrl: './change-password.html',
  styleUrl: './change-password.css',
})
export class ChangePassword {
  private fb     = inject(FormBuilder);
  private api    = inject(AuthApiService);
  private router = inject(Router);
  private currentUser = inject(CurrentUserService);

  isLoading   = signal(false);
  serverError = signal<string | null>(null);

  form = this.fb.group(
    {
      currentPassword: ['', Validators.required],
      newPassword:     ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordMatchValidator }
  );

  get currentPwd() { return this.form.get('currentPassword')!; }
  get newPwd()     { return this.form.get('newPassword')!; }
  get confirmPwd() { return this.form.get('confirmPassword')!; }

  get strengthLevel(): 0 | 1 | 2 | 3 {
    return passwordStrengthLevel(this.newPwd.value ?? '');
  }

  get newPwdError(): string | null {
    if (!this.newPwd.dirty) return null;
    if (this.newPwd.hasError('minlength')) return 'Mật khẩu phải có ít nhất 8 ký tự';
    return null;
  }

  get confirmError(): string | null {
    if (!this.confirmPwd.dirty) return null;
    if (this.form.hasError('passwordMismatch')) return 'Xác nhận mật khẩu không khớp';
    return null;
  }

  onClose(): void {
    const role = this.currentUser.role();
    if (role === 'UNIT') {
      this.router.navigate(['/portal/inbox']);
    } else {
      this.router.navigate(['/admin/dashboard']);
    }
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.isLoading()) return;

    this.isLoading.set(true);
    this.serverError.set(null);

    this.api.changePassword({
      oldPassword:     this.currentPwd.value!,
      newPassword:     this.newPwd.value!,
      confirmPassword: this.confirmPwd.value!,
    }).subscribe({
      next: (res) => {
        if (res.code === 'SUCCESS') {
          this.onClose();
        } else {
          this.serverError.set(res.message);
          this.isLoading.set(false);
        }
      },
      error: () => {
        this.serverError.set('Đã xảy ra lỗi. Vui lòng thử lại.');
        this.isLoading.set(false);
      },
    });
  }
}
