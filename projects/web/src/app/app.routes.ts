import { Routes } from '@angular/router';
import { DashboardComponent, FileUploadComponent, ProjectsComponent, SidebarItem, TagPageComponent } from 'shared';

export const routes: Routes = [
    {
        path: '',
        component: DashboardComponent
    },
    {
        path: 'projects',
        component: ProjectsComponent
    },
    {
        path: 'tags',
        component: TagPageComponent
    }, {
        path: 'fileupload',
        component: FileUploadComponent
    }
];

export const navItems: Array<SidebarItem> = [
    {
        title: 'Dashboard',
        route: '',
        icon: 'dashboard'
    }, {
        title: 'Projects',
        route: 'projects',
        icon: 'inventory'
    }, {
        title: 'Tags',
        route: 'tags',
        icon: 'label'
    }, {
        title: 'Fileupload',
        route: 'fileupload',
        icon: 'upload'
    }
]