import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse, PageData } from '../../../shared/models/api-response.model';
import {
  CreateInteropUnitPayload,
  InteropUnit,
  InteropUnitQuery,
} from '../models/interop-unit.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InteropUnitApiService {
  private http = inject(HttpClient);

  create(payload: CreateInteropUnitPayload): Observable<ApiResponse<InteropUnit>> {
    return this.http.post<ApiResponse<InteropUnit>>(`${environment.apiUrl}/api/units`, payload);
  }

  getList(query: InteropUnitQuery): Observable<ApiResponse<PageData<InteropUnit>>> {
    const params: Record<string, string> = {
      page: String(query.page),
      size: String(query.size),
    };

    if (query.systemId !== undefined) {
      params['systemId'] = String(query.systemId);
    }

    if (query.status && query.status !== 'ALL') {
      params['status'] = query.status;
    }

    if (query.keyword?.trim()) {
      params['keyword'] = query.keyword.trim();
    }

    return this.http.get<ApiResponse<PageData<InteropUnit>>>(`${environment.apiUrl}/api/units`, {
      params,
    });
  }

  toggleLock(id: number): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(
      `${environment.apiUrl}/api/units/${id}/toggle-lock`,
      {},
    );
  }

  remove(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${environment.apiUrl}/api/units/${id}`);
  }
}
