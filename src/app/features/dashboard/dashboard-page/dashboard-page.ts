import { Component, computed, inject, signal } from '@angular/core';
import { DashboardSummary, TimeRange } from '../models/dashboard.model';
import { Router } from '@angular/router';
import { DashboardApiService } from '../services/dashboard-api.service';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge';
import { DecimalPipe } from '@angular/common';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexStroke,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  ChartComponent
} from 'ng-apexcharts';

interface KpiCard {
  icon: 'transactions' | 'pending' | 'units' | 'alert';
  value: number;
  label: string;
  tint: string;
}

const RANGE_LABELS: { value: TimeRange; label: string }[] = [
  { value: '7_DAYS',  label: '7 ngày'  },
  { value: '30_DAYS', label: '30 ngày' },
  { value: '90_DAYS', label: '90 ngày' },
];

export type LineChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  stroke: ApexStroke;
  fill: ApexFill;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  grid: ApexGrid;
  dataLabels: ApexDataLabels;
  tooltip: ApexTooltip;
};

export type BarChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  grid: ApexGrid;
  dataLabels: ApexDataLabels;
  tooltip: ApexTooltip;
};

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [ChartComponent, StatusBadgeComponent, DecimalPipe],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css',
})
export class DashboardPage {
  private api = inject(DashboardApiService);
  private router = inject(Router);

  readonly rangeOptions = RANGE_LABELS;
  selectedRange = signal<TimeRange>('7_DAYS');

  isLoading = signal(true);
  summary    = signal<DashboardSummary | null>(null);

  kpiCards = computed<KpiCard[]>(() => {
    const s = this.summary();
    if (!s) return [];
    return [
      { icon: 'transactions', value: s.kpi.totalTransactions,   label: 'Tổng số giao dịch',       tint: '#2563EB' },
      { icon: 'pending',      value: s.kpi.pendingTransactions, label: 'Đang chờ phản hồi',        tint: '#D97706' },
      { icon: 'units',        value: s.kpi.totalActiveUnits,    label: 'Đơn vị đang hoạt động',    tint: '#16A34A' },
      { icon: 'alert',        value: s.kpi.pendingUnits,        label: 'Cần phê duyệt',             tint: '#D97706' },
    ];
  });

  // ----- Area chart: Giao dịch theo thời gian -----
  readonly areaChart = computed<LineChartOptions>(() => {
    const s = this.summary();

    return {
      series: [
        {
          name: 'Giao dịch',
          data: s?.txOverTime.map(x => x.value) ?? []
        }
      ],
      chart: {
        type: 'area',
        height: 260,
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        }
      },
      stroke: {
        curve: 'smooth',
        width: 2
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.25,
          opacityTo: 0.03
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: s?.txOverTime.map(x => x.date) ?? [],
        labels: {
          style: {
            colors: '#475569'
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: ['#475569']
          }
        }
      },
      grid: {
        borderColor: '#E2E8F0'
      },
      tooltip: {
        theme: 'light'
      }
    };
  });

  // ----- Bar chart: Giao dịch theo hệ thống -----
  readonly systemChart = computed<BarChartOptions>(() => {
    const s = this.summary();

    return {
      series: [
        {
          name: 'Giao dịch',
          data: s?.txBySystem.map(x => x.value) ?? []
        }
      ],
      chart: {
        type: 'bar',
        height: 260,
        toolbar: {
          show: false
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: s?.txBySystem.map(x => x.system) ?? [],
        labels: {
          style: {
            colors: '#475569'
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: ['#475569']
          }
        }
      },
      grid: {
        borderColor: '#E2E8F0'
      },
      tooltip: {
        theme: 'light'
      }
    };
  });

  constructor() {
    this.loadSummary();
  }

  private loadSummary(): void {
    this.isLoading.set(true);
    this.api.getSummary(this.selectedRange()).subscribe({
      next: (res) => {
        if (res.code === 'SUCCESS' && res.data) {
          this.summary.set(res.data);
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  onRangeChange(range: TimeRange): void {
    this.selectedRange.set(range);
    this.loadSummary();
  }

  onViewAllTransactions(): void {
    this.router.navigate(['/logs']); // TODO: chỉnh route khi có màn giao dịch chi tiết
  }
}
