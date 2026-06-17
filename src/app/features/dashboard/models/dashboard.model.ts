export type StatusKey =
  | 'ACTIVE' | 'LOCKED' | 'PENDING' | 'REJECTED'
  | 'SENT' | 'ACCEPTED' | 'CANCELLED';

export interface RecentTransaction {
  code: string;
  from: string;
  to: string;
  status: StatusKey;
  time: string;
}

export interface TxOverTimePoint {
  date: string;
  value: number;
}

export interface TxBySystemPoint {
  system: string;
  value: number;
}

export interface DashboardKpi {
  totalTransactions: number;
  pendingTransactions: number;
  totalActiveUnits: number;
  pendingUnits: number;
}

export interface DashboardSummary {
  kpi: DashboardKpi;
  txOverTime: TxOverTimePoint[];
  txBySystem: TxBySystemPoint[];
  recentTransactions: RecentTransaction[];
}

export type TimeRange = '7_DAYS' | '30_DAYS' | '90_DAYS';