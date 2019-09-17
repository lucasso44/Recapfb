import { Component, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { MatVideoComponent } from 'mat-video/app/video/video.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @ViewChild('video', {static: true}) video;
  constructor(
    private renderer: Renderer2
  ) {
  }

  ngOnInit() {
    this.video.nativeElement.addEventListener('loadedmetadata', () => {
      this.video.nativeElement.currentTime = 50;
    });
    this.video.nativeElement.addEventListener('ended', () => console.log('video ended'));
  }

}
