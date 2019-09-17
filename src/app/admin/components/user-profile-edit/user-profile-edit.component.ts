import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';

import {Observable} from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-user-profile-edit',
  templateUrl: './user-profile-edit.component.html',
  styleUrls: ['./user-profile-edit.component.scss']
})
export class UserProfileEditComponent implements OnInit {

  userProfileEditForm: FormGroup;
  user: User = new User();

  uploadPercent$: Observable<number>;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private storage: AngularFireStorage
  ) {
  }

  ngOnInit() {
    this.userProfileEditForm = this.fb.group({
      displayName: ['', Validators.required],
      bio: ['', Validators.required]
    });
    const uid = this.route.snapshot.paramMap.get('uid');
    this.userService.getUser(uid).subscribe(user => {
      this.user = user;
      this.userProfileEditForm.patchValue({
        displayName: this.user.displayName,
        bio: this.user.bio
      });
    });
  }

  save(): void {
    const changes = this.userProfileEditForm.value;
    this.userService.save(this.user.uid, changes)
      .subscribe(() => {
        console.log('Saved user profile');
        this.close();
      });
  }

  uploadProfileImage(event): void {
    const file: File = event.target.files[0];
    const filePath = `profiles/${this.user.uid}/${file.name}`;
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
          this.userService.save(this.user.uid, { photoUrl: fileUrl })
          .subscribe(() => {
            this.user.photoUrl = fileUrl;
            console.log('Saved user profile photo url');
          });
        });
      })).subscribe();
  }

  close() {
    this.router.navigate([`/admin/users/${this.user.uid}`]);
  }
}
