export type StatusKey =
  | 'ACTIVE'
  | 'LOCKED'
  | 'PENDING'
  | 'REJECTED'
  | 'SENT'
  | 'ACCEPTED'
  | 'CANCELLED';

export interface StatsOverview {
  total:            number;
  sent:             number;
  accepted:         number;
  rejected:         number;
  cancelled:        number;
  totalActiveUnits: number;
  pendingUnits:     number;
}

export interface StatsSystemStat {
  systemId:   number;
  systemCode: string;
  systemName: string;
  count:      number;
}
 
export interface StatsTimelineStat {
  period: string;
  count:  number;
}
 
export interface StatsRecentTransaction {
  transactionCode: string;
  fromUnit:        string;
  toUnit:          string;
  status:          StatusKey;
  createdAt:       string;
}
 
export interface TransactionStatsResponse {
  overview:           StatsOverview;
  bySystem:           StatsSystemStat[];
  timeline:           StatsTimelineStat[];
  recentTransactions: StatsRecentTransaction[];
}

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
