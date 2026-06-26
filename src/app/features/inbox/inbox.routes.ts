import { Routes } from '@angular/router';

export const INBOX_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./inbox-list/inbox-list').then((m) => m.InboxList),
  },
  {
    path: ':transactionCode',
    loadComponent: () => import('./inbox-detail/inbox-detail').then((m) => m.InboxDetail),
  },
];
