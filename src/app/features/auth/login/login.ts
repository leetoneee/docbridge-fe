import { Component, inject, signal } from '@angular/core';
import { PasswordFieldComponent } from '../../../shared/components/password-field/password-field';
import { 
  ReactiveFormsModule, 
  FormBuilder,
  Validators, 
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthApiService } from '../services/auth-api.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, PasswordFieldComponent],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  private fb        = inject(FormBuilder);
  private router    = inject(Router);
  private authApi   = inject(AuthApiService);
  private authService = inject(AuthService);

  isLoading  = signal(false);
  errorCode  = signal<string | null>(null);

  form = this.fb.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  get emailCtrl()    { return this.form.controls.email; }
  get passwordCtrl() { return this.form.controls.password; }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorCode.set(null);

    this.authApi.login(this.form.getRawValue() as any).subscribe({
      next: (res) => {
        this.isLoading.set(false);

        if (res.code !== 'SUCCESS' || !res.data) {
          this.errorCode.set(res.code);
          return;
        }

        this.authService.handleLoginSuccess(res.data);

        if (res.data.mustChangePassword) {
          this.router.navigate(['/auth/change-password-first']);
        } else {
          this.redirectByRole();
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        const code = err.error?.code ?? 'INTERNAL_ERROR';
        this.errorCode.set(code);
      },
    });
  }

  private redirectByRole(): void {
    const role = this.authService.role();
    if (role === 'UNIT') {
      this.router.navigate(['/portal/outbox']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  errorMessage(): string | null {
    switch (this.errorCode()) {
      case 'INVALID_CREDENTIALS': return 'Email hoặc mật khẩu không chính xác';
      case 'ACCOUNT_LOCKED':      return 'Tài khoản đã bị khoá. Vui lòng liên hệ quản trị viên';
      case 'ACCOUNT_PENDING':     return 'Tài khoản đang chờ phê duyệt';
      case 'INTERNAL_ERROR':      return 'Lỗi hệ thống, vui lòng thử lại sau';
      default:                    return this.errorCode();
    }
  }
}
