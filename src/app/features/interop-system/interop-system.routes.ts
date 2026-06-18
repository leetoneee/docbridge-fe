import { Routes } from '@angular/router';

export const INTEROP_SYSTEM_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./interop-system-list/interop-system-list').then((m) => m.InteropSystemList),
  },
  // {
  //   path: ':id',
  //   loadComponent: () =>
  //     import('./interop-system-detail/interop-system-detail').then((m) => m.InteropSystemDetailComponent),
  // },
];