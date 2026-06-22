import { Routes } from '@angular/router';

export const ACCOUNT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./account-list/account-list').then((m) => m.AccountList),
  },
  {
    path: ':id',
    loadComponent: () => import('./account-detail/account-detail').then((m) => m.AccountDetail),
  },
];
