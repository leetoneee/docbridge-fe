import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { PermissionApiService } from '../services/permission-api.service';
import { PermissionItem, RoleDetail, RoleSummary } from '../models/permission.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { KeyValuePipe } from '@angular/common';

const GROUP_LABEL: Record<string, string> = {
  SYSTEM: 'Hệ thống liên thông',
  UNIT: 'Đơn vị liên thông',
  ACCOUNT: 'Tài khoản & Phân quyền',
  DOCUMENT: 'Văn bản',
  LOG: 'Nhật ký & Thống kê',
};

// Thứ tự ưu tiên — group không có trong list này append sau cùng
const GROUP_ORDER = ['SYSTEM', 'UNIT', 'ACCOUNT', 'DOCUMENT', 'LOG'];

type AssignedFilter = 'all' | 'assigned' | 'unassigned';

@Component({
  selector: 'app-permission-page',
  standalone: true,
  imports: [],
  templateUrl: './permission-page.html',
  styleUrl: './permission-page.css',
})
export class PermissionPage {
  private api = inject(PermissionApiService);
  private destroyRef = inject(DestroyRef);

  roles = signal<RoleSummary[]>([]);
  rolesLoading = signal(true);

  selectedRole = signal<RoleSummary | null>(null);
  roleDetail = signal<RoleDetail | null>(null);
  detailLoading = signal(false);
  detailError = signal<string | null>(null);

  /** Set<permissionId> đang in-flight toggle */
  togglingIds = signal<Set<number>>(new Set());

  searchTerm = signal('');
  assignedFilter = signal<AssignedFilter>('all');

  toastMessage = signal<string | null>(null);
  toastIsError = signal(false);

  private toastTimer: ReturnType<typeof setTimeout> | null = null;

  /** Danh sách group đã lọc theo search + assignedFilter, theo đúng GROUP_ORDER */
  filteredGroups = computed(() => {
    const detail = this.roleDetail();
    if (!detail) return [];

    const term = this.searchTerm().toLowerCase().trim();
    const filter = this.assignedFilter();
    const map = detail.permissionsByGroup;

    const allKeys = Object.keys(map);
    const ordered = [
      ...GROUP_ORDER.filter((g) => allKeys.includes(g)),
      ...allKeys.filter((g) => !GROUP_ORDER.includes(g)),
    ];

    return ordered
      .map((groupName) => ({
        groupName,
        label: GROUP_LABEL[groupName] ?? groupName,
        perms: map[groupName].filter((p) => {
          const matchTerm =
            !term || p.name.toLowerCase().includes(term) || p.code.toLowerCase().includes(term);
          const matchFilter =
            filter === 'all' ||
            (filter === 'assigned' && p.assigned) ||
            (filter === 'unassigned' && !p.assigned);
          return matchTerm && matchFilter;
        }),
      }))
      .filter((g) => g.perms.length > 0);
  });

  assignedCount = computed(() => {
    const detail = this.roleDetail();
    if (!detail) return 0;
    return Object.values(detail.permissionsByGroup)
      .flat()
      .filter((p) => p.assigned).length;
  });

  totalPermissionCount = computed(() => {
    const detail = this.roleDetail();
    if (!detail) return 0;
    return Object.values(detail.permissionsByGroup).flat().length;
  });

  ngOnInit() {
    this.loadRoles();
  }

  ngOnDestroy() {
    if (this.toastTimer) clearTimeout(this.toastTimer);
  }

  loadRoles() {
    this.rolesLoading.set(true);
    this.api
      .getRoles()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          if (res.data) {
            this.roles.set(res.data);
            if (res.data.length > 0) this.selectRole(res.data[0]);
          }
          this.rolesLoading.set(false);
        },
        error: () => this.rolesLoading.set(false),
      });
  }

  selectRole(role: RoleSummary) {
    if (this.selectedRole()?.id === role.id) return;
    this.selectedRole.set(role);
    this.roleDetail.set(null);
    this.searchTerm.set('');
    this.assignedFilter.set('all');
    this.loadRoleDetail(role.id);
  }

  loadRoleDetail(id: number) {
    this.detailLoading.set(true);
    this.detailError.set(null);
    this.api
      .getRoleById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          if (res.data) this.roleDetail.set(res.data);
          this.detailLoading.set(false);
        },
        error: () => {
          this.detailError.set('Không thể tải danh sách quyền.');
          this.detailLoading.set(false);
        },
      });
  }

  isToggling(permId: number) {
    return this.togglingIds().has(permId);
  }

  togglePermission(perm: PermissionItem) {
    const role = this.selectedRole();
    if (!role || this.isToggling(perm.id)) return;

    const next = new Set(this.togglingIds());
    next.add(perm.id);
    this.togglingIds.set(next);

    const call$ = perm.assigned
      ? this.api.revokePermission(role.id, perm.id)
      : this.api.assignPermission(role.id, perm.id);

    call$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.removeToggling(perm.id);
        if (res.code === 'SUCCESS') {
          this.showToast(
            perm.assigned ? `Đã thu hồi quyền ${perm.code}` : `Đã gán quyền ${perm.code}`,
          );
          this.loadRoleDetail(role.id); // reload để đảm bảo đồng bộ
        }
      },
      error: () => {
        this.removeToggling(perm.id);
        this.showToast(`Không thể cập nhật quyền ${perm.code}`, true);
      },
    });
  }

  private removeToggling(id: number) {
    const s = new Set(this.togglingIds());
    s.delete(id);
    this.togglingIds.set(s);
  }

private showToast(msg: string, isError = false) {
  if (this.toastTimer) clearTimeout(this.toastTimer);
  this.toastIsError.set(isError);
  this.toastMessage.set(msg);
  this.toastTimer = setTimeout(() => this.toastMessage.set(null), 2500);
}

  onSearchInput(event: Event) {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  onAssignedFilterChange(event: Event) {
    this.assignedFilter.set((event.target as HTMLSelectElement).value as AssignedFilter);
  }

  trackByGroup(_: number, g: { groupName: string }) {
    return g.groupName;
  }

  trackByPerm(_: number, p: PermissionItem) {
    return p.id;
  }
}
