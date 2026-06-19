import { Routes } from '@angular/router';

export const INTEROP_UNIT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./interop-unit-list/interop-unit-list').then((m) => m.InteropUnitList),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./interop-unit-detail/interop-unit-detail').then((m) => m.InteropUnitDetail),
  },
];
