import { Observable } from 'rxjs';
import { AngularFireUploadTask } from '@angular/fire/storage';

export class VideoUploader {
    uploadPercent$: Observable<number>;
    task: AngularFireUploadTask;
    video: Video;
}
export class Video {
    id?: string;
    title?: string;
    url?: string;
    filePath?: string;
    pid?: string;
    order?: number;
}
