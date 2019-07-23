import { UserService } from './../core/user.service';
import { Component } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { Router, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';

@Component({
  selector: 'page-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.scss']
})
export class LoginComponent {

  loginForm: FormGroup;
  errorMessage = '';

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
      console.log(res);
      if (res.additionalUserInfo.isNewUser === true) {
        this.router.navigate(['/user']);
      } else {
        this.router.navigate(['/home']);
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
    });
  }

  tryLogin(value) {
    this.authService.doLogin(value)
    .then(res => {
      this.router.navigate(['/home']);
    }, err => {
      console.log(err);
      this.errorMessage = err.message;
    });
  }

}
