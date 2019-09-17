import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Pathway } from '../model/pathway';

import {from, Observable, of} from 'rxjs';
import {first, map} from 'rxjs/operators';
import { convertSnaps } from '../core/utils';

@Injectable({
  providedIn: 'root'
})
export class PathwayService {

  constructor(
    private afs: AngularFirestore) { }

  getAllPathways(): Observable<Pathway[]> {
    return this.afs.collection(
        'pathways',
            ref => ref.orderBy('title')
        )
        .snapshotChanges()
        .pipe(
            map(snaps => convertSnaps<Pathway>(snaps)));
  }

  getPathways(uid: string): Observable<Pathway[]> {
    return this.afs.collection(
        'pathways',
            ref => ref.orderBy('title').where('uid', '==', uid)
        )
        .snapshotChanges()
        .pipe(
            map(snaps => convertSnaps<Pathway>(snaps)),
            first());
  }

  get(id: string) {
    const doc = this.afs.doc<Pathway>(`pathways/${id}`);
    return doc.valueChanges();
  }

  add(pathway: Partial<Pathway>): Observable<DocumentReference> {
    return from(this.afs.collection(`pathways`).add(pathway));
  }

  update(id: string, changes: Partial<Pathway>): Observable<any> {
    return from(this.afs.doc(`pathways/${id}`).update(changes));
  }

  delete(id: string): Observable<any> {
    return from(this.afs.doc<Pathway>(`pathways/${id}`).delete());
  }
}
