import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CurrentUserService } from '../../../core/services/current-user.service';
import { AuthService } from '../../../core/services/auth.service';
import { InteropUnitApiService } from '../../../features/interop-unit/services/interop-unit-api.service';
import { RoleBadgeComponent } from '../../../shared/components/role-badge/role-badge';

interface NavItem {
  label: string;
  route: string;
  icon: 'inbox' | 'outbox';
  badgeSignal?: () => number;
}

@Component({
  selector: 'app-portal-sidebar',
  imports: [RouterLink, RouterLinkActive, RoleBadgeComponent],
  templateUrl: './portal-sidebar.html',
  styleUrl: './portal-sidebar.css',
})
export class PortalSidebar implements OnInit {
  private router = inject(Router);
  currentUser = inject(CurrentUserService);
  private auth = inject(AuthService);
  private unitApi = inject(InteropUnitApiService);

  readonly role = signal(this.currentUser.role() ?? 'UNIT');
  
  unitName = signal('Đang tải...');
  unitInteropCode = signal('');
  unitLoading = signal(true);

  // TODO: kết nối API notifications/inbox count khi có endpoint
  inboxBadge = signal(0);

  showLogoutConfirm = signal(false);

  readonly navItems: NavItem[] = [
    {
      label: 'Hộp thư đến',
      route: '/portal/inbox',
      icon: 'inbox',
      badgeSignal: () => this.inboxBadge(),
    },
    { label: 'Hộp thư đi', route: '/portal/outbox', icon: 'outbox' },
  ];

  ngOnInit() {
    const unitId = this.currentUser.unitId();
    if (!unitId) return;

    this.unitApi.getById(unitId).subscribe({
      next: (res) => {
        if (res.data) {
          this.unitName.set(res.data.name);
          this.unitInteropCode.set(res.data.interopCode || '');
        }
        this.unitLoading.set(false);
      },
      error: () => {
        this.unitName.set('Đơn vị liên thông');
        this.unitLoading.set(false);
      },
    });
  }

  onChangePassword() {
    this.router.navigate(['/auth/change-password']);
  }

  confirmLogout() {
    this.showLogoutConfirm.set(true);
  }

  cancelLogout() {
    this.showLogoutConfirm.set(false);
  }

  doLogout() {
    this.showLogoutConfirm.set(false);
    this.auth.logout();
  }
}
