/// <reference types="@types/dom-mediacapture-record" />
import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask, AngularFireStorageReference } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pathway-record',
  templateUrl: './pathway-record.component.html',
  styleUrls: ['./pathway-record.component.scss']
})
export class PathwayRecordComponent implements OnInit {

  videoStream: MediaStream = null;
  videoStreamRecorder: any;
  mediaRecorder: MediaRecorder;
  chunks = [];
  videoURL: any;
  pathwayId: string;
  @ViewChild('videoRecorder', {static: true}) videoRecorder;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ngZone: NgZone,
    private storage: AngularFireStorage
  ) { }

  ngOnInit() {
    this.pathwayId = this.route.snapshot.paramMap.get('pid');
  }

  captureScreen() {
    this.invokeGetDisplayMedia((stream: any) => {
      this.videoStream = stream;
      this.mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9' });
      this.mediaRecorder.ondataavailable = (e) => {
        console.log('ondataavailable', e);
        this.chunks.push(e.data);
      };
      this.mediaRecorder.onstop = (e) => {
        console.log('onstop', e);
        const blob = new Blob(this.chunks, { type : 'video/webm' });
        const task: AngularFireUploadTask = this.storage.upload('videos/test.webm', blob);
        task.snapshotChanges().pipe(finalize(() => {
          const fileRef: AngularFireStorageReference = this.storage.ref('videos/test.webm');
          fileRef.getDownloadURL().subscribe(fileUrl => {
            this.videoURL = fileUrl;
          });
        })).subscribe();

      };
    }, (error: any) => {
      console.log('Got an error!', error);
    });
  }

  startRecording() {
    console.log('Started recording');
    if (this.mediaRecorder.state === 'inactive') {
      this.mediaRecorder.start();
    } else if (this.mediaRecorder.state === 'paused') {
      this.mediaRecorder.resume();
    }
  }

  pauseRecording() {
    console.log('Paused recording');
    this.mediaRecorder.pause();
  }

  stopRecording() {
    console.log('Stopped recording');
    console.log(this.mediaRecorder.requestData());
    this.mediaRecorder.stop();
    this.videoStream.getTracks().forEach(track => {
      console.log(track);
      track.stop();
    });
    // this.videoStream = null;
  }

  invokeGetDisplayMedia(success, error) {

    const displaymediastreamconstraints = {
        video: true,
        audio: true
    };

    const navigatorWrapper = navigator as any;
    const mediaDevicesWrapper = navigator.mediaDevices as any;

    if (mediaDevicesWrapper.getDisplayMedia) {
      mediaDevicesWrapper.getDisplayMedia(displaymediastreamconstraints).then(success).catch(error);
    } else {
      navigatorWrapper.getDisplayMedia(displaymediastreamconstraints).then(success).catch(error);
    }
  }

  close() {
    this.ngZone.run(() => this.router.navigate([`/admin/pathways/${this.pathwayId}`]));
  }  
}
