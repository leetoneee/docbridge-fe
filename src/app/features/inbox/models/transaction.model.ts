import { LocalDateTimeArray } from '../../interop-system/models/interop-system.model';

export type TransactionStatus = 'SENT' | 'ACCEPTED' | 'CANCELLED' | 'REJECTED';

export type DateRangePreset = 'all' | 'today' | '7d' | '30d';

export interface TransactionUnit {
  id: number;
  interopCode: string;
  name: string;
}

export interface TransactionActedBy {
  id: number;
  email: string;
}

export interface TransactionHistory {
  fromStatus: TransactionStatus;
  toStatus: TransactionStatus;
  reason: string | null;
  actedBy: TransactionActedBy;
  actedAt: LocalDateTimeArray;
}

export interface Transaction {
  id: number;
  transactionCode: string;
  sender: TransactionUnit;
  receiver: TransactionUnit;
  documentCode: string;
  title: string;
  fileReference: string;
  note: string | null;
  status: TransactionStatus;
  version: number;
  createdAt: LocalDateTimeArray;
  updatedAt: LocalDateTimeArray;
  history: TransactionHistory[];
}

// Filter params
export interface TransactionFilterParams {
  keyword?: string;
  counterpartCode?: string;
  status?: TransactionStatus | '';
  from?: string; // ISO date string gửi lên API
  to?: string;
  page: number;
  size: number;
}
