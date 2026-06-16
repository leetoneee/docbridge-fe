import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CurrentUserService } from '../../../core/services/current-user.service';
import { AuthService } from '../../../core/services/auth.service';

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
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './admin-sidebar.html',
  styleUrl: './admin-sidebar.css',
})
export class AdminSidebar {
  private router = inject(Router);
  currentUser    = inject(CurrentUserService);
  private auth   = inject(AuthService);

  showLogoutConfirm    = signal(false);
  showChangePassword   = signal(false);

  readonly navGroups: NavGroup[] = [
    {
      label: 'Tổng quan',
      items: [
        { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
      ],
    },
    {
      label: 'Liên thông',
      items: [
        { label: 'Hệ thống liên thông', route: '/systems', icon: 'network' },
        { label: 'Đơn vị liên thông',   route: '/units',   icon: 'building' },
      ],
    },
    {
      label: 'Quản trị',
      items: [
        { label: 'Tài khoản', route: '/accounts',    icon: 'users' },
        { label: 'Phân quyền', route: '/permissions', icon: 'shield' },
      ],
    },
    {
      label: 'Giám sát',
      items: [
        { label: 'Nhật ký hệ thống', route: '/logs', icon: 'scroll' },
      ],
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
