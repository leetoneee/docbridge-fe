import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { CurrentUserService } from '../../../core/services/current-user.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';
import { ProfileModal } from '../../../shared/components/profile-modal/profile-modal';
import { RoleBadgeComponent } from '../../../shared/components/role-badge/role-badge';

interface Breadcrumb {
  label: string;
  route?: string;
}

interface RouteLabelConfig {
  label: string;
  group?: string;
}

const ROUTE_LABELS: Record<string, RouteLabelConfig> = {
  inbox: { label: 'Hộp thư đến', group: 'Văn bản' },
  outbox: { label: 'Hộp thư đi', group: 'Văn bản' },
};

const DETAIL_LABEL = 'Chi tiết';

@Component({
  selector: 'app-portal-header',
  standalone: true,
  imports: [RouterLink, ProfileModal, RoleBadgeComponent],
  templateUrl: './portal-header.html',
  styleUrl: './portal-header.css',
})
export class PortalHeader {
  currentUser = inject(CurrentUserService);
  private router = inject(Router);

  readonly role = signal(this.currentUser.role() ?? 'UNIT');

  breadcrumbs = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      startWith(null),
      map(() => this.buildBreadcrumbs()),
    ),
    { initialValue: this.buildBreadcrumbs() },
  );

  private buildBreadcrumbs(): Breadcrumb[] {
    const segments = this.router.url.split('?')[0].split('/').filter(Boolean);
    const crumbs: Breadcrumb[] = [];

    segments.forEach((seg, i) => {
      if (seg === 'portal') return; // bỏ qua segment layout wrapper
      const isLastSegment = i === segments.length - 1;
      const linkRoute = isLastSegment ? undefined : '/' + segments.slice(0, i + 1).join('/');
      const config = ROUTE_LABELS[seg];

      if (config) {
        if (config.group) crumbs.push({ label: config.group });
        crumbs.push({ label: config.label, route: linkRoute });
        return;
      }

      const prevSeg = segments[i - 1];
      if (prevSeg && ROUTE_LABELS[prevSeg]) {
        crumbs.push({ label: DETAIL_LABEL, route: linkRoute });
      }
    });

    return crumbs;
  }
}
