import { UserService } from './../core/user.service';
import { Component } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { Router, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';

@Component({
  selector: 'page-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.scss']
})
export class LoginComponent {

  loginForm: FormGroup;
  errorMessage = '';
  successMessage = '';
  providerErrorMessage = '';
  showErrorField = false;
  userForgotPassword = false;
  showSuccessField = false;
  providerError = false;
  clickedButton = false;

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
    this.loginForm = this.fb.group({
      email: ['', Validators.required ],
      password: ['', Validators.required]
    });
  }

  tryFacebookLogin() {
    this.authService.doFacebookLogin()
    .then(res => {
      if (res.additionalUserInfo.isNewUser === true) {
        this.router.navigate(['/user']);
      } else {
        this.router.navigate(['/home']);
      }
    }, err => {
      console.log(err);
      this.userService.searchEmails(err.email)
      .subscribe(res => {
        this.providerError = true;
        this.providerErrorMessage = res[0]['provider'] + ' is not correctly referencing your credentials.' +
        ' Please use ' + '"' + err.email + '"' + ' as your e-mail address to log in.';
      });
      this.errorMessage = err.message;
      this.showErrorField = true;
      if (this.showErrorField === true) {
        setTimeout(() => {
          this.showErrorField = false;
      }, 30000);
      }
    });
  }

  tryTwitterLogin() {
    this.authService.doTwitterLogin()
    .then(res => {
      console.log(res);
      if (res.additionalUserInfo.isNewUser === true) {
        this.router.navigate(['/user']);
      } else {
        this.router.navigate(['/home']);
      }
    }, err => {
      console.log(err);

      this.userService.searchEmails(err.email)
      .subscribe(res => {
        console.log(res[0]['provider']);
        this.providerError = true;
        this.providerErrorMessage = res[0]['provider'] + ' is not correctly referencing your credentials.' +
        ' Please use ' + '"' + err.email + '"' + ' as your e-mail address to log in.';
      });
      this.errorMessage = err.message;

      this.showErrorField = true;
      if (this.showErrorField === true) {
        setTimeout(() => {
          this.showErrorField = false;
      }, 30000);
      }
    });
  }

  tryGoogleLogin() {
    this.authService.doGoogleLogin()
    .then(res => {
      console.log(res);
      if (res.additionalUserInfo.isNewUser === true) {
        this.router.navigate(['/user']);
      } else {
        this.router.navigate(['/home']);
      }
    }, err => {
      console.log(err);

      this.userService.searchEmails(err.email)
      .subscribe(res => {
        this.providerError = true;
        this.providerErrorMessage = res[0]['provider'] + ' is not correctly referencing your credentials.' +
        ' Please use ' + '"' + err.email + '"' + ' as your e-mail address to log in.';
      });

      this.errorMessage = err.message;
      this.showErrorField = true;
      if (this.showErrorField === true) {
        setTimeout(() => {
          this.showErrorField = false;
      }, 30000);
      }
    });
  }

  tryLogin(value) {
    this.authService.doLogin(value)
    .then(res => {
      console.log(res);
      if (res.additionalUserInfo.isNewUser === true) {
        this.router.navigate(['/user']);
      } else {
        this.router.navigate(['/home']);
      }
    }, err => {
      console.log(err);
      this.errorMessage = err.message;
      this.showErrorField = true;
      if (this.showErrorField === true) {
        setTimeout(() => {
          this.showErrorField = false;
      }, 5000);
      }
    });
  }

  forgotPassword() {
    this.userForgotPassword = true;
  }

  sendPasswordResetEmail(value) {
    this.userService.sendPasswordUpdateEmail(value.email)
    .then(res => {
      if (res === 'success!') {
        this.clickedButton = true;
        this.showSuccessField = true;
        this.successMessage = 'Instructions to update your password have been sent to your e-mail. Please check your inbox!';
        setTimeout(() => {
          location.reload();
        }, 5000);
      } else {
        this.showErrorField = true;
        this.errorMessage = res.message;
        if (this.showErrorField === true) {
          setTimeout(() => {
            this.showErrorField = false;
        }, 5000);
      }
      }
    });


  }

}
