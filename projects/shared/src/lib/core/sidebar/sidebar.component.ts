import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { SIDEBAR_ITEMS_TOKEN } from './sidebar-items.injection-token';
import { SidebarItem } from './sidebar.model';

@Component({
  selector: 'lib-sidebar',
  standalone: true,
  imports: [MatListModule, MatIconModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  items: Array<SidebarItem> = inject(SIDEBAR_ITEMS_TOKEN);

}
