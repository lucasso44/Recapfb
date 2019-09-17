import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PathwayService } from 'src/app/services/pathway.service';
import { Pathway } from 'src/app/model/pathway';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Observable, from } from 'rxjs';
import { AngularFireStorage, AngularFireUploadTask, AngularFireStorageReference } from '@angular/fire/storage';
import { finalize, map } from 'rxjs/operators';
import { Video, VideoUploader } from 'src/app/model/video';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';

@Component({
  selector: 'app-pathway-upload',
  templateUrl: './pathway-upload.component.html',
  styleUrls: ['./pathway-upload.component.scss']
})
export class PathwayUploadComponent implements OnInit {

  videoUploaders: VideoUploader[] = [];
  pathway: Pathway = new Pathway();
  pathwayId: string;

  constructor(
    private route: ActivatedRoute,
    private pathwayService: PathwayService,
    private fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private afs: AngularFirestore,
    private storage: AngularFireStorage
  ) { }

  ngOnInit() {
    this.pathwayId = this.route.snapshot.paramMap.get('pid');
    this.pathwayService.get(this.pathwayId).subscribe(pathway => this.pathway = pathway);
  }

  uploadVideos(event): void {
    const fileCount = event.target.files.length;
    for (let i = 0; i < fileCount; i++) {
      const file = event.target.files[i];
      const filetype = file.name.split('.')[1];
      const videoUploader = new VideoUploader();
      videoUploader.video = new Video();
      videoUploader.video.title = file.name;
      videoUploader.video.pid = this.route.snapshot.paramMap.get('pid');
      videoUploader.video.order = -1;
      from(this.afs.collection('videos').add({...videoUploader.video})).subscribe((docRef: DocumentReference) => {
        videoUploader.video.id = docRef.id;
        this.videoUploaders.push(videoUploader);
        const filePath = `videos/${videoUploader.video.id}.${filetype}`;
        console.log(filePath);
        const task: AngularFireUploadTask = this.storage.upload(filePath, file);
        videoUploader.uploadPercent$ = task.percentageChanges();
        videoUploader.task = task;
        task.snapshotChanges().pipe(finalize(() => {
            const fileRef: AngularFireStorageReference = this.storage.ref(filePath);
            fileRef.getDownloadURL().subscribe(fileUrl => {
              videoUploader.video.url = fileUrl;
              videoUploader.video.filePath = filePath;
              from(this.afs.doc(`videos/${videoUploader.video.id}`).update({...videoUploader.video})).subscribe(() => {
                console.log('Completed', videoUploader);
              });
            });
          })).subscribe();
      });
    }
  }

  saveVideo(videoUploader: VideoUploader) {
    if (videoUploader.video.id === undefined) {
      return from(this.afs.collection('videos').add({...videoUploader.video}))
        .subscribe((docRef: DocumentReference) => {
          videoUploader.video.id = docRef.id;
      });
    } else {
      return from(this.afs.doc(`videos/${videoUploader.video.id}`).update({...videoUploader.video}));
    }

  }

  cancelUpload(videoUploader: VideoUploader, i: number) {
    videoUploader.task.cancel();
    this.videoUploaders.splice(i, 1);
  }

  close() {
    this.router.navigate([`/admin/pathways/${this.pathwayId}`]);
  }
}
