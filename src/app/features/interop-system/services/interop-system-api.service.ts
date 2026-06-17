import { inject, Injectable } from '@angular/core';
import { delay, map, Observable, of } from 'rxjs';
import { ApiResponse, PageData } from '../../../shared/models/api-response.model';
import { MOCK_INTEROP_SYSTEMS } from './interop-system.mock';
import { InteropSystem, InteropSystemQuery } from '../models/interop-system.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InteropSystemApiService {
    private http = inject(HttpClient);

  getList(query: InteropSystemQuery): Observable<ApiResponse<PageData<InteropSystem>>> {
    // Endpoint thật (uncomment khi BE xong, đổi mock bên dưới thành return này):
    // const params: Record<string, string> = {
    //   page: String(query.page),
    //   size: String(query.size),
    // };
    // if (query.search.trim()) params['search'] = query.search.trim();
    // if (query.status !== 'ALL') params['status'] = query.status;
    // return this.http.get<ApiResponse<PageData<InteropSystem>>>(
    //   `${environment.apiUrl}/api/interop-systems`,
    //   { params }
    // );

    return of(MOCK_INTEROP_SYSTEMS).pipe(
      delay(400),
      map((all) => {
        let filtered = all;
        if (query.search.trim()) {
          const term = query.search.trim().toLowerCase();
          filtered = filtered.filter(
            (s) => s.name.toLowerCase().includes(term) || s.code.toLowerCase().includes(term)
          );
        }
        if (query.status !== 'ALL') {
          filtered = filtered.filter((s) => s.status === query.status);
        }

        const totalElements = filtered.length;
        const totalPages = Math.max(1, Math.ceil(totalElements / query.size));
        const start = query.page * query.size;
        const content = filtered.slice(start, start + query.size);

        return {
          code: 'SUCCESS',
          message: 'OK',
          data: {
            content,
            page: { page: query.page, size: query.size, totalElements, totalPages },
          },
        };
      })
    );
  }

  toggleStatus(id: string): Observable<ApiResponse<void>> {
    // Endpoint thật:
    // return this.http.patch<ApiResponse<void>>(
    //   `${environment.apiUrl}/api/interop-systems/${id}/toggle-status`,
    //   {}
    // );

    return of({ code: 'SUCCESS', message: 'OK', data: null }).pipe(delay(300));
  }

  remove(id: string): Observable<ApiResponse<void>> {
    // Endpoint thật:
    // return this.http.delete<ApiResponse<void>>(
    //   `${environment.apiUrl}/api/interop-systems/${id}`
    // );

    return of({ code: 'SUCCESS', message: 'OK', data: null }).pipe(delay(300));
  }
}
