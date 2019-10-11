import { Component, OnInit } from '@angular/core';
import { YoutubeService } from 'src/app/services/youtube.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  message: string;
  videos = [];

  constructor(
    private youtubeService: YoutubeService
  ) { }

  ngOnInit() {
    this.message = this.youtubeService.getMessage();
    this.youtubeService.getVideosForChannel('UC_LtA_EtCr7Jp5ofOsYt18g', 10)
      .subscribe(list => {
        for(let item of list["items"]) {
          console.log(item);
          this.videos.push(item);
        }
      });
  }

}
