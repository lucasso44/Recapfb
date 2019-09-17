import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { User } from '../model/user';
import { Md5 } from 'ts-md5/dist/md5';

import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user: Observable<User>;
  private authState: any = null;
  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore) {
      this.loadUser();
      this.afAuth.authState.subscribe(user => this.authState = user);
  }

  get isAuthenticated(): boolean {
    return this.authState != null;
  }

  get currentUserId(): string {
    return this.isAuthenticated ? this.authState.uid : null;
  }

  get currentUser(): Observable<User> {
    return this.isAuthenticated ? this.user : null;
  }

  signin(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .catch((error) => console.log('Signin error', error.message));
  }

  signinAsLucas() {
    return this.afAuth.auth.signInWithEmailAndPassword('lucaslawes@gmail.com', 'Creative1!!')
      .catch((error) => console.log('Signin error', error.message));
  }

  signup(displayName: string, email: string, password: string): Promise<void> {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(userData => this.addUser(displayName, userData))
      .then(() => console.log(`Account created for ${displayName}`))
      .then(() => {
        this.afAuth.auth.currentUser.sendEmailVerification()
          .then(() => console.log(`Verification email sent to ${this.afAuth.auth.currentUser.email}`))
          .catch(error => console.log('Sign up', error.message));
      })
      .catch(error => console.log('Sign up', error.message));
  }

  signout() {
    this.afAuth.auth.signOut();
  }

  addUser(displayName: string, userData: any): Promise<void> {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${userData.user.uid}`);
    const data = {
      uid: userData.user.uid,
      email: userData.user.email || null,
      displayName: userData.user.displayName || displayName,
      photoUrl: userData.user.photoURL ||
      'http://www.gravatar.com/avatar/' + Md5.hashStr(userData.user.uid) + '?d=identicon'
    };
    return userRef.set(data, { merge: true });
  }

  loadUser() {
    this.user = this.afAuth.authState.pipe(switchMap(user => {
      if (user) {
        return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
      } else {
        return of(null);
      }
    }));
  }
}
