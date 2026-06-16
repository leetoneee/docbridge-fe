import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import {
  CurrentUser,
  JwtPayload,
  LoginResponse,
  RoleCode
} from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'access_token';

  // Signal — source of truth cho toàn app
  private _currentUser = signal<CurrentUser | null>(this.initFromStorage());

  // Readonly signals cho components/guards dùng
  readonly currentUser    = this._currentUser.asReadonly();
  readonly isLoggedIn     = computed(() => !!this._currentUser());
  readonly role           = computed(() => this._currentUser()?.role ?? null);
  readonly permissions    = computed(() => this._currentUser()?.permissions ?? []);
  readonly mustChangePwd  = computed(() => this._currentUser()?.mustChangePassword ?? false);

  constructor(private router: Router) {}

  // ----------------------------------------------------------------
  // Gọi sau khi login thành công
  // ----------------------------------------------------------------
  handleLoginSuccess(response: LoginResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.token);
    const user = this.decodeToken(response.token);
    this._currentUser.set(user);
  }

  // ----------------------------------------------------------------
  // Logout — clear storage + signal + redirect
  // ----------------------------------------------------------------
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this._currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  hasPermission(permission: string): boolean {
    return this.permissions().includes(permission);
  }

  hasRole(role: RoleCode): boolean {
    return this.role() === role;
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;
    try {
      const payload = this.decodeJwtPayload(token);
      return Date.now() >= payload.exp * 1000;
    } catch {
      return true;
    }
  }

  // ----------------------------------------------------------------
  // Private helpers
  // ----------------------------------------------------------------

  // Khởi tạo user từ token trong localStorage khi app load
  private initFromStorage(): CurrentUser | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) return null;
    try {
      const payload = this.decodeJwtPayload(token);
      // Token đã hết hạn → clear luôn
      if (Date.now() >= payload.exp * 1000) {
        localStorage.removeItem(this.TOKEN_KEY);
        return null;
      }
      return this.mapPayloadToUser(payload);
    } catch {
      localStorage.removeItem(this.TOKEN_KEY);
      return null;
    }
  }

  private decodeToken(token: string): CurrentUser {
    const payload = this.decodeJwtPayload(token);
    return this.mapPayloadToUser(payload);
  }

  // Decode base64 JWT payload — không verify signature (BE đã verify)
  private decodeJwtPayload(token: string): JwtPayload {
    const base64 = token.split('.')[1];
    const json = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json) as JwtPayload;
  }

  private mapPayloadToUser(payload: JwtPayload): CurrentUser {
    return {
      accountId:          payload.accountId,
      email:              payload.sub,
      role:               payload.role,
      unitId:             payload.unitId,
      permissions:        payload.permissions ?? [],
      mustChangePassword: payload.tempPwd,
    };
  }
}