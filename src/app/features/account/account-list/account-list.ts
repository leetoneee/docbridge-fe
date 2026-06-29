import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { AccountDetail, AccountStatus } from '../models/account.model';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';
import {
  ConfirmDialog,
  ConfirmDialogTone,
} from '../../../shared/components/confirm-dialog/confirm-dialog';
import { TooltipComponent } from '../../../shared/components/tooltip/tooltip';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge';
import { RoleBadgeComponent } from '../../../shared/components/role-badge/role-badge';
import { LocalDatePipe } from '../../../shared/pipes/local-date-pipe';
import { AddOperatorModal } from '../add-operator-modal/add-operator-modal';
import { ResetPasswordModal } from '../../interop-unit/reset-password-modal/reset-password-modal';
import { AccountApiService } from '../services/account-api.service';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

type StatusFilter = AccountStatus | 'ALL';
type RoleFilter = 'ADMIN' | 'OPERATOR' | 'UNIT' | 'ALL';

@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [
    PageHeaderComponent,
    EmptyStateComponent,
    ConfirmDialog,
    TooltipComponent,
    StatusBadgeComponent,
    RoleBadgeComponent,
    LocalDatePipe,
    AddOperatorModal,
    ResetPasswordModal,
  ],
  templateUrl: './account-list.html',
  styleUrl: './account-list.css',
})
export class AccountList {
  private api = inject(AccountApiService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  accounts = signal<AccountDetail[]>([]);
  loading = signal(true);
  errorMessage = signal<string | null>(null);
  deleteError = signal('');

  emailFilter = signal('');
  roleFilter = signal<RoleFilter>('ALL');
  statusFilter = signal<StatusFilter>('ALL');
  page = signal(0);
  pageSize = signal(10);
  totalElements = signal(0);
  totalPages = signal(1);

  addOpen = signal(false);
  lockTarget = signal<AccountDetail | null>(null);
  resetTarget = signal<AccountDetail | null>(null);
  actionLoading = signal(false);

  rangeStart = computed(() => (this.totalElements() === 0 ? 0 : this.page() * this.pageSize() + 1));
  rangeEnd = computed(() => Math.min((this.page() + 1) * this.pageSize(), this.totalElements()));
  pageNumbers = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i));

  lockDialogTitle = computed(() =>
    this.lockTarget()?.status === 'LOCKED' ? 'Mở khoá tài khoản' : 'Khoá tài khoản',
  );
  lockDialogDescription = computed(() => {
    const t = this.lockTarget();
    if (!t) return '';
    return t.status === 'LOCKED'
      ? `Mở khoá cho ${t.email}? Người dùng sẽ đăng nhập lại được.`
      : `Khoá tài khoản ${t.email}? Tài khoản bị khoá sẽ không thể đăng nhập.`;
  });
  lockDialogConfirmLabel = computed(() =>
    this.lockTarget()?.status === 'LOCKED' ? 'Mở khoá' : 'Khoá tài khoản',
  );
  lockDialogDestructive = computed(() => this.lockTarget()?.status !== 'LOCKED');
  lockDialogTone = computed<ConfirmDialogTone>(() =>
    this.lockTarget()?.status === 'LOCKED' ? 'primary' : 'warning',
  );

  private emailSearch$ = new Subject<string>();

  constructor() {
    this.emailSearch$
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((email) => {
        this.emailFilter.set(email);
        this.page.set(0);
        this.loadData();
      });

    this.loadData();
  }

  onEmailInput(event: Event) {
    this.emailSearch$.next((event.target as HTMLInputElement).value);
  }

  onRoleChange(event: Event) {
    this.roleFilter.set((event.target as HTMLSelectElement).value as RoleFilter);
    this.page.set(0);
    this.loadData();
  }

  onStatusChange(event: Event) {
    this.statusFilter.set((event.target as HTMLSelectElement).value as StatusFilter);
    this.page.set(0);
    this.loadData();
  }

  refresh() {
    this.loadData();
  }

  goToPage(p: number) {
    if (p < 0 || p >= this.totalPages()) return;
    this.page.set(p);
    this.loadData();
  }

  loadData() {
    this.loading.set(true);
    this.errorMessage.set(null);

    const role = this.roleFilter();
    const status = this.statusFilter();

    this.api
      .getList({
        email: this.emailFilter(),
        role: role === 'ALL' ? undefined : role,
        status: status === 'ALL' ? undefined : status,
        page: this.page(),
        size: this.pageSize(),
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          if (res.data) {
            this.accounts.set(res.data.content);
            this.totalElements.set(res.data.page.totalElements);
            this.totalPages.set(res.data.page.totalPages);
          }
          this.loading.set(false);
        },
        error: () => {
          this.errorMessage.set('Không thể tải danh sách tài khoản.');
          this.loading.set(false);
        },
      });
  }

  openDetail(id: number) {
    this.router.navigate(['/management/accounts', id]);
  }

  askToggleLock(acc: AccountDetail) {
    this.lockTarget.set(acc);
  }

  confirmToggleLock() {
    const target = this.lockTarget();
    if (!target) return;
    this.actionLoading.set(true);

    const call$ =
      target.status === 'LOCKED' ? this.api.unlock(target.id) : this.api.lock(target.id);

    call$.subscribe({
      next: () => {
        this.actionLoading.set(false);
        this.lockTarget.set(null);
        this.loadData();
      },
      error: (err) => {
        this.actionLoading.set(false);
        this.deleteError.set(err.error.message);
      },
    });
  }

  onAddModalOpenChange(open: boolean) {
    this.addOpen.set(open);
    if (!open) this.loadData();
  }

  onResetModalOpenChange(open: boolean) {
    this.resetTarget.set(open ? this.resetTarget() : null);
    if (!open) this.loadData();
  }
}
