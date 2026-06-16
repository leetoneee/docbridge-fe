import { Component, input, computed } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-password-strength',
  standalone: true,
  imports: [NgClass],
  templateUrl: './password-strength.html',
  styleUrl: './password-strength.css',
})
export class PasswordStrengthComponent {
    // 0 = none, 1 = yếu, 2 = trung bình, 3 = mạnh
  level = input<0 | 1 | 2 | 3>(0);

  readonly segments = [1, 2, 3] as const;

  readonly LABELS = ['', 'Yếu', 'Trung bình', 'Mạnh'];
  readonly COLORS = ['', 'text-destructive', 'text-warning', 'text-success'];

  segmentClass(segment: number): string {
    const active = this.level() >= segment;
    if (!active) return 'bg-border';
    const map: Record<number, string> = {
      1: 'bg-destructive',
      2: 'bg-warning',
      3: 'bg-success',
    };
    return map[this.level()] ?? 'bg-border';
  }

  labelColorClass = computed(() => this.COLORS[this.level()]);
  labelText       = computed(() => this.LABELS[this.level()]);
}
