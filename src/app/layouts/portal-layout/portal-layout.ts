import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PortalSidebar } from './portal-sidebar/portal-sidebar';
import { PortalHeader } from './portal-header/portal-header';

@Component({
  selector: 'app-portal-layout',
  imports: [RouterOutlet, PortalSidebar, PortalHeader],
  templateUrl: './portal-layout.html',
  styleUrl: './portal-layout.css',
})
export class PortalLayout {}
