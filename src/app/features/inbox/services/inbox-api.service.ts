import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Transaction, TransactionFilterParams } from '../models/transaction.model';
import { ApiResponse, PageData } from '../../../shared/models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class InboxApiService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/api/v1/transactions/inbox`;

  getList(filter: TransactionFilterParams): Observable<PageData<Transaction>> {
    let params = new HttpParams().set('page', filter.page).set('size', filter.size);

    if (filter.keyword?.trim()) params = params.set('keyword', filter.keyword.trim());
    if (filter.counterpartCode) params = params.set('counterpartCode', filter.counterpartCode);
    if (filter.status) params = params.set('status', filter.status);
    if (filter.from) params = params.set('from', filter.from);
    if (filter.to) params = params.set('to', filter.to);

    return this.http
      .get<ApiResponse<PageData<Transaction>>>(this.base, { params })
      .pipe(map((r) => r.data!));
  }

  getDetail(transactionCode: string): Observable<Transaction> {
    return this.http
      .get<ApiResponse<Transaction>>(`${this.base}/${transactionCode}`)
      .pipe(map((r) => r.data!));
  }

  accept(transactionCode: string, version: number): Observable<string> {
    return this.http
      .patch<
        ApiResponse<string>
      >(`${environment.apiUrl}/api/v1/transactions/inbox/${transactionCode}/accept`, { version })
      .pipe(map((r) => r.data!));
  }

  reject(transactionCode: string, version: number, reason: string): Observable<string> {
    return this.http
      .patch<
        ApiResponse<string>
      >(`${environment.apiUrl}/api/v1/transactions/inbox/${transactionCode}/reject`, { version, reason })
      .pipe(map((r) => r.data!));
  }
}
