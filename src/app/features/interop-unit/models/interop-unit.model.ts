import { LocalDateTimeArray } from '../../interop-system/models/interop-system.model';

export type InteropUnitStatus = 'PENDING' | 'ACTIVE' | 'LOCKED' | 'REJECTED';
export type AccountStatus = 'PENDING' | 'ACTIVE' | 'LOCKED';

export interface InteropUnitSystemRef {
  id: number;
  code: string;
  name: string;
}

export interface InteropUnit {
  id: number;
  interopCode: string;
  name: string;
  email: string;
  status: InteropUnitStatus;
  system: InteropUnitSystemRef;
  createdAt: LocalDateTimeArray;
}

export interface InteropUnitQuery {
  systemId?: number;
  status: InteropUnitStatus | 'ALL';
  keyword?: string;
  page: number;
  size: number;
}

export interface CreateInteropUnitPayload {
  systemId: number;
  name: string;
  description: string;
  representativeName: string;
  representativePhone: string;
  email: string;
}

export interface InteropUnitAccountInfo {
  accountId: number;
  email: string;
  status: AccountStatus;
  lastLoginAt?: LocalDateTimeArray;
}

export interface InteropUnitDetailInfo {
  id: number;
  interopCode: string;
  name: string;
  description: string;
  email: string;
  representativeName: string;
  representativePhone: string;
  status: InteropUnitStatus;
  rejectedReason?: string;
  system: InteropUnitSystemRef;
  unitAccount?: InteropUnitAccountInfo;
  approvedBy?: string;
  approvedAt?: LocalDateTimeArray;
  createdAt: LocalDateTimeArray;
}

export interface UpdateInteropUnitPayload {
  name: string;
  description: string;
  representativeName: string;
  representativePhone: string;
}

export interface ApproveInteropUnitResult {
  interopCode: string;
  tempPassword: string;
}

export interface RejectInteropUnitPayload {
  reason: string;
}

export interface ChangeUnitEmailPayload {
  email: string;
}

export interface InteropUnitAccountInfo {
  accountId: number;
  email: string;
  status: AccountStatus;
  lastLoginAt?: LocalDateTimeArray;
}

export interface UnitSummary {
  id: number;
  interopCode: string;
  name: string;
  email: string;
}