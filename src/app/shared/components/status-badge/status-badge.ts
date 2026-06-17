import { Component, computed, input } from '@angular/core';
import { StatusKey } from '../../../features/dashboard/models/dashboard.model';

interface StatusStyle { label: string; bg: string; fg: string; }

const STATUS_CONFIG: Record<StatusKey, StatusStyle> = {
  ACTIVE:    { label: 'Hoạt động', bg: '#DCFCE7', fg: '#15803D' },
  LOCKED:    { label: 'Đã khoá',   bg: '#FEE2E2', fg: '#DC2626' },
  PENDING:   { label: 'Chờ duyệt', bg: '#FEF3C7', fg: '#B45309' },
  REJECTED:  { label: 'Từ chối',   bg: '#F1F5F9', fg: '#64748B' },
  SENT:      { label: 'Đã gửi',    bg: '#DBEAFE', fg: '#1D4ED8' },
  ACCEPTED:  { label: 'Đã nhận',   bg: '#DCFCE7', fg: '#15803D' },
  CANCELLED: { label: 'Đã huỷ',    bg: '#F1F5F9', fg: '#64748B' },
};

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [],
  templateUrl: './status-badge.html',
  styleUrl: './status-badge.css',
})
export class StatusBadgeComponent {
  status = input.required<StatusKey>();
  cfg = computed(() => STATUS_CONFIG[this.status()]);
}
