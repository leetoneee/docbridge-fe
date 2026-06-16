import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { CurrentUserService } from '../../../core/services/current-user.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';

interface Breadcrumb { label: string; route?: string; }

const ROUTE_LABELS: Record<string, string> = {
  portal: 'Văn bản',
  inbox:  'Hộp thư đến',
  outbox: 'Hộp thư đi',
};

@Component({
  selector: 'app-portal-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './portal-header.html',
  styleUrl: './portal-header.css',
})
export class PortalHeader {
  currentUser    = inject(CurrentUserService);
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
    return segments
      .map((seg, i) => {
        const label = ROUTE_LABELS[seg];
        if (!label) return null;
        return {
          label,
          route: i < segments.length - 1 ? '/' + segments.slice(0, i + 1).join('/') : undefined,
        };
      })
      .filter(Boolean) as Breadcrumb[];
  }
}
