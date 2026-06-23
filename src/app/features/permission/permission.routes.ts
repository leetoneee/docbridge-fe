import { Routes } from '@angular/router';

export const PERMISSION_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./permission-page/permission-page').then((m) => m.PermissionPage),
  },
];