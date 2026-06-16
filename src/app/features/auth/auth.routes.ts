import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login').then(m => m.Login),
  },
  {
    path: 'change-password-first',
    loadComponent: () =>
      import('./change-password-first/change-password-first')
        .then(m => m.ChangePasswordFirst),
  },
  {
    path: 'change-password',
    loadComponent: () =>
      import('./change-password/change-password')
        .then(m => m.ChangePassword),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];