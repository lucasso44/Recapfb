import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PathwayService } from 'src/app/services/pathway.service';
import { Pathway } from 'src/app/model/pathway';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Observable, from } from 'rxjs';
import { AngularFireStorage, AngularFireUploadTask, AngularFireStorageReference } from '@angular/fire/storage';
import { finalize, map, first } from 'rxjs/operators';
import { Video, VideoUploader } from 'src/app/model/video';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { convertSnaps } from 'src/app/core/utils';

@Component({
  selector: 'app-pathway-preview',
  templateUrl: './pathway-preview.component.html',
  styleUrls: ['./pathway-preview.component.scss']
})
export class PathwayPreviewComponent implements OnInit {

  videos: Video[] = [new Video()];
  currentVideoIndex = 0;
  pathway: Pathway = new Pathway();
  pathwayId: string;

  @ViewChild('videoPlayer', {static: true}) videoPlayer;

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
    this.getVideos().subscribe(videos => {
      this.videos = videos;
    });
    this.videoPlayer.nativeElement.addEventListener('ended', () =>
      this.currentVideoIndex = this.videos.length === this.currentVideoIndex ? 0 : this.currentVideoIndex + 1);
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

  playVideo(videoIndex: number) {
    this.currentVideoIndex = videoIndex;
  }

  close() {
    this.ngZone.run(() => this.router.navigate([`/admin/pathways/${this.pathwayId}`]));
  }
}
