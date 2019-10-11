import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {from, Observable, of} from 'rxjs';
import {first, map} from 'rxjs/operators';
import { convertSnaps } from '../core/utils';

@Injectable({
  providedIn: 'root'
})
export class YoutubeService {

    apiKey = 'AIzaSyAQUWv9NjXZO4zQsSGUX0EoERxwhTEYIbE';

    constructor(private http: HttpClient) {
    }

    getMessage(): string {
        return 'Hello World!';
    }

    getVideosForChannel(channel: string, maxResults: number): Observable<object> {
        const url = 'https://www.googleapis.com/youtube/v3/search?key=' + this.apiKey +
            '&channelId=' + channel + '&order=date&part=snippet &type=video,id&maxResults=' + maxResults;
        return this.http.get(url)
          .pipe(map((res) => {
            return res;
          }));
    }
}
