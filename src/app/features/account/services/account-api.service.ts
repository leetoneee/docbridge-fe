import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse, PageData } from '../../../shared/models/api-response.model';
import { Observable } from 'rxjs';
import {
  AccountDetail,
  AccountQuery,
  CreateOperatorPayload,
  CreateOperatorResult,
  ResetAccountPasswordResult,
} from '../models/account.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AccountApiService {
  private http = inject(HttpClient);

  getList(query: AccountQuery): Observable<ApiResponse<PageData<AccountDetail>>> {
    let params = new HttpParams().set('page', String(query.page)).set('size', String(query.size));

    if (query.role) params = params.set('role', query.role);
    if (query.status) params = params.set('status', query.status);
    if (query.email?.trim()) params = params.set('email', query.email.trim());

    return this.http.get<ApiResponse<PageData<AccountDetail>>>(
      `${environment.apiUrl}/api/v1/accounts`,
      { params },
    );
  }

  getById(id: number): Observable<ApiResponse<AccountDetail>> {
    return this.http.get<ApiResponse<AccountDetail>>(`${environment.apiUrl}/api/v1/accounts/${id}`);
  }

  createOperator(payload: CreateOperatorPayload): Observable<ApiResponse<CreateOperatorResult>> {
    return this.http.post<ApiResponse<CreateOperatorResult>>(
      `${environment.apiUrl}/api/v1/accounts/operators`,
      payload,
    );
  }

  resetPassword(accountId: number): Observable<ApiResponse<ResetAccountPasswordResult>> {
    return this.http.put<ApiResponse<ResetAccountPasswordResult>>(
      `${environment.apiUrl}/api/v1/accounts/${accountId}/reset-password`,
      {},
    );
  }

  lock(accountId: number): Observable<ApiResponse<AccountDetail>> {
    return this.http.put<ApiResponse<AccountDetail>>(
      `${environment.apiUrl}/api/v1/accounts/${accountId}/lock`,
      {},
    );
  }

  unlock(accountId: number): Observable<ApiResponse<AccountDetail>> {
    return this.http.put<ApiResponse<AccountDetail>>(
      `${environment.apiUrl}/api/v1/accounts/${accountId}/unlock`,
      {},
    );
  }
}
