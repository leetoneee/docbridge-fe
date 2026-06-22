import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse, PageData } from '../../../shared/models/api-response.model';
import {
  ApproveInteropUnitResult,
  ChangeUnitEmailPayload,
  CreateInteropUnitPayload,
  InteropUnit,
  InteropUnitDetailInfo as InteropUnitDetail,
  InteropUnitQuery,
  RejectInteropUnitPayload,
  UpdateInteropUnitPayload,
} from '../models/interop-unit.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InteropUnitApiService {
  private http = inject(HttpClient);
  baseUrl =`${environment.apiUrl}/api/v1`

  create(payload: CreateInteropUnitPayload): Observable<ApiResponse<InteropUnit>> {
    return this.http.post<ApiResponse<InteropUnit>>(`${this.baseUrl}/units`, payload);
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

    return this.http.get<ApiResponse<PageData<InteropUnit>>>(`${this.baseUrl}/units`, {
      params,
    });
  }

  getById(id: number): Observable<ApiResponse<InteropUnitDetail>> {
    return this.http.get<ApiResponse<InteropUnitDetail>>(`${this.baseUrl}/units/${id}`);
  }

  update(id: number, payload: UpdateInteropUnitPayload): Observable<ApiResponse<InteropUnit>> {
    return this.http.put<ApiResponse<InteropUnit>>(
      `${this.baseUrl}/units/${id}`,
      payload,
    );
  }

  /** (Admin only, tách riêng khỏi update() thông thường) */
  changeEmail(id: number, payload: ChangeUnitEmailPayload): Observable<ApiResponse<InteropUnit>> {
    return this.http.patch<ApiResponse<InteropUnit>>(
      `${this.baseUrl}/units/${id}/email`,
      payload,
    );
  }

  toggleLock(id: number): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(
      `${this.baseUrl}/units/${id}/toggle-lock`,
      {},
    );
  }

  remove(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/units/${id}`);
  }

  approve(id: number): Observable<ApiResponse<ApproveInteropUnitResult>> {
    return this.http.post<ApiResponse<ApproveInteropUnitResult>>(
      `${this.baseUrl}/units/${id}/approve`,
      {},
    );
  }

  reject(id: number, payload: RejectInteropUnitPayload): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(
      `${this.baseUrl}/units/${id}/reject`,
      payload,
    );
  }
}
