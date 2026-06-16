export type RoleCode = 'ADMIN' | 'OPERATOR' | 'UNIT';

// Map 1-1 với JWT payload của BE
export interface JwtPayload {
  sub: string;             // email
  accountId: number;
  role: RoleCode;
  unitId?: number;         // chỉ có khi role = UNIT
  permissions: string[];
  tempPwd: boolean;
  iat: number;
  exp: number;
}

// Object FE dùng xuyên suốt app — derive từ JwtPayload
export interface CurrentUser {
  accountId: number;
  email: string;
  role: RoleCode;
  unitId?: number;
  permissions: string[];
  mustChangePassword: boolean;  // map từ tempPwd
}

// Request / Response auth
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  email: string;
  role: RoleCode;
  mustChangePassword: boolean;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface FirstLoginChangePasswordRequest {
  newPassword: string;
  confirmPassword: string;
}