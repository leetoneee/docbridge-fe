import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse, PageData } from '../../../shared/models/api-response.model';
import { InteropUnit, InteropUnitQuery } from '../models/interop-unit.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InteropUnitApiService {
  private http = inject(HttpClient);

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
}
