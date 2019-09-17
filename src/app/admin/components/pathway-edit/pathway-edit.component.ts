import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { User } from 'src/app/model/user';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { AngularFireStorage, AngularFireUploadTask, AngularFireStorageReference } from '@angular/fire/storage';
import { PathwayService } from 'src/app/services/pathway.service';
import { Pathway } from 'src/app/model/pathway';
import { DocumentReference } from '@angular/fire/firestore';
import { finalize } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-pathway-edit',
  templateUrl: './pathway-edit.component.html',
  styleUrls: ['./pathway-edit.component.scss']
})
export class PathwayEditComponent implements OnInit {

  pathwayAddForm: FormGroup;
  user: User = new User();
  pathway: Pathway = new Pathway();
  uploadPercent$: Observable<number>;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private pathwayService: PathwayService,
    private router: Router,
    private ngZone: NgZone,
    private storage: AngularFireStorage
  ) { }

  ngOnInit() {
    this.pathwayAddForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
    });
    this.authService.signinAsLucas().then(() => {
      const uid = this.authService.currentUserId;
      this.userService.getUser(uid).subscribe(user => {
        this.user = user;
      });
    });
  }

  save(closeForm: boolean): void {
    const changes = this.pathwayAddForm.value;
    console.log(this.pathway.id);
    if (this.pathway.id !== undefined) {
      this.pathwayService.update(
        this.pathway.id, {
        uid: this.user.uid,
        title: changes.title,
        description: changes.description,
        imageUrl: this.pathway.imageUrl || ''
      }).subscribe((docRef: DocumentReference) => {
          console.log('Updated user pathway');
          if (closeForm) {
            this.close();
          }
        });
    } else {
      this.pathwayService.add({
        uid: this.user.uid,
        title: changes.title,
        description: changes.description,
        imageUrl: this.pathway.imageUrl || ''
      }).subscribe((docRef: DocumentReference) => {
          console.log('Saved user pathway');
          this.pathway.id = docRef.id;
          if (closeForm) {
            this.close();
          }
        });
    }
  }

  uploadImage(event): void {
    this.save(false);
    const file: File = event.target.files[0];
    const filePath = `pathways/${this.pathway.id}/${file.name}`;
    const metadata = {
      contentType: 'image',
      cacheControl: 'public, max-age=31536000',
    };
    const task: AngularFireUploadTask = this.storage.upload(filePath, file);
    this.uploadPercent$ = task.percentageChanges();
    task.snapshotChanges().pipe(finalize(() => {
        const fileRef: AngularFireStorageReference = this.storage.ref(filePath);
        fileRef.updateMetadata(metadata).subscribe();
        fileRef.getDownloadURL().subscribe(fileUrl => {
          this.pathwayService.update(this.pathway.id, { imageUrl: fileUrl })
          .subscribe(() => {
            this.pathway.imageUrl = fileUrl;
            console.log('Saved user pathway image url');
          });
        });
      })).subscribe();
  }

  close() {
    this.ngZone.run(() => this.router.navigate([`/admin/pathways`]));
  }
}

