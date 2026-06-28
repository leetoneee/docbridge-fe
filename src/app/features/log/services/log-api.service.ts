import { inject, Injectable } from '@angular/core';
import { AuditLog, AuditLogFilter, AuditLogPage } from '../models/log.model';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../../../shared/models/api-response.model';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LogApiService {
  private http = inject(HttpClient);
  baseUrl = `${environment.apiUrl}/api/v1`;

  /** GET /api/v1/logs (Elasticsearch cursor-based pagination) */
  getList(filter: AuditLogFilter): Observable<AuditLogPage> {
    let params = new HttpParams().set('size', String(filter.size));

    if (filter.dateFrom) params = params.set('dateFrom', filter.dateFrom);
    if (filter.dateTo) params = params.set('dateTo', filter.dateTo);
    if (filter.actorEmail?.trim()) params = params.set('actorEmail', filter.actorEmail.trim());
    if (filter.targetType) params = params.set('targetType', filter.targetType);
    if (filter.result) params = params.set('result', filter.result);
    if (filter.searchAfter) params = params.set('searchAfter', filter.searchAfter);
    if (filter.actions?.length) params = params.set('actions', filter.actions.join(','));

    return this.http
      .get<ApiResponse<AuditLogPage>>(`${this.baseUrl}/logs`, { params })
      .pipe(map((res) => res.data!));
  }

  /** API thật — GET /api/v1/logs/{id} */
  getById(id: string): Observable<AuditLog> {
    return this.http
      .get<ApiResponse<AuditLog>>(`${this.baseUrl}/logs/${id}`)
      .pipe(map((res) => res.data!));
  }
}
