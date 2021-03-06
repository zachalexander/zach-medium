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
import { ModalModule, ButtonsModule, WavesModule } from 'angular-bootstrap-md';

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
    public db: AngularFirestore,
    public modalModule: ModalModule,
    public buttonsModule: ButtonsModule,
    public wavesModule: WavesModule
  ) {
    this.createForm();
  }

  createForm() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required ],
      password: ['', Validators.required]
    });
  }

  onOpen(event: any) {
    console.log(event);
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
      this.showProviderError(err);
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
      this.showProviderError(err);
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
      this.showProviderError(err);
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

  backtoLogin() {
    this.userForgotPassword = false;
  }

  showProviderError(error) {
    this.userService.searchEmails(error.email)
    .subscribe(res => {
      console.log(res);
      this.providerError = true;
      this.providerErrorMessage = 'It looks like you are trying to log in with a provider using the account' +
      ' associated with this e-mail address: ' +
      error.email + '. If this is correct, please sign in using the e-mail address and password form instead of the' +
      ' provider that you clicked. Otherwise, please sign in using a different e-mail address and/or provider.';

      if (this.providerError === true) {
        setTimeout(() => {
          this.providerError = false;
        }, 10000);
      }
    });
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
