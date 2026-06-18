import { Component, input } from '@angular/core';

@Component({
  selector: 'app-info-row',
  standalone: true,
  imports: [],
  templateUrl: './info-row.html',
  styleUrl: './info-row.css',
})
export class InfoRowComponent {
  label = input.required<string>();
}
