import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const firstLoginGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  if (auth.mustChangePwd()) {
    return router.createUrlTree(['/auth/change-password-first']);
  }
  return true;
};