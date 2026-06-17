import { DashboardSummary } from "../models/dashboard.model";

export const MOCK_DASHBOARD_SUMMARY: DashboardSummary = {
  kpi: {
    totalTransactions:   1284,
    pendingTransactions: 47,
    totalActiveUnits:    38,
    pendingUnits:        5,
  },
  txOverTime: [
    { date: '01/07', value: 142 },
    { date: '02/07', value: 168 },
    { date: '03/07', value: 155 },
    { date: '04/07', value: 201 },
    { date: '05/07', value: 187 },
    { date: '06/07', value: 224 },
    { date: '07/07', value: 207 },
  ],
  txBySystem: [
    { system: 'EOFFICE',     value: 512 },
    { system: 'DICHVUCONG',  value: 386 },
    { system: 'ECABINET',    value: 241 },
    { system: 'ARCHIVE',     value: 98  },
    { system: 'SIGNHUB',     value: 47  },
  ],
  recentTransactions: [
    { code: 'GD-2024-08412', from: 'UBND TP. Hà Nội',       to: 'Bộ Nội vụ',                status: 'ACCEPTED',  time: '10 phút trước' },
    { code: 'GD-2024-08411', from: 'Sở Y tế TP.HCM',         to: 'Bộ Y tế',                  status: 'SENT',      time: '32 phút trước' },
    { code: 'GD-2024-08410', from: 'Văn phòng Chính phủ',    to: 'UBND TP. Đà Nẵng',         status: 'ACCEPTED',  time: '1 giờ trước'   },
    { code: 'GD-2024-08409', from: 'Bộ Tài chính',           to: 'Kho bạc Nhà nước',          status: 'CANCELLED', time: '2 giờ trước'   },
    { code: 'GD-2024-08408', from: 'Sở GTVT Đà Nẵng',        to: 'Cục Đường bộ Việt Nam',    status: 'SENT',      time: '3 giờ trước'   },
  ],
};