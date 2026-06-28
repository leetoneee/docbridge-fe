import { Pipe, PipeTransform } from '@angular/core';

type DateLike = number[] | string | null | undefined;

@Pipe({
  name: 'localDate',
})
export class LocalDatePipe implements PipeTransform {
  transform(value: DateLike, format: 'dd/MM/yyyy' | 'dd/MM/yyyy HH:mm' = 'dd/MM/yyyy'): string {
    const parsed = this.parse(value);
    if (!parsed) return '';

    const pad = (n: number) => String(n).padStart(2, '0');
    const datePart = `${pad(parsed.day)}/${pad(parsed.month)}/${parsed.year}`;

    return format === 'dd/MM/yyyy HH:mm'
      ? `${datePart} ${pad(parsed.hour)}:${pad(parsed.minute)}`
      : datePart;
  }

  private parse(
    value: DateLike,
  ): { year: number; month: number; day: number; hour: number; minute: number } | null {
    if (!value) return null;

    // number[] — LocalDateTime Java serialize (month là 1-indexed, KHÔNG trừ 1)
    if (Array.isArray(value)) {
      if (value.length < 3) return null;
      const [year, month, day, hour = 0, minute = 0] = value;
      return { year, month, day, hour, minute };
    }

    // ISO string — Elasticsearch (getMonth() trả 0-indexed nên +1)
    if (typeof value === 'string') {
      const d = new Date(value);
      if (isNaN(d.getTime())) return null;
      return {
        year: d.getFullYear(),
        month: d.getMonth() + 1,
        day: d.getDate(),
        hour: d.getHours(),
        minute: d.getMinutes(),
      };
    }

    return null;
  }
}
