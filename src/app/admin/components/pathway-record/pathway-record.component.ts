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
  mediaRecorder: MediaRecorder;
  chunks = [];
  videoURL = '';
  pathwayId: string;
  countdownValue = 0;

  @ViewChild('videoRecorder', {static: true}) videoRecorder: HTMLVideoElement;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ngZone: NgZone,
    private storage: AngularFireStorage
  ) { }

  ngOnInit() {
    this.pathwayId = this.route.snapshot.paramMap.get('pid');
    this.videoRecorder.onloadedmetadata = (e) => {
      this.videoRecorder.onloadedmetadata = null;
      this.videoRecorder.currentTime = 0;
    };
  }

  captureScreen() {
    this.invokeGetDisplayMedia((stream: any) => {
      this.videoStream = stream;
      if (this.videoRecorder.duration === Infinity) {
        this.videoRecorder.currentTime = 1e101;
      }
      this.mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp8, opus' });
      this.mediaRecorder.ondataavailable = (e) => {
        console.log('ondataavailable', e);
        this.chunks.push(e.data);
      };
      this.mediaRecorder.onstop = (e) => {
        console.log('onstop', e);
        this.videoStream.getTracks().forEach(track => {
          console.log(track);
          track.stop();
        });
        const blob = new Blob(this.chunks, { type : 'video/webm' });
        const downloadLink = document.createElement('a');
        const url = URL.createObjectURL(blob);
        downloadLink.href = url;
        downloadLink.download = 'test.webm';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        setTimeout(() => {
          document.body.removeChild(downloadLink);
          window.URL.revokeObjectURL(url);
        }, 100);
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

  get status() {
    try {
      return this.mediaRecorder.state;
    } catch {
      return undefined;
    }
  }

  startRecording() {
    console.log('Started recording');
    if (this.mediaRecorder.state === 'inactive') {
      const delay = time => new Promise(resolve => setTimeout(resolve, time));
      this.countdownValue = 5;
      delay(1000).then(() => {
        this.countdownValue = 4;
        delay(1000).then(() => {
          this.countdownValue = 3;
          delay(1000).then(() => {
            this.countdownValue = 2;
            delay(1000).then(() => {
              this.countdownValue = 1;
              delay(1000).then(() => {
                this.countdownValue = 0;
                this.mediaRecorder.start();
              });
            });
          });
        });
      });
      
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

  delay(duration: number, func) {
    return new Promise((resolve) => {
        setTimeout(resolve.bind(null, func), duration)
    });
 }
}
