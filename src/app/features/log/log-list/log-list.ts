import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { RoleBadgeComponent } from '../../../shared/components/role-badge/role-badge';
import { ActionBadgeComponent } from '../../../shared/components/log-badges/action-badge/action-badge';
import { ResultBadgeComponent } from '../../../shared/components/log-badges/result-badge/result-badge';
import { LocalDatePipe } from '../../../shared/pipes/local-date-pipe';
import { LogDetailModal } from '../log-detail-modal/log-detail-modal';
import {
  ACTION_LABEL,
  AuditLog,
  AuditResult,
  DateRangePreset,
  TARGET_LABEL,
} from '../models/log.model';
import { LogApiService } from '../services/log-api.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

const PAGE_SIZE = 20;

@Component({
  selector: 'app-log-list',
  standalone: true,
  imports: [
    RoleBadgeComponent,
    ActionBadgeComponent,
    ResultBadgeComponent,
    LocalDatePipe,
    LogDetailModal,
  ],
  templateUrl: './log-list.html',
  styleUrl: './log-list.css',
})
export class LogList {
  private api = inject(LogApiService);
  private destroyRef = inject(DestroyRef);

  readonly ALL_ACTION_VALUE = 'ALL';

  readonly ALL_ACTIONS = [this.ALL_ACTION_VALUE, ...Object.keys(ACTION_LABEL)];
  readonly ACTION_LABEL = ACTION_LABEL;
  readonly TARGET_LABEL = TARGET_LABEL;

  logs = signal<AuditLog[]>([]);
  loading = signal(true);
  errorMessage = signal<string | null>(null);

  hasMore = signal(false);
  /** Stack cursor để navigate back. Mỗi entry là searchAfter của trang tương ứng. */
  cursorStack = signal<string[]>([]);
  /** cursor dùng cho request hiện tại (undefined = trang đầu) */
  currentCursor = signal<string | undefined>(undefined);
  /** cursor trả về từ response, dùng cho trang tiếp theo */
  nextCursor = signal<string | null>(null);

  hasPrev = computed(() => this.cursorStack().length > 0);

  dateRangePreset = signal<DateRangePreset>('today');
  actorEmailFilter = signal('');
  selectedActions = signal<Set<string>>(new Set());
  targetTypeFilter = signal('');
  resultFilter = signal<AuditResult | ''>('');

  actionsDropdownOpen = signal(false);
  selectedCount = computed(() => this.selectedActions().size);

  selectedLog = signal<AuditLog | null>(null);

  private emailSearch$ = new Subject<string>();

  constructor() {
    this.emailSearch$
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((email) => {
        this.actorEmailFilter.set(email);
        this.resetPagination();
        this.loadData();
      });

    this.loadData();
  }

  private resolveDateRange(): { dateFrom?: string; dateTo?: string } {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const toIso = (d: Date) => d.toISOString();

    switch (this.dateRangePreset()) {
      case 'today':
        return {
          dateFrom: new Date(today).toISOString(),
          dateTo: new Date(today.getTime() + 86399999).toISOString(),
        };
      case '7d': {
        const from = new Date(today);
        from.setDate(from.getDate() - 6);
        return { dateFrom: toIso(from), dateTo: toIso(new Date(today.getTime() + 86399999)) };
      }
      case '30d': {
        const from = new Date(today);
        from.setDate(from.getDate() - 29);
        return { dateFrom: toIso(from), dateTo: toIso(new Date(today.getTime() + 86399999)) };
      }
      default:
        return {};
    }
  }

  loadData() {
    this.loading.set(true);
    this.errorMessage.set(null);
    this.actionsDropdownOpen.set(false);

    const { dateFrom, dateTo } = this.resolveDateRange();
    const actions =
      this.selectedActions().size > 0 ? Array.from(this.selectedActions()) : undefined;

    this.api
      .getList({
        dateFrom,
        dateTo,
        actorEmail: this.actorEmailFilter() || undefined,
        targetType: this.targetTypeFilter() || undefined,
        result: this.resultFilter() || undefined,
        actions,
        searchAfter: this.currentCursor(),
        size: PAGE_SIZE,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.logs.set(data.items);
          this.nextCursor.set(data.nextCursor);
          this.hasMore.set(data.hasMore);
          this.loading.set(false);
        },
        error: () => {
          this.errorMessage.set('Không thể tải nhật ký hệ thống.');
          this.loading.set(false);
        },
      });
  }

  private resetPagination() {
    this.cursorStack.set([]);
    this.currentCursor.set(undefined);
    this.nextCursor.set(null);
  }

  goNext() {
    const next = this.nextCursor();
    if (!next || !this.hasMore()) return;
    this.cursorStack.update((stack) => [...stack, this.currentCursor() ?? '']);
    this.currentCursor.set(next);
    this.loadData();
  }

  goPrev() {
    const stack = this.cursorStack();
    if (stack.length === 0) return;
    const prev = stack[stack.length - 1];
    this.cursorStack.update((s) => s.slice(0, -1));
    this.currentCursor.set(prev === '' ? undefined : prev);
    this.loadData();
  }

  onEmailInput(event: Event) {
    this.emailSearch$.next((event.target as HTMLInputElement).value);
  }

  setDateRange(preset: DateRangePreset) {
    this.dateRangePreset.set(preset);
    this.resetPagination();
    this.loadData();
  }

  toggleAction(action: string) {
    this.selectedActions.update((set) => {
      // Chọn "Tất cả"
      if (action === this.ALL_ACTION_VALUE) {
        return new Set<string>();
      }

      const next = new Set(set);
      next.has(action) ? next.delete(action) : next.add(action);
      return next;
    });
    this.resetPagination();
    this.loadData();
  }

  onTargetTypeChange(event: Event) {
    this.targetTypeFilter.set((event.target as HTMLSelectElement).value);
    this.resetPagination();
    this.loadData();
  }

  onResultChange(event: Event) {
    this.resultFilter.set((event.target as HTMLSelectElement).value as AuditResult | '');
    this.resetPagination();
    this.loadData();
  }

  refresh() {
    this.resetPagination();
    this.loadData();
  }

  openDetail(log: AuditLog) {
    this.selectedLog.set(log);
  }

  onDetailOpenChange(open: boolean) {
    if (!open) this.selectedLog.set(null);
  }
}
