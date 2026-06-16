import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { CurrentUserService } from '../../../core/services/current-user.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';

interface Breadcrumb {
  label: string;
  route?: string;
}

const ROUTE_LABELS: Record<string, string> = {
  dashboard:   'Dashboard',
  systems:     'Hệ thống liên thông',
  units:       'Đơn vị liên thông',
  accounts:    'Tài khoản',
  permissions: 'Phân quyền',
  logs:        'Nhật ký hệ thống',
};

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin-header.html',
  styleUrl: './admin-header.css',
})
export class AdminHeader {
  currentUser = inject(CurrentUserService);
  private router = inject(Router);

  breadcrumbs = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      startWith(null),
      map(() => this.buildBreadcrumbs()),
    ),
    { initialValue: this.buildBreadcrumbs() }
  );

  private buildBreadcrumbs(): Breadcrumb[] {
    const segments = this.router.url.split('/').filter(Boolean);
    const crumbs: Breadcrumb[] = [];
    segments.forEach((seg, i) => {
      const label = ROUTE_LABELS[seg];
      if (label) {
        crumbs.push({
          label,
          route: i < segments.length - 1 ? '/' + segments.slice(0, i + 1).join('/') : undefined,
        });
      }
    });
    return crumbs;
  }
}
