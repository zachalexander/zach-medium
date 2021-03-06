import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import {
  AngularFirestore
} from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';

interface User {
  uid: string;
  email?: string | null;
  photoURL?: string | null;
  displayName?: string | null;
  age?: number;
}

@Injectable()
export class UserService {
  user: Observable<User>;
  constructor(
   public db: AngularFirestore,
   public afAuth: AngularFireAuth
 ) {}

  getCurrentUser() {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().onAuthStateChanged(function(user){
        if (user) {
          resolve(user);
        } else {
          reject('No user logged in');
        }
      });
    });
  }

  searchUsernames(value) {
    return this.db.collection('users', ref =>
    ref.where('username', '==', value)).snapshotChanges();
  }

  searchEmails(value) {
    return this.db.collection('users', ref =>
    ref.where('email', '==', value)).valueChanges();
  }

  getCustomUserData(value) {
    return new Promise<any> ((resolve, reject) => {
      this.db.collection('users').doc(value).valueChanges()
      .subscribe(snapshots => {
        resolve(snapshots);
      });
    });
  }

  sendPasswordUpdateEmail(emailAddress) {
    return new Promise<any> ((resolve, reject) => {
    firebase.auth().sendPasswordResetEmail(emailAddress).then(function() {
      resolve('success!');
    }).catch(function(error) {
      resolve(error);
    });
   });
  }
}
