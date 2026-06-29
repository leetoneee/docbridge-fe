import { NgClass } from '@angular/common';
import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';
import {
  ConfirmDialog,
  ConfirmDialogTone,
} from '../../../shared/components/confirm-dialog/confirm-dialog';
import { TooltipComponent } from '../../../shared/components/tooltip/tooltip';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge';
import { LocalDatePipe } from '../../../shared/pipes/local-date-pipe';
import { InteropUnitApiService } from '../services/interop-unit-api.service';
import { InteropSystemApiService } from '../../interop-system/services/interop-system-api.service';
import { Router } from '@angular/router';
import { InteropUnit, InteropUnitStatus } from '../models/interop-unit.model';
import { InteropSystemSummary } from '../../interop-system/models/interop-system.model';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InteropUnitAdd } from '../interop-unit-add/interop-unit-add';

type StatusFilter = InteropUnitStatus | 'ALL';
type SystemFilter = number | 'ALL';

@Component({
  selector: 'app-interop-unit-list',
  standalone: true,
  imports: [
    NgClass,
    InteropUnitAdd,
    PageHeaderComponent,
    EmptyStateComponent,
    ConfirmDialog,
    TooltipComponent,
    StatusBadgeComponent,
    LocalDatePipe,
  ],
  templateUrl: './interop-unit-list.html',
  styleUrl: './interop-unit-list.css',
})
export class InteropUnitList {
  private api = inject(InteropUnitApiService);
  private systemApi = inject(InteropSystemApiService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  units = signal<InteropUnit[]>([]);
  loading = signal(true);
  errorMessage = signal<string | null>(null);

  systemOptions = signal<InteropSystemSummary[]>([]);

  searchTerm = signal('');
  systemFilter = signal<SystemFilter>('ALL');
  statusFilter = signal<StatusFilter>('ALL');
  page = signal(0);
  pageSize = signal(10);
  totalElements = signal(0);
  totalPages = signal(1);

  addOpen = signal(false);
  lockTarget = signal<InteropUnit | null>(null);
  deleteTarget = signal<InteropUnit | null>(null);
  actionLoading = signal(false);

  rangeStart = computed(() => (this.totalElements() === 0 ? 0 : this.page() * this.pageSize() + 1));
  rangeEnd = computed(() => Math.min((this.page() + 1) * this.pageSize(), this.totalElements()));
  pageNumbers = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i));
  activeSystemOptions = computed(() => this.systemOptions().filter((s) => s.status === 'ACTIVE'));

  lockDialogTitle = computed(() =>
    this.lockTarget()?.status === 'LOCKED' ? 'Mở khoá đơn vị' : 'Khoá đơn vị',
  );
  lockDialogDescription = computed(() => {
    const t = this.lockTarget();
    if (!t) return '';
    return t.status === 'LOCKED'
      ? `Mở khoá đơn vị "${t.name}"? Đơn vị có thể thực hiện giao dịch trở lại.`
      : `Khoá đơn vị "${t.name}"? Đơn vị sẽ không thể thực hiện giao dịch.`;
  });
  lockDialogConfirmLabel = computed(() =>
    this.lockTarget()?.status === 'LOCKED' ? 'Mở khoá' : 'Khoá đơn vị',
  );
  lockDialogDestructive = computed(() => this.lockTarget()?.status !== 'LOCKED');
  lockDialogTone = computed<ConfirmDialogTone>(() =>
    this.lockTarget()?.status === 'LOCKED' ? 'primary' : 'warning',
  );

  deleteDialogDescription = computed(() => {
    const t = this.deleteTarget();
    return t ? `Bạn có chắc muốn xoá đơn vị "${t.name}"? Hành động này không thể hoàn tác.` : '';
  });

  private searchInput$ = new Subject<string>();

  constructor() {
    this.searchInput$
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((term) => {
        this.searchTerm.set(term);
        this.page.set(0);
        this.loadData();
      });

    this.loadSystemOptions();
    this.loadData();
  }

  loadSystemOptions() {
    this.systemApi
      .getAllSummary()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          if (res.data) this.systemOptions.set(res.data);
        },
        error: () => {
          // không chặn trang nếu lấy danh sách hệ thống lỗi - dropdown chỉ còn "Tất cả hệ thống"
        },
      });
  }

  onCreated(unit: InteropUnit) {
    this.units.set([unit, ...this.units()]);
    this.totalElements.set(this.totalElements() + 1);
  }

  onSearchInput(event: Event) {
    this.searchInput$.next((event.target as HTMLInputElement).value);
  }

  onSystemFilterChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.systemFilter.set(value === 'ALL' ? 'ALL' : Number(value));
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

    const systemId = this.systemFilter();
    const status = this.statusFilter();

    this.api
      .getList({
        systemId: systemId === 'ALL' ? undefined : systemId,
        status: status === 'ALL' ? 'ALL' : status,
        keyword: this.searchTerm(),
        page: this.page(),
        size: this.pageSize(),
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          if (res.data) {
            this.units.set(res.data.content);
            this.totalElements.set(res.data.page.totalElements);
            this.totalPages.set(res.data.page.totalPages);
          }
          this.loading.set(false);
        },
        error: () => {
          this.errorMessage.set('Không thể tải danh sách đơn vị liên thông.');
          this.loading.set(false);
        },
      });
  }

  openDetail(id: number) {
    this.router.navigate(['/management/units', id]);
  }

  openAdd() {
    this.addOpen.set(true);
  }

  askToggleLock(unit: InteropUnit) {
    if (unit.status === 'PENDING' || unit.status === 'REJECTED') return;
    this.lockTarget.set(unit);
  }

  confirmToggleLock() {
    const target = this.lockTarget();
    if (!target) return;
    this.actionLoading.set(true);
    this.api.toggleLock(target.id).subscribe({
      next: () => {
        this.actionLoading.set(false);
        this.lockTarget.set(null);
        this.loadData();
      },
      error: () => this.actionLoading.set(false),
    });
  }

  askDelete(unit: InteropUnit) {
    this.deleteTarget.set(unit);
  }

  confirmDelete() {
    const target = this.deleteTarget();
    if (!target) return;
    this.actionLoading.set(true);
    this.api.remove(target.id).subscribe({
      next: () => {
        this.actionLoading.set(false);
        this.deleteTarget.set(null);
        this.loadData();
      },
      error: () => this.actionLoading.set(false),
    });
  }
}
