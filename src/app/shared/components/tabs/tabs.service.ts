import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TabsService {
  activeTab = signal<string>('');
}
