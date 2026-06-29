import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CurrentUserService } from '../../../core/services/current-user.service';
import { AuthService } from '../../../core/services/auth.service';
import { RoleBadgeComponent } from '../../../shared/components/role-badge/role-badge';

interface NavItem {
  label: string;
  route: string;
  icon: string; // svg path
  roles: ('ADMIN' | 'OPERATOR')[];
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RoleBadgeComponent],
  templateUrl: './admin-sidebar.html',
  styleUrl: './admin-sidebar.css',
})
export class AdminSidebar {
  private router = inject(Router);
  currentUser = inject(CurrentUserService);
  private auth = inject(AuthService);

  showLogoutConfirm = signal(false);
  showChangePassword = signal(false);

  readonly role = signal(this.currentUser.role() ?? 'UNIT');

  readonly navGroups: NavGroup[] = [
    {
      label: 'Tổng quan',
      items: [
        {
          label: 'Dashboard',
          route: '/management/dashboard',
          icon: 'dashboard',
          roles: ['ADMIN', 'OPERATOR'],
        },
      ],
    },
    {
      label: 'Liên thông',
      items: [
        {
          label: 'Hệ thống liên thông',
          route: '/management/systems',
          icon: 'network',
          roles: ['ADMIN', 'OPERATOR'],
        },
        {
          label: 'Đơn vị liên thông',
          route: '/management/units',
          icon: 'building',
          roles: ['ADMIN', 'OPERATOR'],
        },
      ],
    },
    {
      label: 'Quản trị',
      items: [
        {
          label: 'Tài khoản',
          route: '/management/accounts',
          icon: 'users',
          roles: ['ADMIN', 'OPERATOR'],
        },
        {
          label: 'Phân quyền',
          route: '/management/permissions',
          icon: 'shield',
          roles: ['ADMIN'], // chỉ Admin
        },
      ],
    },
    {
      label: 'Giám sát',
      items: [
        {
          label: 'Nhật ký hệ thống',
          route: '/management/logs',
          icon: 'scroll',
          roles: ['ADMIN', 'OPERATOR'],
        },
      ],
    },
  ];

  readonly visibleNavGroups = this.navGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => item.roles.includes(this.role() as 'ADMIN' | 'OPERATOR')),
    }))
    .filter((group) => group.items.length > 0);

  onChangePassword(): void {
    this.router.navigate(['/auth/change-password']);
  }

  confirmLogout(): void {
    this.showLogoutConfirm.set(true);
  }

  cancelLogout(): void {
    this.showLogoutConfirm.set(false);
  }

  doLogout(): void {
    this.showLogoutConfirm.set(false);
    this.auth.logout();
  }
}
