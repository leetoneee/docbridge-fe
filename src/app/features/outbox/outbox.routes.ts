import { Routes } from '@angular/router';

export const OUTBOX_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./outbox-list/outbox-list').then((m) => m.OutboxList),
  },
  {
    path: ':transactionCode',
    loadComponent: () => import('./outbox-detail/outbox-detail').then((m) => m.OutboxDetail),
  },
];
