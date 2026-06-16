import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ApiResponse } from '../../shared/models/api-response.model';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router      = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const body = error.error as ApiResponse<null>;
      const code = body?.code;

      switch (error.status) {
        case 401:
          authService.logout();
          break;

        case 403:
          if (code === 'MUST_CHANGE_PASSWORD') {
            router.navigate(['/auth/change-password-first']);
          } else {
            // ACCESS_DENIED hoặc ACCOUNT_LOCKED...
            router.navigate(['/403']);
          }
          break;

        case 500:
          router.navigate(['/500']);
          break;
      }

      return throwError(() => error);
    })
  );
};