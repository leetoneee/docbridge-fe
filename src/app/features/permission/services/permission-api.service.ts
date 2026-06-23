import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../shared/models/api-response.model';
import { PermissionItem, RoleDetail, RoleSummary } from '../models/permission.model';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PermissionApiService {
  private http = inject(HttpClient);
  baseUrl = `${environment.apiUrl}/api/v1`;

  /** API thật — GET /api/v1/roles */
  getRoles(): Observable<ApiResponse<RoleSummary[]>> {
    return this.http.get<ApiResponse<RoleSummary[]>>(`${this.baseUrl}/roles`);
  }

  /** GET /api/v1/roles/{id} */
  getRoleById(id: number): Observable<ApiResponse<RoleDetail>> {
    return this.http.get<ApiResponse<RoleDetail>>(`${this.baseUrl}/roles/${id}`);
  }

  /** GET /api/v1/permissions (flat list, dùng khi cần) */
  getAllPermissions(): Observable<ApiResponse<PermissionItem[]>> {
    return this.http.get<ApiResponse<PermissionItem[]>>(`${this.baseUrl}/permissions`);
  }

  /**
   * POST /api/v1/roles/{id}/permissions/{permissionId}
   * Response trả về RoleDetail mới nhất — update signal trực tiếp, không cần reload
   */
  assignPermission(roleId: number, permissionId: number): Observable<ApiResponse<RoleDetail>> {
    return this.http.post<ApiResponse<RoleDetail>>(
      `${this.baseUrl}/roles/${roleId}/permissions/${permissionId}`,
      {},
    );
  }

  /**
   * DELETE /api/v1/roles/{id}/permissions/{permissionId}
   * Response trả về RoleDetail mới nhất — update signal trực tiếp, không cần reload
   */
  revokePermission(roleId: number, permissionId: number): Observable<ApiResponse<RoleDetail>> {
    return this.http.delete<ApiResponse<RoleDetail>>(
      `${this.baseUrl}/roles/${roleId}/permissions/${permissionId}`,
    );
  }
}
