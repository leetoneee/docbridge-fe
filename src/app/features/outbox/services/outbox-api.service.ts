import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Transaction } from '../../inbox/models/transaction.model';
import { ApiResponse, PageData } from '../../../shared/models/api-response.model';
import { map, Observable } from 'rxjs';
import { CreateOutboxPayload, OutboxFilterParams } from '../models/outbox.model';

@Injectable({
  providedIn: 'root',
})
export class OutboxApiService {
    private http = inject(HttpClient);
  private base = `${environment.apiUrl}/api/v1/transactions/outbox`;

  getList(filter: OutboxFilterParams): Observable<PageData<Transaction>> {
    let params = new HttpParams()
      .set('page', filter.page)
      .set('size', filter.size);
    if (filter.documentCode)    params = params.set('documentCode', filter.documentCode);
    if (filter.title)           params = params.set('title', filter.title);
    if (filter.counterpartCode) params = params.set('counterpartCode', filter.counterpartCode);
    if (filter.status)          params = params.set('status', filter.status);
    if (filter.from)            params = params.set('from', filter.from);
    if (filter.to)              params = params.set('to', filter.to);

    return this.http
      .get<ApiResponse<PageData<Transaction>>>(this.base, { params })
      .pipe(map(r => r.data!));
  }

  getDetail(transactionCode: string): Observable<Transaction> {
    return this.http
      .get<ApiResponse<Transaction>>(`${this.base}/${transactionCode}`)
      .pipe(map(r => r.data!));
  }

  create(payload: CreateOutboxPayload): Observable<Transaction> {
    return this.http
      .post<ApiResponse<Transaction>>(this.base, payload)
      .pipe(map(r => r.data!));
  }

  cancel(transactionCode: string, version: number, reason: string): Observable<string> {
    return this.http
      .patch<ApiResponse<string>>(
        `${this.base}/${transactionCode}/cancel`,
        { version, reason }
      )
      .pipe(map(r => r.data!));
  }
}
