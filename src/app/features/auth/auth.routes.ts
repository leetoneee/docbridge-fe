import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login').then(m => m.Login),
  },
  // {
  //   path: 'change-password-first',
  //   loadComponent: () =>
  //     import('./change-password-first/change-password-first')
  //       .then(m => m.ChangePasswordFirstComponent),
  // },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];