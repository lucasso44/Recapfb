import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreModule } from '../core/core.module';
import { MaterialModule } from '../core/material.module';

import { HeaderComponent } from './components/header/header.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AdminPageComponent } from './components/admin-page/admin-page.component';
import { AdminRoutingModule } from './admin-routing.module';
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



@NgModule({
  declarations: [
    HeaderComponent,
    DashboardComponent,
    AdminPageComponent,
    UsersComponent,
    UserProfileComponent,
    UserProfileEditComponent,
    PathwayAddComponent,
    PathwayEditComponent,
    PathwaysComponent,
    PathwayComponent,
    PathwayUploadComponent,
    PathwayReorderComponent,
    PathwayPreviewComponent,
    PathwayRecordComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    CoreModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
