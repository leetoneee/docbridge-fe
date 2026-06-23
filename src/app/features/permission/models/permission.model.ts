export interface RoleSummary {
  id: number;
  code: string;
  name: string;
  description: string;
  permissionCount: number;
}

export interface PermissionItem {
  id: number;
  code: string;
  name: string;
  description: string | null;
  groupName: string;
  assigned: boolean;
}

export interface RoleDetail {
  id: number;
  code: string;
  name: string;
  description: string;
  /** key = groupName (SYSTEM, ACCOUNT, UNIT, LOG, DOCUMENT...) */
  permissionsByGroup: Record<string, PermissionItem[]>;
}