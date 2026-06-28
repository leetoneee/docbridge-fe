export type AuditResult = 'SUCCESS' | 'FAILURE';

export interface AuditLog {
  id: string;
  actorId: number;
  actorEmail: string;
  actorRole: string;
  action: string;
  targetType: string | null;
  targetId: string | null;
  description: string;
  ipAddress: string;
  result: AuditResult;
  failureReason: string | null;
  createdAt: string; // ISO string từ Elasticsearch — KHÔNG phải LocalDateTimeArray
}

export interface AuditLogPage {
  items: AuditLog[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface AuditLogFilter {
  dateFrom?: string;
  dateTo?: string;
  actions?: string[];
  actorEmail?: string;
  targetType?: string;
  result?: AuditResult;
  searchAfter?: string;
  size: number;
}

export type DateRangePreset = 'today' | '7d' | '30d';

export const ACTION_LABEL: Record<string, string> = {
  LOGIN:            'Đăng nhập',
  LOGOUT:           'Đăng xuất',
  CHANGE_PASSWORD:  'Đổi mật khẩu',
  RESET_PASSWORD:   'Reset mật khẩu',
  CREATE:           'Tạo mới',
  UPDATE:           'Cập nhật',
  DELETE:           'Xoá',
  LOCK:             'Khoá',
  UNLOCK:           'Mở khoá',
  APPROVE:          'Phê duyệt',
  REJECT:           'Từ chối',
  SEND:             'Gửi văn bản',
  ACCEPT:           'Chấp nhận',
  CANCEL:           'Thu hồi',
  GRANT_PERMISSION:  'Cấp quyền',
  REVOKE_PERMISSION: 'Thu hồi quyền',
};

export const TARGET_LABEL: Record<string, string> = {
  INTEROP_SYSTEM: 'Hệ thống liên thông',
  INTEROP_UNIT:   'Đơn vị liên thông',
  ACCOUNT:        'Tài khoản',
  TRANSACTION:    'Giao dịch văn bản',
  ROLE:           'Role'
};

interface BadgeStyle { bg: string; text: string; }

export const ACTION_BADGE: Record<string, BadgeStyle> = {
  LOGIN:           { bg: '#DBEAFE', text: '#1D4ED8' },
  LOGOUT:          { bg: '#F1F5F9', text: '#64748B' },
  CHANGE_PASSWORD: { bg: '#EDE9FE', text: '#6D28D9' },
  RESET_PASSWORD:  { bg: '#EDE9FE', text: '#6D28D9' },
  CREATE:          { bg: '#DCFCE7', text: '#15803D' },
  UPDATE:          { bg: '#FEF3C7', text: '#B45309' },
  DELETE:          { bg: '#FEE2E2', text: '#DC2626' },
  LOCK:            { bg: '#FEE2E2', text: '#DC2626' },
  UNLOCK:          { bg: '#DCFCE7', text: '#15803D' },
  APPROVE:         { bg: '#DCFCE7', text: '#15803D' },
  REJECT:          { bg: '#FEE2E2', text: '#DC2626' },
  SEND:            { bg: '#DBEAFE', text: '#1D4ED8' },
  ACCEPT:          { bg: '#DCFCE7', text: '#15803D' },
  CANCEL:          { bg: '#F1F5F9', text: '#64748B' },
  GRANT_PERMISSION:   { bg: '#DBEAFE', text: '#1D4ED8' }, 
  REVOKE_PERMISSION:  { bg: '#FEE2E2', text: '#DC2626' },
};