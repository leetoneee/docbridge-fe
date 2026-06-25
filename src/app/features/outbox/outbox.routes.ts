import { Routes } from '@angular/router';

export const OUTBOX_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./outbox-list/outbox-list').then(m => m.OutboxList),
  },
];