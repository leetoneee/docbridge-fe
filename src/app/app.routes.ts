import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { firstLoginGuard } from './core/guards/first-login.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  // Public routes
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },

  // Admin / Operator shell
  {
    path: 'admin',
    loadComponent: () => import('./layouts/admin-layout/admin-layout').then((m) => m.AdminLayout),
    canActivate: [authGuard, firstLoginGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'OPERATOR'] },
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
      },
      {
        path: 'systems',
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'OPERATOR'] },
        loadChildren: () =>
          import('./features/interop-system/interop-system.routes').then(
            (m) => m.INTEROP_SYSTEM_ROUTES,
          ),
      },
      {
        path: 'units',
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'OPERATOR'] },
        loadChildren: () =>
          import('./features/interop-unit/interop-unit.routes').then((m) => m.INTEROP_UNIT_ROUTES),
      },
      {
        path: 'accounts',
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'OPERATOR'] },
        loadChildren: () =>
          import('./features/account/account.routes').then((m) => m.ACCOUNT_ROUTES),
      },
    ],
  },
  //     {
  //       path: 'permissions',
  //       canActivate: [roleGuard],
  //       data: { roles: ['ADMIN'] },
  //       loadChildren: () =>
  //         import('./features/permission/permission.routes')
  //           .then(m => m.PERMISSION_ROUTES),
  //     },
  //     {
  //       path: 'logs',
  //       canActivate: [roleGuard],
  //       data: { roles: ['ADMIN', 'OPERATOR'] },
  //       loadChildren: () =>
  //         import('./features/log/log.routes').then(m => m.LOG_ROUTES),
  //     },
  //   ],
  // },

  // Unit shell — portal layout riêng
  // {
  //   path: 'portal',
  //   loadComponent: () =>
  //     import('./layouts/portal-layout/portal-layout.component')
  //       .then(m => m.PortalLayoutComponent),
  //   canActivate: [authGuard, firstLoginGuard, roleGuard],
  //   data: { roles: ['UNIT'] },
  //   children: [
  //     { path: '', redirectTo: 'outbox', pathMatch: 'full' },
  //     {
  //       path: 'outbox',
  //       loadChildren: () =>
  //         import('./features/outbox/outbox.routes').then(m => m.OUTBOX_ROUTES),
  //     },
  //     {
  //       path: 'inbox',
  //       loadChildren: () =>
  //         import('./features/inbox/inbox.routes').then(m => m.INBOX_ROUTES),
  //     },
  //   ],
  // },

  // Fallback
  // { path: '403', loadComponent: () => import('./shared/components/error-403/error-403.component').then(m => m.Error403Component) },
  // { path: '500', loadComponent: () => import('./shared/components/error-500/error-500.component').then(m => m.Error500Component) },
  // { path: '**', redirectTo: '' },
];
