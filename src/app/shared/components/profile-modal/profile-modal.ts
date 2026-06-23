import { Component, effect, inject, signal } from '@angular/core';
import { ModalComponent } from '../modal/modal';
import { InfoCardComponent } from '../info-card/info-card/info-card';
import { InfoGridComponent } from '../info-card/info-grid/info-grid';
import { InfoRowComponent } from '../info-card/info-row/info-row';
import { StatusBadgeComponent } from '../status-badge/status-badge';
import { RoleBadgeComponent } from '../role-badge/role-badge';
import { LocalDatePipe } from '../../pipes/local-date-pipe';
import { AccountDetail } from '../../../features/account/models/account.model';
import { AccountApiService } from '../../../features/account/services/account-api.service';
import { CurrentUserService } from '../../../core/services/current-user.service';

@Component({
  selector: 'app-profile-modal',
  standalone: true,
  imports: [
    ModalComponent,
    InfoCardComponent,
    InfoGridComponent,
    InfoRowComponent,
    StatusBadgeComponent,
    RoleBadgeComponent,
    LocalDatePipe,
  ],
  templateUrl: './profile-modal.html',
  styleUrl: './profile-modal.css',
})
export class ProfileModal {
  private api = inject(AccountApiService);
  private currentUser = inject(CurrentUserService);


  open = signal(false);
  account = signal<AccountDetail | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  initials = this.currentUser.initials;

  constructor() {
    effect(() => {
      if (this.open() && !this.account()) {
        this.loadProfile();
      }
    });
  }

  toggle() {
    this.open.update((v) => !v);
  }

  close() {
    this.open.set(false);
  }

  private loadProfile() {
    const id = this.currentUser.accountId();
    if (!id) return;

    this.loading.set(true);
    this.error.set(null);

    this.api.getById(id).subscribe({
      next: (res) => {
        if (res.data) this.account.set(res.data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Không thể tải thông tin tài khoản.');
        this.loading.set(false);
      },
    });
  }
}
