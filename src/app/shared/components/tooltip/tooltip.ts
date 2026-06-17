import { Component, input } from '@angular/core';

@Component({
  selector: 'app-tooltip',
  standalone: true,
  imports: [],
  templateUrl: './tooltip.html',
  styleUrl: './tooltip.css',
})
export class TooltipComponent {
  label = input.required<string>();
}
