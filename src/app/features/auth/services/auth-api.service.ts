import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../shared/models/api-response.model';
import {
  LoginRequest,
  LoginResponse,
  ChangePasswordRequest,
  FirstLoginChangePasswordRequest,
} from '../../../core/models/auth.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/api/v1/auth`;

  login(body: LoginRequest): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(`${this.base}/login`, body);
  }

  logout(): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.base}/logout`, {});
  }

  firstChangePassword(
    body: FirstLoginChangePasswordRequest
  ): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(
      `${this.base}/first-change-password`,
      body
    );
  }

  changePassword(body: ChangePasswordRequest): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(
      `${this.base}/change-password`,
      body
    );
  }
}
