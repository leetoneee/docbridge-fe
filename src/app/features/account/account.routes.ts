import { Routes } from '@angular/router';

export const ACCOUNT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./account-list/account-list').then((m) => m.AccountList),
  },
  // TODO: route ':id' khi có v0 account-detail
];
