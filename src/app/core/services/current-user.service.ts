import { computed, inject, Injectable } from "@angular/core";
import { RoleCode } from "../models/auth.model";
import { AuthService } from "./auth.service";

const ROLE_LABELS: Record<RoleCode, string> = {
  ADMIN:    'Quản trị viên',
  OPERATOR: 'Điều hành viên',
  UNIT:     'Đơn vị liên thông',
};

@Injectable({ providedIn: 'root' })
export class CurrentUserService {
  private auth = inject(AuthService);

  readonly user        = this.auth.currentUser;
  readonly email       = computed(() => this.user()?.email ?? '');
  readonly role        = computed(() => this.user()?.role ?? null);
  readonly roleLabel   = computed(() => {
    const r = this.role();
    return r ? ROLE_LABELS[r] : '';
  });
  readonly initials    = computed(() => {
    const email = this.email();
    if (!email) return '';
    // "admin@docbridge.gov.vn" → "AD"
    const name = email.split('@')[0];
    return name.slice(0, 2).toUpperCase();
  });
  readonly unitId      = computed(() => this.user()?.unitId ?? null);
  readonly permissions = computed(() => this.user()?.permissions ?? []);
}