import { LocalDateTimeArray } from "../../interop-system/models/interop-system.model";

export type InteropUnitStatus = 'PENDING' | 'ACTIVE' | 'LOCKED' | 'REJECTED';

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
