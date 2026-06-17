import { inject, Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { DashboardSummary, TimeRange } from '../models/dashboard.model';
import { ApiResponse } from '../../../shared/models/api-response.model';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { MOCK_DASHBOARD_SUMMARY } from './dashboard.mock';

@Injectable({
  providedIn: 'root',
})
export class DashboardApiService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/api/dashboard`;

  /**
   * Lấy dữ liệu tổng quan dashboard (KPI + chart + giao dịch gần đây)
   * BE: GET /api/dashboard/summary?range=7_DAYS
   *
   * TODO: BE chưa hoàn thiện — đang trả mock data.
   * Khi BE sẵn sàng, bỏ comment dòng http.get và xoá phần mock.
   */
  getSummary(range: TimeRange = '7_DAYS'): Observable<ApiResponse<DashboardSummary>> {
    // return this.http.get<ApiResponse<DashboardSummary>>(`${this.base}/summary`, {
    //   params: { range },
    // });

    // --- MOCK (tạm) ---
    return of({
      code: 'SUCCESS',
      message: 'OK',
      data: MOCK_DASHBOARD_SUMMARY,
    }).pipe(delay(300));
  }
}
