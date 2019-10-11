import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreModule } from '../core/core.module';
import { MaterialModule } from '../core/material.module';

import { PortalRoutingModule } from './portal-routing.module';

import { HomeComponent } from './components/home/home.component';
import { PortalComponent } from './components/portal/portal.component';

@NgModule({
  declarations: [
    HomeComponent,
    PortalComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    CoreModule,
    PortalRoutingModule
  ]
})
export class PortalModule { }
