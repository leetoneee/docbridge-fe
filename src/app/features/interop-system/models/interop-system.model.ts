export type InteropSystemStatus = 'ACTIVE' | 'LOCKED';

export type LocalDateTimeArray = number[];
export interface InteropSystem {
  id: number;
  code: string;
  name: string;
  description: string;
  status: InteropSystemStatus;
  unitCount: number; 
  createdBy?: number;
  createdAt: LocalDateTimeArray;
  updatedAt?: LocalDateTimeArray;
}

export interface InteropSystemQuery {
  name: string;
  status: InteropSystemStatus | 'ALL';
  page: number; // 0-based, khớp convention PageData của BE
  size: number;
}

export interface CreateInteropSystemPayload {
  code: string;
  name: string;
  description: string;
}

export interface UpdateInteropSystemPayload {
  name: string;
  description: string;
}

export interface InteropSystemSummary {
  id: number;
  code: string;
  name: string;
  status: InteropSystemStatus;
}