import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge';
import { InfoCardComponent } from '../../../shared/components/info-card/info-card/info-card';
import { InfoGridComponent } from '../../../shared/components/info-card/info-grid/info-grid';
import { InfoRowComponent } from '../../../shared/components/info-card/info-row/info-row';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';
import {
  ConfirmDialog,
  ConfirmDialogTone,
} from '../../../shared/components/confirm-dialog/confirm-dialog';
import { TabsComponent } from '../../../shared/components/tabs/tabs/tabs';
import { TabsListComponent } from '../../../shared/components/tabs/tabs-list/tabs-list';
import { TabsTriggerComponent } from '../../../shared/components/tabs/tabs-trigger/tabs-trigger';
import { TabsContentComponent } from '../../../shared/components/tabs/tabs-content/tabs-content';
import { LocalDatePipe } from '../../../shared/pipes/local-date-pipe';
import { ApproveUnitModal } from '../approve-unit-modal/approve-unit-modal';
import { RejectUnitModal } from '../reject-unit-modal/reject-unit-modal';
import { ResetPasswordModal } from '../reset-password-modal/reset-password-modal';
import { ActivatedRoute, Router } from '@angular/router';
import { InteropUnitApiService } from '../services/interop-unit-api.service';
import { AccountApiService } from '../../account/services/account-api.service';
import { InteropUnitDetailInfo } from '../models/interop-unit.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-interop-unit-detail',
  imports: [
    ReactiveFormsModule,
    PageHeaderComponent,
    StatusBadgeComponent,
    InfoCardComponent,
    InfoGridComponent,
    InfoRowComponent,
    EmptyStateComponent,
    ConfirmDialog,
    TabsComponent,
    TabsListComponent,
    TabsTriggerComponent,
    TabsContentComponent,
    LocalDatePipe,
    ApproveUnitModal,
    RejectUnitModal,
    ResetPasswordModal,
  ],
  templateUrl: './interop-unit-detail.html',
  styleUrl: './interop-unit-detail.css',
})
export class InteropUnitDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private unitApi = inject(InteropUnitApiService);
  private accountApi = inject(AccountApiService);
  private destroyRef = inject(DestroyRef);

  unitId = Number(this.route.snapshot.paramMap.get('id'));

  unit = signal<InteropUnitDetailInfo | null>(null);
  loading = signal(true);
  loadError = signal<string | null>(null);
  accountLockTarget = signal(false);

  accountLockDialogTitle = computed(() =>
    this.accountIsLocked() ? 'Mở khoá tài khoản' : 'Khoá tài khoản',
  );
  accountLockDialogDescription = computed(() => {
    const u = this.unit();
    if (!u) return '';
    return this.accountIsLocked()
      ? `Mở khoá tài khoản của đơn vị "${u.name}"? Đơn vị sẽ đăng nhập được trở lại.`
      : `Khoá tài khoản của đơn vị "${u.name}"? Đơn vị sẽ KHÔNG thể đăng nhập.`;
  });
  accountLockDialogConfirmLabel = computed(() =>
    this.accountIsLocked() ? 'Mở khoá' : 'Khoá tài khoản',
  );
  accountLockDialogDestructive = computed(() => !this.accountIsLocked());
  accountLockDialogTone = computed<ConfirmDialogTone>(() =>
    this.accountIsLocked() ? 'primary' : 'warning',
  );

  hasAccount = computed(() => {
    const s = this.unit()?.status;
    return s === 'ACTIVE' || s === 'LOCKED';
  });

  accountIsLocked = computed(() => this.unit()?.unitAccount?.status === 'LOCKED');

  editForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(255)]],
    description: ['', [Validators.maxLength(1000)]],
    representativeName: ['', [Validators.required, Validators.maxLength(255)]],
    representativePhone: ['', [Validators.required, Validators.pattern(/^(0|\+84)[0-9]{9,10}$/)]],
  });
  saving = signal(false);
  saveError = signal<string | null>(null);

  approveOpen = signal(false);
  rejectOpen = signal(false);
  resetPasswordOpen = signal(false);
  lockTarget = signal(false);
  deleteTarget = signal(false);
  actionLoading = signal(false);
  actionError = signal<string | null>(null);

  lockDialogTitle = computed(() =>
    this.unit()?.status === 'LOCKED' ? 'Mở khoá đơn vị' : 'Khoá đơn vị',
  );
  lockDialogDescription = computed(() => {
    const u = this.unit();
    if (!u) return '';
    return u.status === 'LOCKED'
      ? `Mở khoá đơn vị "${u.name}"? Đơn vị có thể thực hiện giao dịch trở lại.`
      : `Khoá đơn vị "${u.name}"? Đơn vị sẽ không thể thực hiện giao dịch.`;
  });
  lockDialogConfirmLabel = computed(() =>
    this.unit()?.status === 'LOCKED' ? 'Mở khoá' : 'Khoá đơn vị',
  );
  lockDialogDestructive = computed(() => this.unit()?.status !== 'LOCKED');
  lockDialogTone = computed<ConfirmDialogTone>(() =>
    this.unit()?.status === 'LOCKED' ? 'primary' : 'warning',
  );

  deleteDialogDescription = computed(() => {
    const u = this.unit();
    return u ? `Bạn có chắc muốn xoá đơn vị "${u.name}"? Hành động này không thể hoàn tác.` : '';
  });

  ngOnInit() {
    this.loadUnit();
  }

  loadUnit() {
    this.loading.set(true);
    this.loadError.set(null);

    this.unitApi
      .getById(this.unitId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          if (res.data) {
            this.unit.set(res.data);
            this.editForm.setValue({
              name: res.data.name,
              description: res.data.description,
              representativeName: res.data.representativeName,
              representativePhone: res.data.representativePhone,
            });
          }
          this.loading.set(false);
        },
        error: () => {
          this.loadError.set('Không thể tải thông tin đơn vị liên thông.');
          this.loading.set(false);
        },
      });
  }

  cancelEdit() {
    const u = this.unit();
    if (!u) return;
    this.editForm.setValue({
      name: u.name,
      description: u.description,
      representativeName: u.representativeName,
      representativePhone: u.representativePhone,
    });
    this.saveError.set(null);
  }

  saveEdit() {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.saveError.set(null);

    const raw = this.editForm.getRawValue();

    this.unitApi
      .update(this.unitId, {
        name: raw.name.trim(),
        description: raw.description.trim(),
        representativeName: raw.representativeName.trim(),
        representativePhone: raw.representativePhone.trim(),
      })
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.loadUnit(); // PUT trả response rút gọn -> gọi lại GET cho chắc
        },
        error: (err) => {
          this.saving.set(false);
          this.saveError.set(err?.error?.message ?? 'Không thể lưu thay đổi. Vui lòng thử lại.');
        },
      });
  }

  askToggleLock() {
    this.lockTarget.set(true);
  }

  confirmToggleLock() {
    this.actionLoading.set(true);
    this.actionError.set(null);
    this.unitApi.toggleLock(this.unitId).subscribe({
      next: () => {
        this.actionLoading.set(false);
        this.lockTarget.set(false);
        this.loadUnit();
      },
      error: (err) => {
        this.actionLoading.set(false);
        this.actionError.set(err?.error?.message ?? 'Không thể thực hiện. Vui lòng thử lại.');
      },
    });
  }

  askToggleAccountLock() {
    this.accountLockTarget.set(true);
  }

  confirmToggleAccountLock() {
    const accountId = this.unit()?.unitAccount?.accountId;
    if (!accountId) return;

    this.actionLoading.set(true);
    this.actionError.set(null);

    const call$ = this.accountIsLocked()
      ? this.accountApi.unlock(accountId)
      : this.accountApi.lock(accountId);

    call$.subscribe({
      next: () => {
        this.actionLoading.set(false);
        this.accountLockTarget.set(false);
        this.loadUnit();
      },
      error: (err) => {
        this.actionLoading.set(false);
        this.actionError.set(err?.error?.message ?? 'Không thể thực hiện. Vui lòng thử lại.');
      },
    });
  }

  askDelete() {
    this.deleteTarget.set(true);
  }

  confirmDelete() {
    this.actionLoading.set(true);
    this.actionError.set(null);
    this.unitApi.remove(this.unitId).subscribe({
      next: () => {
        this.actionLoading.set(false);
        this.deleteTarget.set(false);
        this.router.navigate(['/management/units']);
      },
      error: (err) => {
        this.actionLoading.set(false);
        this.deleteTarget.set(false);
        // VD lỗi từ BE: "Không thể xoá đơn vị có giao dịch"
        this.actionError.set(err?.error?.message ?? 'Không thể xoá đơn vị. Vui lòng thử lại.');
      },
    });
  }

  onApproveModalOpenChange(open: boolean) {
    this.approveOpen.set(open);
    if (!open) {
      this.loadUnit(); // chỉ reload sau khi modal đã đóng — tránh huỷ modal khi đang hiện tempPassword
    }
  }

  onRejected() {
    this.loadUnit();
  }
}
