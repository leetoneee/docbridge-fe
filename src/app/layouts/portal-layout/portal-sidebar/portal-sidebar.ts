import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CurrentUserService } from '../../../core/services/current-user.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-portal-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './portal-sidebar.html',
  styleUrl: './portal-sidebar.css',
})
export class PortalSidebar {
  private router = inject(Router);
  currentUser    = inject(CurrentUserService);
  private auth   = inject(AuthService);

  onChangePassword(): void {
    this.router.navigate(['/auth/change-password']);
  }

  onLogout(): void {
    this.auth.logout();
  }
}
