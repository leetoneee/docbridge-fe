import { InteropSystem } from '../models/interop-system.model';

export const MOCK_INTEROP_SYSTEMS: InteropSystem[] = [
  {
    id: 1,
    code: 'EOFFICE',
    name: 'Hệ thống quản lý văn bản điều hành',
    description: 'Hệ thống văn bản điện tử liên thông giữa các đơn vị hành chính.',
    unitCount: 12,
    status: 'ACTIVE',
    createdAt: [2026, 6, 18, 9, 21, 23],
  },
  {
    id: 2,
    code: 'ONEGATE',
    name: 'Cổng dịch vụ công một cửa',
    description: 'Tiếp nhận và xử lý hồ sơ dịch vụ công trực tuyến.',
    unitCount: 8,
    status: 'ACTIVE',
    createdAt: [2026, 6, 18, 9, 21, 23],
  },
  {
    id: 3,
    code: 'LGSP',
    name: 'Nền tảng tích hợp chia sẻ dữ liệu',
    description: 'Kết nối, chia sẻ dữ liệu giữa các hệ thống thông tin.',
    unitCount: 0,
    status: 'LOCKED',
    createdAt: [2026, 6, 18, 9, 21, 23],
  },
  {
    id: 4,
    code: 'HRM',
    name: 'Quản lý nhân sự nội bộ',
    description: 'Quản lý hồ sơ, tổ chức cán bộ công chức.',
    unitCount: 5,
    status: 'ACTIVE',
    createdAt: [2026, 6, 18, 9, 21, 23],
  },
  {
    id: 5,
    code: 'ARCHIVE',
    name: 'Lưu trữ điện tử',
    description: 'Lưu trữ và tra cứu văn bản, hồ sơ điện tử.',
    unitCount: 3,
    status: 'LOCKED',
    createdAt: [2026, 6, 18, 9, 21, 23],
  },
];
