import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header';
import { TooltipComponent } from '../../../shared/components/tooltip/tooltip';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge';
import { CreateOutboxModal } from '../create-outbox-modal/create-outbox-modal';
import { LocalDatePipe } from '../../../shared/pipes/local-date-pipe';
import { PageData } from '../../../shared/models/api-response.model';
import { DateRangePreset, Transaction } from '../../inbox/models/transaction.model';
import { OutboxApiService } from '../services/outbox-api.service';
import { InteropUnitApiService } from '../../interop-unit/services/interop-unit-api.service';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OutboxFilterParams } from '../models/outbox.model';
import { UnitSummary } from '../../interop-unit/models/interop-unit.model';

@Component({
  selector: 'app-outbox-list',
  standalone: true,
  imports: [
    PageHeaderComponent,
    TooltipComponent,
    EmptyStateComponent,
    StatusBadgeComponent,
    CreateOutboxModal,
    LocalDatePipe,
  ],
  templateUrl: './outbox-list.html',
  styleUrl: './outbox-list.css',
})
export class OutboxList {
  private api = inject(OutboxApiService);
  private unitApi = inject(InteropUnitApiService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  // ── List state ───────────────────────────────────────────────
  pageData = signal<PageData<Transaction> | null>(null);
  loading = signal(true);
  errorMessage = signal<string | null>(null);
  receiverUnits = signal<UnitSummary[]>([]);

  // ── Filter signals ───────────────────────────────────────────
  searchTerm = signal('');
  statusFilter = signal('');
  receiverFilter = signal('');
  dateRangePreset = signal<DateRangePreset>('all');

  // ── Pagination ───────────────────────────────────────────────
  page = signal(0);
  pageSize = signal(10);

  // ── Modal ────────────────────────────────────────────────────
  createOpen = signal(false);

  // ── Computed ─────────────────────────────────────────────────
  totalElements = computed(() => this.pageData()?.page.totalElements ?? 0);
  totalPages = computed(() => this.pageData()?.page.totalPages ?? 1);
  pageNumbers = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i));
  rangeStart = computed(() => (this.totalElements() === 0 ? 0 : this.page() * this.pageSize() + 1));
  rangeEnd = computed(() => Math.min((this.page() + 1) * this.pageSize(), this.totalElements()));
  transactions = computed(() => this.pageData()?.content ?? []);

  private searchInput$ = new Subject<string>();

  constructor() {
    this.searchInput$
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((term) => {
        this.searchTerm.set(term);
        this.page.set(0);
        this.loadData();
      });

    this.loadData();
    this.loadReceiverUnits();
  }

  private resolveDateRange(preset: DateRangePreset): { from?: string; to?: string } {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const fmt = (d: Date) => d.toISOString().split('T')[0];
    switch (preset) {
      case 'today':
        return { from: `${fmt(today)}T00:00:00`, to: `${fmt(today)}T23:59:59` };
      case '7d': {
        const from = new Date(today);
        from.setDate(from.getDate() - 6);
        return { from: `${fmt(from)}T00:00:00`, to: `${fmt(today)}T23:59:59` };
      }
      case '30d': {
        const from = new Date(today);
        from.setDate(from.getDate() - 29);
        return { from: `${fmt(from)}T00:00:00`, to: `${fmt(today)}T23:59:59` };
      }
      default:
        return {};
    }
  }

  loadData() {
    this.loading.set(true);
    this.errorMessage.set(null);

    const { from, to } = this.resolveDateRange(this.dateRangePreset());
    const params: OutboxFilterParams = { page: this.page(), size: this.pageSize() };
    if (this.searchTerm()) {
      params.documentCode = this.searchTerm();
      params.title = this.searchTerm();
    }
    if (this.statusFilter()) params.status = this.statusFilter();
    if (this.receiverFilter()) params.counterpartCode = this.receiverFilter();
    if (from) params.from = from;
    if (to) params.to = to;

    this.api
      .getList(params)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.pageData.set(data);
          this.loading.set(false);
        },
        error: () => {
          this.errorMessage.set('Không thể tải danh sách văn bản đã gửi.');
          this.loading.set(false);
        },
      });
  }

  loadReceiverUnits() {
    this.unitApi
      .getAllUnits()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => this.receiverUnits.set(res.data ?? []),
        error: () => {},
      });
  }

  onSearchInput(event: Event) {
    this.searchInput$.next((event.target as HTMLInputElement).value);
  }

  onStatusChange(event: Event) {
    this.statusFilter.set((event.target as HTMLSelectElement).value);
    this.page.set(0);
    this.loadData();
  }

  onReceiverChange(event: Event) {
    this.receiverFilter.set((event.target as HTMLSelectElement).value);
    this.page.set(0);
    this.loadData();
  }

  onRangeChange(event: Event) {
    this.dateRangePreset.set((event.target as HTMLSelectElement).value as DateRangePreset);
    this.page.set(0);
    this.loadData();
  }

  refresh() {
    this.page.set(0);
    this.loadData();
  }

  goToPage(p: number) {
    if (p < 0 || p >= this.totalPages()) return;
    this.page.set(p);
    this.loadData();
  }

  goToDetail(transactionCode: string) {
    this.router.navigate(['/portal/outbox', transactionCode]);
  }

  onCreateModalOpenChange(isOpen: boolean) {
    this.createOpen.set(isOpen);
    if (!isOpen) this.loadData(); // reload sau khi modal đóng — đúng pattern
  }
}
