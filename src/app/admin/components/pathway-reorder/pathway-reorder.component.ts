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
import { convertSnaps } from 'src/app/core/utils';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-pathway-reorder',
  templateUrl: './pathway-reorder.component.html',
  styleUrls: ['./pathway-reorder.component.scss']
})
export class PathwayReorderComponent implements OnInit {

  videos: Video[] = [];
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
    this.getVideos().subscribe(videos => this.videos = videos);
  }

  getVideos(): Observable<Video[]> {
    return this.afs.collection(
        'videos',
            ref => ref.orderBy('order').where('pid', '==', this.pathwayId)
        )
        .snapshotChanges()
        .pipe(
            map(snaps => convertSnaps<Video>(snaps)));
  }

  saveOrder() {
    for(let i = 0; i < this.videos.length; i++) {
      const video = this.videos[i];
      const changes = {
        order: i
      };
      from(this.afs.doc(`videos/${video.id}`).update(changes)).subscribe(() => {
      });
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.videos, event.previousIndex, event.currentIndex);
  }

  close() {
    this.router.navigate([`/admin/pathways/${this.pathwayId}`]);
  }
}
