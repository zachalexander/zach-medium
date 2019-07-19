import { Component, OnInit } from '@angular/core';
import { UserService } from '../core/user.service';
import { AuthService } from '../core/auth.service';
import { ActivatedRoute } from '@angular/router';
import {Router} from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseUserModel } from '../core/user.model';
import 'rxjs/add/operator/map';

import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';

@Component({
  selector: 'page-user',
  templateUrl: 'user.component.html',
  styleUrls: ['user.scss']
})

export class UserComponent implements OnInit{


  user: FirebaseUserModel = new FirebaseUserModel();
  profileForm: FormGroup;
  saveClicked = false;
  duplicateName = false;
  usernames;

  constructor(
    public userService: UserService,
    public authService: AuthService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    private router: Router,
    public db: AngularFirestore
    ) {
    }

  ngOnInit(): void {
    this.route.data.subscribe(routeData => {
      const data = routeData.data;
      if (data) {
        this.user = data;
        this.createForm();
      }
    })
  }

  createForm() {
    this.profileForm = this.fb.group({
      name: [name, Validators.required ],
      email: [name, Validators.required]
    });
  }

  save(value) {
    this.checkUsernames(value.name).then(data => {
        if (!Array.isArray(data) || !data.length) {
          this.userService.getCurrentUser()
          .then(res => {
            const customUser = this.db.collection('users').doc(res.uid);
            if (res.email === null) {
              customUser.set({
                email: value.email,
                username: value.name,
              });
            } else {
              customUser.set({
                email: res.email,
                username: value.name,
              });
            }
          });
          this.saveClicked = true;
        } else {
          this.saveClicked = false;
          this.duplicateName = true;
        }
    });
  }

  checkUsernames(value) {
    return new Promise(resolve => {
      this.userService.searchUsernames(value)
      .subscribe(
        data => { resolve(data); });
    });
  }

  startReading() {
    this.router.navigate(['/home']);
  }

  logout() {
    this.authService.doLogout()
    .then((res) => {
      this.location.back();
    }, (error) => {
      console.log('Logout error', error);
    });
  }


}
