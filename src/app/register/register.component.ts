import { Component } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { UserService } from '../core/user.service';
import { Router, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  registerForm: FormGroup;
  errorMessage = '';
  successMessage = '';
  providerErrorMessage = '';
  showErrorField = false;
  showSuccessField = false;
  showSpinner = false;
  providerError = false;

  constructor(
    public authService: AuthService,
    public userService: UserService,
    private router: Router,
    private fb: FormBuilder,
    public db: AngularFirestore
  ) {
    this.createForm();
   }

   createForm() {
     this.registerForm = this.fb.group({
       email: ['', Validators.required ],
       password: ['', Validators.required]
     });
   }

   tryFacebookLogin() {
     this.authService.doFacebookLogin()
     .then(res => {
       this.router.navigate(['/user']);
     }, err => {
       console.log(err);
       this.errorMessage = err.message;
       this.successMessage = '';

       this.userService.searchEmails(err.email)
       .subscribe(res => {
         console.log(res[0]['provider']);
         this.providerError = true;
         this.providerErrorMessage = 'According to our records, you previously registered via ' +
         res[0]['provider'].slice(0, -3).toUpperCase() +
         ' Please navigate to the login page and ' +
         'select "Sign In with ' + res[0]['provider'].slice(0, -3).toUpperCase() + '", to log back in.';
       });

       this.showErrorField = true;
       if (this.showErrorField === true) {
         setTimeout(() => {
           this.showErrorField = false;
           this.providerError = false;
       }, 15000);
       }
      });
   }

   tryTwitterLogin() {
     this.authService.doTwitterLogin()
     .then(res => {
       this.router.navigate(['/user']);
     }, err => {
      console.log(err);

      this.userService.searchEmails(err.email)
      .subscribe(res => {
        console.log(res[0]['provider']);
        this.providerError = true;
        this.providerErrorMessage = 'According to our records, you previously registered via ' +
        res[0]['provider'].slice(0, -3).toUpperCase() +
        ' Please navigate to the login page and ' +
        'select "Sign In with ' + res[0]['provider'].slice(0, -3).toUpperCase() + '", to log back in.';
      });
      this.errorMessage = err.message;
      this.successMessage = '';

      this.showErrorField = true;
      if (this.showErrorField === true) {
       setTimeout(() => {
         this.showErrorField = false;
         this.providerError = false;
     }, 15000);
     }
    });
   }

   tryGoogleLogin() {
     this.authService.doGoogleLogin()
     .then(res => {
       this.router.navigate(['/user']);
     }, err => {
       console.log(err);

       this.userService.searchEmails(err.email)
       .subscribe(res => {
         console.log(res[0]['provider']);
         this.providerError = true;
         this.providerErrorMessage = 'According to our records, you previously registered via ' +
         res[0]['provider'].slice(0, -3).toUpperCase() +
         ' Please navigate to the login page and ' +
         'select "Sign In with ' + res[0]['provider'].slice(0, -3).toUpperCase() + '", to log back in.';
       });

       this.errorMessage = err.message;
       this.successMessage = '';
       this.showErrorField = true;
       if (this.showErrorField === true) {
         setTimeout(() => {
           this.showErrorField = false;
           this.providerError = false;
       }, 15000);
       }
      });
   }

   tryRegister(value) {
     this.authService.doRegister(value)
     .then(res => {
       console.log(res);

       const userData = this.db.collection('users').doc(res.user.uid);

       userData.set({
           name: res.user.displayName,
           email: res.user.email,
           photoUrl: res.user.photoURL,
           emailVerified: res.user.emailVerified
        });

       this.errorMessage = '';
       this.successMessage = 'Your account has been created!';
       this.showSpinner = true;

       this.showSuccessField = true;
       if (this.showSuccessField === true) {
         setTimeout(() => {
           this.showSuccessField = false;
          }, 5000);
        }
       if (res.user.displayName === null) {
        setTimeout(() => {
          this.router.navigate(['/user']);
        }, 5000);
      } else {
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 5000);
      }}, err => {
       console.log(err);
       this.errorMessage = err.message;
       this.successMessage = '';

       this.showErrorField = true;
       if (this.showErrorField === true) {
         setTimeout(() => {
           this.showErrorField = false;
       }, 5000);
       }
      });
    }
  }
