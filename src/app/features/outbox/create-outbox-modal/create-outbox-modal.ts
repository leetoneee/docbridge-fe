import { Component, DestroyRef, effect, inject, input, output, signal, SimpleChanges } from '@angular/core';
import { ModalComponent } from '../../../shared/components/modal/modal';
import { FormsModule } from '@angular/forms';
import { InteropUnitApiService } from '../../interop-unit/services/interop-unit-api.service';
import { OutboxApiService } from '../services/outbox-api.service';
import { UnitSummary } from '../../interop-unit/models/interop-unit.model';
import { debounceTime, distinctUntilChanged, of, Subject, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CreateOutboxPayload } from '../models/outbox.model';


type FormErrors = Partial<Record<'documentCode' | 'title' | 'fileReference' | 'receiver', string>>;

@Component({
  selector: 'app-create-outbox-modal',
  standalone: true,
  imports: [FormsModule, ModalComponent],
  templateUrl: './create-outbox-modal.html',
  styleUrl: './create-outbox-modal.css',
})
export class CreateOutboxModal {
  private api = inject(OutboxApiService);
  private unitApi = inject(InteropUnitApiService);
  private destroyRef = inject(DestroyRef);

  open = input.required<boolean>();
  openChange = output<boolean>();
  created = output<void>();

  documentCode = signal('');
  title = signal('');
  fileReference = signal('');
  note = signal('');

  query = signal('');
  showList = signal(false);
  suggestions = signal<UnitSummary[]>([]);
  selected = signal<UnitSummary | null>(null);
  searching = signal(false);

  submitting = signal(false);
  errors = signal<FormErrors>({});

  private query$ = new Subject<string>();

  constructor() {
    // Reset khi modal mở lại — nhất quán với pattern các modal khác trong project
    effect(
      () => {
        if (this.open()) this.resetForm();
      },
      { allowSignalWrites: true },
    );

    this.query$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((q) => {
          if (!q.trim()) {
            this.suggestions.set([]);
            this.searching.set(false);
            return of(null);
          }
          this.searching.set(true);
          return this.unitApi.getAllUnits(q);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((res) => {
        this.searching.set(false);
        if (res) this.suggestions.set(res.data ?? []);
      });
  }

  private resetForm() {
    this.documentCode.set('');
    this.title.set('');
    this.fileReference.set('');
    this.note.set('');
    this.query.set('');
    this.showList.set(false);
    this.suggestions.set([]);
    this.selected.set(null);
    this.errors.set({});
    this.submitting.set(false);
  }

  onQueryInput(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.query.set(val);
    this.showList.set(true);
    if (!val.trim()) this.selected.set(null);
    this.query$.next(val);
  }

  selectUnit(unit: UnitSummary) {
    this.selected.set(unit);
    this.query.set('');
    this.showList.set(false);
    this.suggestions.set([]);
    this.errors.update((e) => ({ ...e, receiver: undefined }));
  }

  clearSelected() {
    this.selected.set(null);
  }

  private validate(): boolean {
    const errs: FormErrors = {};
    if (!this.documentCode().trim()) errs.documentCode = 'Vui lòng nhập số hiệu văn bản.';
    if (!this.title().trim()) errs.title = 'Vui lòng nhập tiêu đề.';
    if (!this.selected()) errs.receiver = 'Vui lòng chọn đơn vị nhận.';
    if (!this.fileReference().trim()) errs.fileReference = 'Vui lòng nhập file reference.';
    this.errors.set(errs);
    return Object.keys(errs).length === 0;
  }

  submit() {
    if (!this.validate()) return;
    this.submitting.set(true);

    const payload: CreateOutboxPayload = {
      documentCode: this.documentCode().trim(),
      title: this.title().trim(),
      receiverInteropCode: this.selected()!.interopCode,
      fileReference: this.fileReference().trim(),
      note: this.note().trim() || undefined,
    };

    this.api
      .create(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.submitting.set(false);
          this.openChange.emit(false);
          this.created.emit();
        },
        error: () => {
          this.submitting.set(false);
        },
      });
  }

  close() {
    if (this.submitting()) return;
    this.openChange.emit(false);
  }
}
