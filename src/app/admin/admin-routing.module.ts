import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AdminPageComponent } from './components/admin-page/admin-page.component';
import { UsersComponent } from './components/users/users.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { UserProfileEditComponent } from './components/user-profile-edit/user-profile-edit.component';
import { PathwayAddComponent } from './components/pathway-add/pathway-add.component';
import { PathwayEditComponent } from './components/pathway-edit/pathway-edit.component';
import { PathwaysComponent } from './components/pathways/pathways.component';
import { PathwayComponent } from './components/pathway/pathway.component';
import { PathwayUploadComponent } from './components/pathway-upload/pathway-upload.component';
import { PathwayReorderComponent } from './components/pathway-reorder/pathway-reorder.component';
import { PathwayPreviewComponent } from './components/pathway-preview/pathway-preview.component';
import { PathwayRecordComponent } from './components/pathway-record/pathway-record.component';


const routes: Routes = [
    {
        path: '',
        component: AdminPageComponent,
        children: [
            {
                path: 'dashboard',
                component: DashboardComponent
            },
            {
                path: 'users',
                component: UsersComponent
            },
            {
                path: 'users/:uid',
                component: UserProfileComponent
            },
            {
                path: 'users/:uid/edit',
                component: UserProfileEditComponent
            },
            {
                path: 'pathways',
                component: PathwaysComponent
            },
            {
                path: 'pathways/add',
                component: PathwayAddComponent
            },
            {
                path: 'pathways/:pid',
                component: PathwayComponent
            },
            {
                path: 'pathways/:pid/edit',
                component: PathwayEditComponent
            },
            {
                path: 'pathways/:pid/upload',
                component: PathwayUploadComponent
            },
            {
                path: 'pathways/:pid/reorder',
                component: PathwayReorderComponent
            },
            {
                path: 'pathways/:pid/preview',
                component: PathwayPreviewComponent
            },
            {
                path: 'pathways/:pid/record',
                component: PathwayRecordComponent
            },
            {
                path: '**',
                redirectTo: 'dashboard'
            }
        ]
    }
];

export const AdminRoutingModule = RouterModule.forChild(routes);
