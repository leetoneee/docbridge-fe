import { Pipe, PipeTransform } from '@angular/core';
import { LocalDateTimeArray } from '../../features/interop-system/models/interop-system.model';

@Pipe({
  name: 'localDate',
})
export class LocalDatePipe implements PipeTransform {
  transform(
    value: LocalDateTimeArray | null | undefined,
    format: 'dd/MM/yyyy' | 'dd/MM/yyyy HH:mm' = 'dd/MM/yyyy',
  ): string {
    if (!Array.isArray(value) || value.length < 3) {
      return '';
    }

    const [year, month, day, hour = 0, minute = 0] = value;

    const pad = (n: number) => n.toString().padStart(2, '0');

    const result = `${pad(day)}/${pad(month)}/${year}`;

    return format === 'dd/MM/yyyy HH:mm' ? `${result} ${pad(hour)}:${pad(minute)}` : result;
  }
}
