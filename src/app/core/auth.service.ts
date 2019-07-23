import { Injectable } from "@angular/core";
import 'rxjs/add/operator/toPromise';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import {Router} from '@angular/router';

import { Observable, of } from 'rxjs';
import { switchMap, startWith, tap, filter } from 'rxjs/operators';

interface User {
  uid: string;
  email?: string | null;
  photoURL?: string | null;
  displayName?: string | null;
  provider?: string | null;
}

@Injectable()
export class AuthService {
  user: Observable<User>;

  constructor(
   public afAuth: AngularFireAuth,
   private afs: AngularFirestore,
   private router: Router
 ) {
    this.user = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    )
 }

  doFacebookLogin() {
    return new Promise<any>((resolve, reject) => {
      const provider = new firebase.auth.FacebookAuthProvider();
      provider.addScope('email');
      this.afAuth.auth
      .signInWithPopup(provider)
      .then(res => {
        resolve(res);
        if (res.additionalUserInfo.isNewUser === true) {
          this.updateUserData(res.user);
          // this.router.navigate(['/user']);
        }
      }, err => {
        console.log(err);
        reject(err);
      })
    })
  }

  doTwitterLogin() {
    return new Promise<any>((resolve, reject) => {
      const provider = new firebase.auth.TwitterAuthProvider();
      this.afAuth.auth
      .signInWithPopup(provider)
      .then(res => {
        resolve(res);
        if (res.additionalUserInfo.isNewUser === true) {
          this.updateUserData(res.user);
        }
      }, err => {
        console.log(err);
        reject(err);
      })
    })
  }

  doGoogleLogin() {
    return new Promise<any>((resolve, reject) => {
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      this.afAuth.auth
      .signInWithPopup(provider)
      .then(res => {
        resolve(res);
        if (res.additionalUserInfo.isNewUser === true) {
          this.updateUserData(res.user);
        }
      }, err => {
        console.log(err);
        reject(err);
      })
    })
  }

  private oAuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        console.log(credential.user);
        this.updateUserData(credential.user);
      });
  }

  // Sets user data to firestore after succesful login
  updateUserData(user: User) {
    this.afs.collection('users').doc(user.uid).set({
      username: null,
      email: user.email,
      provider: user['providerData'][0].providerId
    });
  }

  doRegister(value) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
      .then(res => {
        resolve(res);
      }, err => reject(err));
    });
  }

  doLogin(value) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(value.email, value.password)
      .then(res => {
        console.log(res);
        resolve(res);
      }, err => reject(err));
    });
  }

  doLogout() {
    return new Promise((resolve, reject) => {
      if (firebase.auth().currentUser) {
        this.afAuth.auth.signOut();
        resolve();
      } else {
        reject();
      }
    });
  }

}
