import { InjectionToken } from '@angular/core';
import { SidebarItem } from './sidebar.model';

export const SIDEBAR_ITEMS_TOKEN = new InjectionToken<Array<SidebarItem>>('SidebarItemsToken')