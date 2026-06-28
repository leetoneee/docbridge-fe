import { Routes } from '@angular/router';

export const LOG_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./log-list/log-list').then((m) => m.LogList),
  },
];