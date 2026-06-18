import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { CurrentUserService } from '../../../core/services/current-user.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';

interface Breadcrumb {
  label: string;
  route?: string;
}

interface RouteLabelConfig {
  label: string;
  group?: string;
}

const ROUTE_LABELS: Record<string, RouteLabelConfig> = {
  dashboard: { label: 'Dashboard' },
  systems: { label: 'Hệ thống liên thông', group: 'Liên thông' },
  units: { label: 'Đơn vị liên thông', group: 'Liên thông' },
  accounts: { label: 'Tài khoản', group: 'Quản trị'},
  permissions: { label: 'Phân quyền', group: 'Quản trị' },
  logs: { label: 'Nhật ký hệ thống', group: 'Giám sát' },
};

const DETAIL_LABEL = 'Chi tiết';

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
      filter((e) => e instanceof NavigationEnd),
      startWith(null),
      map(() => this.buildBreadcrumbs()),
    ),
    { initialValue: this.buildBreadcrumbs() },
  );

  private buildBreadcrumbs(): Breadcrumb[] {
    const segments = this.router.url.split('?')[0].split('/').filter(Boolean);
    const crumbs: Breadcrumb[] = [];
    const pushedGroups = new Set<string>();

    segments.forEach((seg, i) => {
      const isLastSegment = i === segments.length - 1;
      const linkRoute = isLastSegment ? undefined : '/' + segments.slice(0, i + 1).join('/');
      const config = ROUTE_LABELS[seg];

      if (config) {
        if (config.group && !pushedGroups.has(config.group)) {
          pushedGroups.add(config.group);
          crumbs.push({ label: config.group }); // nhãn nhóm, không có route
        }
        crumbs.push({ label: config.label, route: linkRoute });
        return;
      }

      // segment không khớp dictionary -> coi là route con dạng :id (trang chi tiết)
      // chỉ gán "Chi tiết" nếu segment ngay trước đã khớp được 1 label đã biết
      const prevSeg = segments[i - 1];
      if (prevSeg && ROUTE_LABELS[prevSeg]) {
        crumbs.push({ label: DETAIL_LABEL, route: linkRoute });
      }
    });

    return crumbs;
  }
}
