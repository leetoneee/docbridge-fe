import { Component, computed, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { PasswordFieldComponent } from '../../../shared/components/password-field/password-field';
import { PasswordStrengthComponent } from '../../../shared/components/password-strength/password-strength';
import { AuthApiService } from '../services/auth-api.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

function passwordStrengthLevel(password: string): 0 | 1 | 2 | 3 {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8)           score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password))            score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return 1;
  if (score === 2) return 1;
  if (score === 3) return 2;
  return 3;
}

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const newPwd     = control.get('newPassword')?.value;
  const confirmPwd = control.get('confirmPassword')?.value;
  if (confirmPwd && newPwd !== confirmPwd) {
    return { passwordMismatch: true };
  }
  return null;
}

function notSameAsTemp(control: AbstractControl): ValidationErrors | null {
  const tempPwd = control.parent?.get('tempPassword')?.value;
  if (tempPwd && control.value && control.value === tempPwd) {
    return { sameAsTemp: true };
  }
  return null;
}

@Component({
  selector: 'app-change-password-first',
  imports: [ReactiveFormsModule, PasswordFieldComponent, PasswordStrengthComponent],
  templateUrl: './change-password-first.html',
  styleUrl: './change-password-first.css',
})
export class ChangePasswordFirst {
  private fb      = inject(FormBuilder);
  private api     = inject(AuthApiService);
  private auth    = inject(AuthService);
  private router  = inject(Router);

  isLoading = signal(false);
  serverError = signal<string | null>(null);

  form = this.fb.group(
    {
      tempPassword:    ['', Validators.required],
      newPassword:     ['', [Validators.required, Validators.minLength(8), notSameAsTemp]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordMatchValidator }
  );

  get tempPwd()    { return this.form.get('tempPassword')!; }
  get newPwd()     { return this.form.get('newPassword')!; }
  get confirmPwd() { return this.form.get('confirmPassword')!; }

  get strengthLevel(): 0 | 1 | 2 | 3 {
    return passwordStrengthLevel(this.newPwd.value ?? '');
  }

  get confirmError(): string | null {
    if (!this.confirmPwd.dirty) return null;
    if (this.form.hasError('passwordMismatch')) return 'Xác nhận mật khẩu không khớp';
    return null;
  }

  get newPwdError(): string | null {
    if (!this.newPwd.dirty) return null;
    if (this.newPwd.hasError('minlength')) return 'Mật khẩu phải có ít nhất 8 ký tự';
    if (this.newPwd.hasError('sameAsTemp')) return 'Mật khẩu mới không được trùng mật khẩu tạm thời';
    return null;
  }

  

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.isLoading()) return;

    this.isLoading.set(true);
    this.serverError.set(null);

    this.api.firstChangePassword({
      newPassword:     this.newPwd.value!,
      confirmPassword: this.confirmPwd.value!,
    }).subscribe({
      next: (res) => {
        if (res.code === 'SUCCESS') {
          // Xoá flag mustChangePassword rồi navigate
          this.auth.clearMustChangePwd();
          this.router.navigate(['/']);
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
