import { Component, computed, input } from '@angular/core';

interface RoleStyle {
  label: string;
  bg: string;
  text: string;
}

const ROLE_CONFIG: Record<string, RoleStyle> = {
  ADMIN:    { label: 'Quản trị viên',     bg: '#EDE9FE', text: '#6D28D9' },
  OPERATOR: { label: 'Vận hành viên',     bg: '#DBEAFE', text: '#1D4ED8' },
  UNIT:     { label: 'Đơn vị liên thông', bg: '#F0FDF4', text: '#15803D' },
};

const FALLBACK: RoleStyle = { label: '', bg: '#F1F5F9', text: '#64748B' };


@Component({
  selector: 'app-role-badge',
  standalone: true,
  imports: [],
  templateUrl: './role-badge.html',
  styleUrl: './role-badge.css',
})
export class RoleBadgeComponent {
  roleCode = input.required<string>();
  style = computed(() => ROLE_CONFIG[this.roleCode()] ?? FALLBACK);
}
