import { Routes } from '@angular/router';

export const INTEROP_SYSTEM_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./interop-system-list/interop-system-list').then((m) => m.InteropSystemList),
  },
  // TODO: route detail (SCR04) và quản lý đơn vị thuộc hệ thống (SCR05) khi có code v0
];