import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { ResetPasswordModal } from '../../interop-unit/reset-password-modal/reset-password-modal';
import { LocalDatePipe } from '../../../shared/pipes/local-date-pipe';
import {
  ConfirmDialog,
  ConfirmDialogTone,
} from '../../../shared/components/confirm-dialog/confirm-dialog';
import { RoleBadgeComponent } from '../../../shared/components/role-badge/role-badge';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge';
import { InfoRowComponent } from '../../../shared/components/info-card/info-row/info-row';
import { InfoGridComponent } from '../../../shared/components/info-card/info-grid/info-grid';
import { InfoCardComponent } from '../../../shared/components/info-card/info-card/info-card';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountApiService } from '../services/account-api.service';
import { AccountDetail as AccountDetailInfo } from '../models/account.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-account-detail',
  standalone: true,
  imports: [
    InfoCardComponent,
    InfoGridComponent,
    InfoRowComponent,
    StatusBadgeComponent,
    RoleBadgeComponent,
    ConfirmDialog,
    LocalDatePipe,
    ResetPasswordModal,
  ],
  templateUrl: './account-detail.html',
  styleUrl: './account-detail.css',
})
export class AccountDetail {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private api = inject(AccountApiService);
  private destroyRef = inject(DestroyRef);

  accountId = Number(this.route.snapshot.paramMap.get('id'));

  account = signal<AccountDetailInfo | null>(null);
  loading = signal(true);
  loadError = signal<string | null>(null);
  actionLoading = signal(false);
  deleteError = signal('');

  isLocked = computed(() => this.account()?.status === 'LOCKED');
  isUnit = computed(() => this.account()?.roleCode === 'UNIT');

  lockDialogTitle = computed(() => (this.isLocked() ? 'Mở khoá tài khoản' : 'Khoá tài khoản'));
  lockDialogDescription = computed(() =>
    this.isLocked()
      ? 'Người dùng sẽ có thể đăng nhập lại sau khi mở khoá.'
      : 'Tài khoản bị khoá sẽ không thể đăng nhập cho đến khi được mở khoá.',
  );
  lockDialogConfirmLabel = computed(() => (this.isLocked() ? 'Mở khoá' : 'Khoá tài khoản'));
  lockDialogDestructive = computed(() => !this.isLocked());
  lockDialogTone = computed<ConfirmDialogTone>(() => (this.isLocked() ? 'primary' : 'warning'));

  lockOpen = signal(false);
  resetOpen = signal(false);

  ngOnInit() {
    this.loadAccount();
  }

  loadAccount() {
    this.loading.set(true);
    this.loadError.set(null);

    this.api
      .getById(this.accountId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          if (res.data) this.account.set(res.data);
          this.loading.set(false);
        },
        error: () => {
          this.loadError.set('Không thể tải thông tin tài khoản.');
          this.loading.set(false);
        },
      });
  }

  confirmToggleLock() {
    this.actionLoading.set(true);
    const call$ = this.isLocked() ? this.api.unlock(this.accountId) : this.api.lock(this.accountId);

    call$.subscribe({
      next: () => {
        this.actionLoading.set(false);
        this.lockOpen.set(false);
        this.loadAccount();
      },
      error: (err) => {
        this.actionLoading.set(false);
        this.deleteError.set(err.error.message);
      },
    });
  }

  onLockOpenChange(open: boolean) {
    this.lockOpen.set(open);
  }

  onResetModalOpenChange(open: boolean) {
    this.resetOpen.set(open);
    if (!open) this.loadAccount();
  }

  goToUnit() {
    const unitId = this.account()?.unitInfo?.unitId;
    if (unitId) this.router.navigate(['/management/units', unitId]);
  }
}
