import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../../environments/environment';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatVideoModule } from 'mat-video';

@NgModule({
  imports: [
    FormsModule,
    NgbModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    ReactiveFormsModule,
    MatVideoModule
  ],
  providers: [
    AngularFirestore,
    AngularFireStorage
  ],
  exports: [
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    MatVideoModule
  ]
})
export class CoreModule {}
