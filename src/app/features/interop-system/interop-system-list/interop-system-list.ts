import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { InteropSystem, InteropSystemStatus } from '../models/interop-system.model';
import { InteropSystemApiService } from '../services/interop-system-api.service';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ConfirmDialog,
  ConfirmDialogTone,
} from '../../../shared/components/confirm-dialog/confirm-dialog';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header';
import { TooltipComponent } from '../../../shared/components/tooltip/tooltip';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge';
import { InteropSystemAdd } from '../interop-system-add/interop-system-add';
import { LocalDatePipe } from '../../../shared/pipes/local-date-pipe';

type StatusFilter = InteropSystemStatus | 'ALL';

@Component({
  selector: 'app-interop-system-list',
  standalone: true,
  imports: [
    PageHeaderComponent,
    ConfirmDialog,
    TooltipComponent,
    EmptyStateComponent,
    StatusBadgeComponent,
    InteropSystemAdd,
    LocalDatePipe,
  ],
  templateUrl: './interop-system-list.html',
  styleUrl: './interop-system-list.css',
})
export class InteropSystemList {
  private api = inject(InteropSystemApiService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  systems = signal<InteropSystem[]>([]);
  loading = signal(true);
  errorMessage = signal<string | null>(null);
  deleteError = signal('');

  searchTerm = signal('');
  statusFilter = signal<StatusFilter>('ALL');
  page = signal(0); // 0-based
  pageSize = signal(10);
  totalElements = signal(0);
  totalPages = signal(1);

  addOpen = signal(false);
  lockTarget = signal<InteropSystem | null>(null);
  deleteTarget = signal<InteropSystem | null>(null);
  actionLoading = signal(false);

  rangeStart = computed(() => (this.totalElements() === 0 ? 0 : this.page() * this.pageSize() + 1));
  rangeEnd = computed(() => Math.min((this.page() + 1) * this.pageSize(), this.totalElements()));
  pageNumbers = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i));

  lockDialogTitle = computed(() =>
    this.lockTarget()?.status === 'LOCKED' ? 'Mở khoá hệ thống' : 'Khoá hệ thống',
  );
  lockDialogDescription = computed(() => {
    const t = this.lockTarget();
    if (!t) return '';
    return t.status === 'LOCKED'
      ? `Mở khoá hệ thống "${t.name}"? Các đơn vị sẽ có thể thực hiện giao dịch trở lại.`
      : `Khoá hệ thống "${t.name}"? Các đơn vị thuộc hệ thống sẽ không thể thực hiện giao dịch.`;
  });
  lockDialogConfirmLabel = computed(() =>
    this.lockTarget()?.status === 'LOCKED' ? 'Mở khoá' : 'Khoá hệ thống',
  );
  lockDialogDestructive = computed(() => this.lockTarget()?.status !== 'LOCKED');
  lockDialogTone = computed<ConfirmDialogTone>(() =>
    this.lockTarget()?.status === 'LOCKED' ? 'primary' : 'warning',
  );

  deleteDialogDescription = computed(() => {
    const t = this.deleteTarget();
    return t ? `Bạn có chắc muốn xoá hệ thống "${t.name}"? Hành động này không thể hoàn tác.` : '';
  });

  private searchInput$ = new Subject<string>();

  private formatDate(iso: string): string {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
  }

  constructor() {
    this.searchInput$
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((term) => {
        this.searchTerm.set(term);
        this.page.set(0);
        this.loadData();
      });

    this.loadData();
  }

  onSearchInput(event: Event) {
    this.searchInput$.next((event.target as HTMLInputElement).value);
  }

  onStatusChange(event: Event) {
    this.statusFilter.set((event.target as HTMLSelectElement).value as StatusFilter);
    this.page.set(0);
    this.loadData();
  }

  refresh() {
    this.searchInput$.next('');
    this.statusFilter.set('ALL');
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

    this.api
      .getList({
        name: this.searchTerm(),
        status: this.statusFilter(),
        page: this.page(),
        size: this.pageSize(),
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          if (res.data) {
            this.systems.set(res.data.content);
            this.totalElements.set(res.data.page.totalElements);
            this.totalPages.set(res.data.page.totalPages);
          }
          this.loading.set(false);
        },
        error: () => {
          this.errorMessage.set('Không thể tải danh sách hệ thống liên thông.');
          this.loading.set(false);
        },
      });
  }

  openDetail(id: number) {
    this.router.navigate(['/management/systems', id]);
  }

  openAdd() {
    this.addOpen.set(true);
  }

  onCreated(sys: InteropSystem) {
    this.systems.set([sys, ...this.systems()]);
    this.totalElements.set(this.totalElements() + 1);
  }

  askToggleStatus(sys: InteropSystem) {
    this.lockTarget.set(sys);
  }

  confirmToggleStatus() {
    const target = this.lockTarget();
    if (!target) return;
    this.actionLoading.set(true);
    this.api.toggleStatus(target.id).subscribe({
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

  askDelete(sys: InteropSystem) {
    if (sys.unitCount > 0) return;
    this.deleteTarget.set(sys);
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
      error: (err) => {
        this.actionLoading.set(false);
        this.deleteError.set(err.error.message);
      },
    });
  }
}
