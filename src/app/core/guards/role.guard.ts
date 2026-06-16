import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RoleCode } from '../models/auth.model';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth         = inject(AuthService);
  const router       = inject(Router);
  const allowedRoles = route.data['roles'] as RoleCode[];

  if (auth.role() && allowedRoles.includes(auth.role()!)) return true;
  return router.createUrlTree(['/403']);
};