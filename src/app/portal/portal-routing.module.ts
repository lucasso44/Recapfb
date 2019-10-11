import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PortalComponent } from './components/portal/portal.component';

const routes: Routes = [
    {
        path: '',
        component: PortalComponent,
        children: [
            {
                path: 'home',
                component: HomeComponent
            },
            {
                path: '**',
                redirectTo: 'home'
            }
        ]
    }
];

export const PortalRoutingModule = RouterModule.forChild(routes);
