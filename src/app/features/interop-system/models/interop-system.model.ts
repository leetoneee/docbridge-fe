export type InteropSystemStatus = 'ACTIVE' | 'LOCKED';

export interface InteropSystem {
  id: string;
  code: string;
  name: string;
  description: string;
  unitCount: number;
  status: InteropSystemStatus;
  createdAt: string;
}

export interface InteropSystemQuery {
  search: string;
  status: InteropSystemStatus | 'ALL';
  page: number; // 0-based, khớp convention PageData của BE
  size: number;
}