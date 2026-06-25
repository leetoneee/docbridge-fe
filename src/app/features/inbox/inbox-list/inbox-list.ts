import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import {
  DateRangePreset,
  Transaction,
  TransactionFilterParams,
  TransactionStatus,
} from '../models/transaction.model';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header';
import { TooltipComponent } from '../../../shared/components/tooltip/tooltip';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge';
import { LocalDatePipe } from '../../../shared/pipes/local-date-pipe';
import { InboxApiService } from '../services/inbox-api.service';
import { InteropUnitApiService } from '../../interop-unit/services/interop-unit-api.service';
import { Router } from '@angular/router';
import { PageData } from '../../../shared/models/api-response.model';
import { UnitSummary } from '../../interop-unit/models/interop-unit.model';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

type StatusFilter = TransactionStatus | '';

@Component({
  selector: 'app-inbox-list',
  standalone: true,
  imports: [
    PageHeaderComponent,
    TooltipComponent,
    EmptyStateComponent,
    StatusBadgeComponent,
    LocalDatePipe,
  ],
  templateUrl: './inbox-list.html',
  styleUrl: './inbox-list.css',
})
export class InboxList {
  private api = inject(InboxApiService);
  private unitApi = inject(InteropUnitApiService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  // ── List state ──────────────────────────────────────────────
  pageData = signal<PageData<Transaction> | null>(null);
  loading = signal(true);
  errorMessage = signal<string | null>(null);
  senderUnits = signal<UnitSummary[]>([]);

  // ── Filter signals ───────────────────────────────────────────
  searchTerm = signal('');
  statusFilter = signal<StatusFilter>('');
  senderFilter = signal('');
  dateRangePreset = signal<DateRangePreset>('all');

  // ── Pagination signals ───────────────────────────────────────
  page = signal(0);
  pageSize = signal(10);

  // ── Computed ─────────────────────────────────────────────────
  totalElements = computed(() => this.pageData()?.page.totalElements ?? 0);
  totalPages = computed(() => this.pageData()?.page.totalPages ?? 1);
  pageNumbers = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i));
  rangeStart = computed(() => (this.totalElements() === 0 ? 0 : this.page() * this.pageSize() + 1));
  rangeEnd = computed(() => Math.min((this.page() + 1) * this.pageSize(), this.totalElements()));
  transactions = computed(() => this.pageData()?.content ?? []);

  isUnprocessed(tx: Transaction): boolean {
    return tx.status === 'SENT';
  }

  private searchInput$ = new Subject<string>();

  constructor() {
    // debounce search
    this.searchInput$
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((term) => {
        this.searchTerm.set(term);
        this.page.set(0);
        this.loadData();
      });

    this.loadData();
    this.loadSenderUnits();
  }

  // ── Helpers: tính from/to từ preset ─────────────────────────
  private resolveDateRange(preset: DateRangePreset): { from?: string; to?: string } {
    const now = new Date();

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const fmt = (d: Date) => {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    };

    switch (preset) {
      case 'today':
        return {
          from: `${fmt(today)}T00:00:00`,
          to: `${fmt(today)}T23:59:59.999`,
        };

      case '7d': {
        const from = new Date(today);
        from.setDate(from.getDate() - 6);

        return {
          from: `${fmt(from)}T00:00:00`,
          to: `${fmt(today)}T23:59:59.999`,
        };
      }

      case '30d': {
        const from = new Date(today);
        from.setDate(from.getDate() - 29);

        return {
          from: `${fmt(from)}T00:00:00`,
          to: `${fmt(today)}T23:59:59.999`,
        };
      }

      default:
        return {};
    }
  }

  // ── Data loading ─────────────────────────────────────────────
  loadData() {
    this.loading.set(true);
    this.errorMessage.set(null);

    const { from, to } = this.resolveDateRange(this.dateRangePreset());
    const params: TransactionFilterParams = {
      page: this.page(),
      size: this.pageSize(),
    };

    if (this.searchTerm().trim()) params.keyword = this.searchTerm().trim(); // 1 param duy nhất
    if (this.statusFilter()) params.status = this.statusFilter() as TransactionStatus;
    if (this.senderFilter()) params.counterpartCode = this.senderFilter(); // outbox
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
          this.errorMessage.set('...');
          this.loading.set(false);
        },
      });
  }

  loadSenderUnits() {
    this.unitApi
      .getAllUnits()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => this.senderUnits.set(res.data ?? []),
        error: () => {},
      });
  }

  // ── Event handlers ───────────────────────────────────────────
  onSearchInput(event: Event) {
    this.searchInput$.next((event.target as HTMLInputElement).value);
  }

  onStatusChange(event: Event) {
    this.statusFilter.set((event.target as HTMLSelectElement).value as StatusFilter);
    this.page.set(0);
    this.loadData();
  }

  onSenderChange(event: Event) {
    this.senderFilter.set((event.target as HTMLSelectElement).value);
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
    this.router.navigate(['/portal/inbox', transactionCode]);
  }
}
