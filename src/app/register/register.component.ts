import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Component } from '@angular/core';
import { AuthService } from '../core/auth.service'
import { Router, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { routerNgProbeToken } from '@angular/router/src/router_module';
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
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    public authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    public db: AngularFirestore
  ) {
    this.createForm();
   }

   createForm() {
     this.registerForm = this.fb.group({
       email: ['', Validators.required ],
       password: ['',Validators.required]
     });
   }

   tryFacebookLogin(){
     this.authService.doFacebookLogin()
     .then(res =>{
       this.router.navigate(['/user']);
     }, err => console.log(err)
     )
   }

   tryTwitterLogin(){
     this.authService.doTwitterLogin()
     .then(res =>{
       this.router.navigate(['/user']);
     }, err => console.log(err)
     )
   }

   tryGoogleLogin(){
     this.authService.doGoogleLogin()
     .then(res =>{
       this.router.navigate(['/user']);
     }, err => console.log(err)
     )
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

       this.errorMessage = "";
       this.successMessage = "Your account has been created";

       if (res.user.displayName === null) {
          setTimeout(() => {
            this.router.navigate(['/user']);
          }, 5000);
       } else {
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 5000);
       }
     }, err => {
       console.log(err);
       this.errorMessage = err.message;
       this.successMessage = "";
     })
   }

}
