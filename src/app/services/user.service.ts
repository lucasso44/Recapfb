import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../model/user';

import {from, Observable, of} from 'rxjs';
import {first, map} from 'rxjs/operators';
import { convertSnaps } from '../core/utils';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private afs: AngularFirestore) { }

  getUsers(): Observable<User[]> {
    return this.afs.collection(
        'users',
            ref => ref.orderBy('displayName')
        )
        .snapshotChanges()
        .pipe(
            map(snaps => convertSnaps<User>(snaps)),
            first());
  }

  getUser(uid: string) {
    const userDoc = this.afs.doc<User>(`users/${uid}`);
    return userDoc.valueChanges();
  }

  save(uid: string, changes: Partial<User>): Observable<any> {
    return from(this.afs.doc(`users/${uid}`).update(changes));
  }
}
