import { LocalDateTimeArray } from "../../interop-system/models/interop-system.model";

export type AccountStatus = 'ACTIVE' | 'LOCKED' | 'PENDING';

export interface ResetAccountPasswordResult {
  accountId: number;
  email: string;
  tempPassword: string;
}

export interface AccountUnitInfo {
  unitId: number;
  interopCode: string;
  unitName: string;
}

export interface AccountDetail {
  id: number;
  email: string;
  roleCode: string;
  roleName: string;
  status: AccountStatus;
  lastLoginAt?: LocalDateTimeArray;
  createdAt: LocalDateTimeArray;
  unitInfo?: AccountUnitInfo;
  /** Cờ boolean (is_temp_password) - KHÔNG phải giá trị mật khẩu thật, khác với ResetAccountPasswordResult.tempPassword */
  tempPassword: boolean;
}