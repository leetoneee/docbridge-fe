import { inject, Injectable } from '@angular/core';
import { delay, map, Observable, of } from 'rxjs';
import { DashboardSummary, RecentTransaction, TimeRange, TransactionStatsResponse } from '../models/dashboard.model';
import { ApiResponse } from '../../../shared/models/api-response.model';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { MOCK_DASHBOARD_SUMMARY } from './dashboard.mock';

// Tính dateFrom / dateTo từ TimeRange
function buildDateRange(range: TimeRange): { dateFrom: string; dateTo: string } {
  const to   = new Date();
  const from = new Date();
  const days = range === '7_DAYS' ? 7 : range === '30_DAYS' ? 30 : 90;
  from.setDate(to.getDate() - (days - 1));
 
  const fmt = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
 
  return { dateFrom: fmt(from), dateTo: fmt(to) };
}
 
// Chuyển ISO datetime → label tương đối ("10 phút trước", ...)
function toRelativeTime(isoString: string): string {
  const diffMs  = Date.now() - new Date(isoString).getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1)  return 'Vừa xong';
  if (diffMin < 60) return `${diffMin} phút trước`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr  < 24) return `${diffHr} giờ trước`;
  return `${Math.floor(diffHr / 24)} ngày trước`;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardApiService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/api/v1/stats/transactions`;

  /**
   * Lấy dữ liệu tổng quan dashboard (KPI + chart + giao dịch gần đây)
   * BE: GET /api/dashboard/summary?range=7_DAYS
   */
  getSummary(range: TimeRange = '7_DAYS'): Observable<ApiResponse<DashboardSummary>> {
    const { dateFrom, dateTo } = buildDateRange(range);
 
    return this.http
      .get<ApiResponse<TransactionStatsResponse>>(this.base, {
        params: { dateFrom, dateTo, groupBy: 'day' },
      })
      .pipe(
        map((res) => ({
          code:    res.code,
          message: res.message,
          data:    res.data ? this.mapToDashboard(res.data) : null,
        }))
      );
  }
 
  // ── Mapper: TransactionStatsResponse → DashboardSummary ──────────────────
 
  private mapToDashboard(stats: TransactionStatsResponse): DashboardSummary {
    return {
      kpi: {
        totalTransactions:   stats.overview.total,
        pendingTransactions: stats.overview.sent,        // SENT = đang chờ phản hồi
        totalActiveUnits:    stats.overview.totalActiveUnits,
        pendingUnits:        stats.overview.pendingUnits,
      },
      txOverTime: stats.timeline.map((p) => ({
        date:  p.period,
        value: p.count,
      })),
      txBySystem: stats.bySystem.map((s) => ({
        system: s.systemCode,
        value:  s.count,
      })),
      recentTransactions: stats.recentTransactions.map(
        (t): RecentTransaction => ({
          code:   t.transactionCode,
          from:   t.fromUnit,
          to:     t.toUnit,
          status: t.status,
          time:   toRelativeTime(t.createdAt),
        })
      ),
    };
  }
}
