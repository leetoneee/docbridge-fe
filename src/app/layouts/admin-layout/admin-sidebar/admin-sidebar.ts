import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CurrentUserService } from '../../../core/services/current-user.service';
import { AuthService } from '../../../core/services/auth.service';
import { RoleBadgeComponent } from '../../../shared/components/role-badge/role-badge';

interface NavItem {
  label: string;
  route: string;
  icon: string; // svg path
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
      items: [{ label: 'Dashboard', route: '/admin/dashboard', icon: 'dashboard' }],
    },
    {
      label: 'Liên thông',
      items: [
        { label: 'Hệ thống liên thông', route: '/admin/systems', icon: 'network' },
        { label: 'Đơn vị liên thông', route: '/admin/units', icon: 'building' },
      ],
    },
    {
      label: 'Quản trị',
      items: [
        { label: 'Tài khoản', route: '/admin/accounts', icon: 'users' },
        { label: 'Phân quyền', route: '/admin/permissions', icon: 'shield' },
      ],
    },
    {
      label: 'Giám sát',
      items: [{ label: 'Nhật ký hệ thống', route: '/admin/logs', icon: 'scroll' }],
    },
  ];

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
