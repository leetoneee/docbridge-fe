import { inject, Injectable } from '@angular/core';
import { delay, map, Observable, of } from 'rxjs';
import { ApiResponse, PageData } from '../../../shared/models/api-response.model';
import { MOCK_INTEROP_SYSTEMS } from './interop-system.mock';
import { CreateInteropSystemPayload, InteropSystem, InteropSystemQuery } from '../models/interop-system.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InteropSystemApiService {
    private http = inject(HttpClient);

  getList(query: InteropSystemQuery): Observable<ApiResponse<PageData<InteropSystem>>> {
    const params: Record<string, string> = {
      page: String(query.page),
      size: String(query.size),
    };
    if (query.name.trim()) params['name'] = query.name.trim();
    if (query.status !== 'ALL') params['status'] = query.status;
    return this.http.get<ApiResponse<PageData<InteropSystem>>>(
      `${environment.apiUrl}/api/interop-systems`,
      { params }
    );
  }

  create(payload: CreateInteropSystemPayload): Observable<ApiResponse<InteropSystem>> {
    return this.http.post<ApiResponse<InteropSystem>>(
      `${environment.apiUrl}/api/interop-systems`,
      payload
    );
  }

  toggleStatus(id: number): Observable<ApiResponse<void>> {
    return this.http.patch<ApiResponse<void>>(
      `${environment.apiUrl}/api/interop-systems/${id}/lock`,
      {}
    );
  }

  remove(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${environment.apiUrl}/api/interop-systems/${id}`
    );
  }
}
