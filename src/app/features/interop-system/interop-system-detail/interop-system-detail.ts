import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge';
import { InfoCardComponent } from '../../../shared/components/info-card/info-card/info-card';
import { InfoGridComponent } from '../../../shared/components/info-card/info-grid/info-grid';
import { InfoRowComponent } from '../../../shared/components/info-card/info-row/info-row';
import { ConfirmDialog, ConfirmDialogTone } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { TabsComponent } from '../../../shared/components/tabs/tabs/tabs';
import { TabsListComponent } from '../../../shared/components/tabs/tabs-list/tabs-list';
import { TabsTriggerComponent } from '../../../shared/components/tabs/tabs-trigger/tabs-trigger';
import { TabsContentComponent } from '../../../shared/components/tabs/tabs-content/tabs-content';
import { LocalDatePipe } from '../../../shared/pipes/local-date-pipe';
import { ActivatedRoute, Router } from '@angular/router';
import { InteropSystemApiService } from '../services/interop-system-api.service';
import { InteropUnitApiService } from '../../interop-unit/services/interop-unit-api.service';
import { InteropSystem } from '../models/interop-system.model';
import { InteropUnit } from '../../interop-unit/models/interop-unit.model';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-interop-system-detail',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PageHeaderComponent,
    StatusBadgeComponent,
    InfoCardComponent,
    InfoGridComponent,
    InfoRowComponent,
    ConfirmDialog,
    TabsComponent,
    TabsListComponent,
    TabsTriggerComponent,
    TabsContentComponent,
    LocalDatePipe,
  ],
  templateUrl: './interop-system-detail.html',
  styleUrl: './interop-system-detail.css',
})
export class InteropSystemDetail {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private systemApi = inject(InteropSystemApiService);
  private unitApi = inject(InteropUnitApiService);
  private destroyRef = inject(DestroyRef);

  systemId = Number(this.route.snapshot.paramMap.get('id'));

  system = signal<InteropSystem | null>(null);
  loading = signal(true);
  loadError = signal<string | null>(null);

  editForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(255)]],
    description: ['', [Validators.maxLength(1000)]],
  });
  saving = signal(false);
  saveError = signal<string | null>(null);

  units = signal<InteropUnit[]>([]);
  unitsLoading = signal(true);
  unitsError = signal<string | null>(null);
  unitSearchValue = signal('');
  unitPage = signal(0);
  unitPageSize = signal(10);
  unitTotalElements = signal(0);
  unitTotalPages = signal(1);

  lockTarget = signal(false);
  deleteTarget = signal(false);
  actionLoading = signal(false);

  lockDialogTitle = computed(() =>
    this.system()?.status === 'LOCKED' ? 'Mở khoá hệ thống' : 'Khoá hệ thống',
  );
  lockDialogDescription = computed(() => {
    const s = this.system();
    if (!s) return '';
    return s.status === 'LOCKED'
      ? `Mở khoá hệ thống "${s.name}"? Các đơn vị sẽ có thể thực hiện giao dịch trở lại.`
      : `Khoá hệ thống "${s.name}"? Các đơn vị thuộc hệ thống sẽ không thể thực hiện giao dịch.`;
  });
  lockDialogConfirmLabel = computed(() =>
    this.system()?.status === 'LOCKED' ? 'Mở khoá' : 'Khoá hệ thống',
  );
  lockDialogDestructive = computed(() => this.system()?.status !== 'LOCKED');
  lockDialogTone = computed<ConfirmDialogTone>(() =>
    this.system()?.status === 'LOCKED' ? 'primary' : 'warning',
  );

  deleteDialogDescription = computed(() => {
    const s = this.system();
    return s ? `Bạn có chắc muốn xoá hệ thống "${s.name}"? Hành động này không thể hoàn tác.` : '';
  });

  private unitSearchInput$ = new Subject<string>();

  ngOnInit() {
    this.unitSearchInput$
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((term) => {
        this.unitSearchValue.set(term);
        this.unitPage.set(0);
        this.loadUnits();
      });

    this.loadSystem();
    this.loadUnits();
  }

  loadSystem() {
    this.loading.set(true);
    this.loadError.set(null);

    this.systemApi
      .getById(this.systemId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          if (res.data) {
            this.system.set(res.data);
            this.editForm.setValue({ name: res.data.name, description: res.data.description });
          }
          this.loading.set(false);
        },
        error: () => {
          this.loadError.set('Không thể tải thông tin hệ thống liên thông.');
          this.loading.set(false);
        },
      });
  }

  loadUnits() {
    this.unitsLoading.set(true);
    this.unitsError.set(null);

    this.unitApi
      .getList({
        systemId: this.systemId,
        keyword: this.unitSearchValue(),
        status: 'ALL',
        page: this.unitPage(),
        size: this.unitPageSize(),
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          if (res.data) {
            this.units.set(res.data.content);
            this.unitTotalElements.set(res.data.page.totalElements);
            this.unitTotalPages.set(res.data.page.totalPages);
          }
          this.unitsLoading.set(false);
        },
        error: () => {
          this.unitsError.set('Không thể tải danh sách đơn vị.');
          this.unitsLoading.set(false);
        },
      });
  }

  onUnitSearchInput(event: Event) {
    this.unitSearchInput$.next((event.target as HTMLInputElement).value);
  }

  goToUnitPage(p: number) {
    if (p < 0 || p >= this.unitTotalPages()) return;
    this.unitPage.set(p);
    this.loadUnits();
  }

  viewUnit(id: number) {
    this.router.navigate(['/management/units', id]);
  }

  cancelEdit() {
    const s = this.system();
    if (!s) return;
    this.editForm.setValue({ name: s.name, description: s.description });
    this.saveError.set(null);
  }

  saveEdit() {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.saveError.set(null);

    const raw = this.editForm.getRawValue();

    this.systemApi
      .update(this.systemId, { name: raw.name.trim(), description: raw.description.trim() })
      .subscribe({
        next: (res) => {
          this.saving.set(false);
          if (res.data) this.system.set(res.data);
        },
        error: (err) => {
          this.saving.set(false);
          this.saveError.set(err?.error?.message ?? 'Không thể lưu thay đổi. Vui lòng thử lại.');
        },
      });
  }

  askToggleStatus() {
    this.lockTarget.set(true);
  }

  confirmToggleStatus() {
    const s = this.system();
    if (!s) return;
    this.actionLoading.set(true);
    this.systemApi.toggleStatus(s.id).subscribe({
      next: () => {
        this.actionLoading.set(false);
        this.lockTarget.set(false);
        this.loadSystem();
      },
      error: () => this.actionLoading.set(false),
    });
  }

  askDelete() {
    this.deleteTarget.set(true);
  }

  confirmDelete() {
    const s = this.system();
    if (!s) return;
    this.actionLoading.set(true);
    this.systemApi.remove(s.id).subscribe({
      next: () => {
        this.actionLoading.set(false);
        this.deleteTarget.set(false);
        this.router.navigate(['/management/systems']);
      },
      error: () => this.actionLoading.set(false),
    });
  }
}
