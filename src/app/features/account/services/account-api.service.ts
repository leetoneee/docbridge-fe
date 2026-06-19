import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '../../../shared/models/api-response.model';
import { Observable } from 'rxjs';
import { AccountDetail, ResetAccountPasswordResult } from '../models/account.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AccountApiService {
  private http = inject(HttpClient);

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
