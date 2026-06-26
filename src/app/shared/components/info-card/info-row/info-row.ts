import { Component, input } from '@angular/core';

@Component({
  selector: 'app-info-row',
  standalone: true,
  imports: [],
  templateUrl: './info-row.html',
  styleUrl: './info-row.css',
  host: {
    '[class.sm:col-span-2]': 'fullWidth()',
  },
})
export class InfoRowComponent {
  label = input.required<string>();
  fullWidth = input<boolean>(false);
}
