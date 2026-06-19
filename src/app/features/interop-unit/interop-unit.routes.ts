import { Routes } from '@angular/router';

export const INTEROP_UNIT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./interop-unit-list/interop-unit-list').then((m) => m.InteropUnitList),
  },
  // TODO: route ':id' khi có code v0 cho interop-unit-detail
];