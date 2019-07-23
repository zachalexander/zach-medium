import { Component, OnInit } from '@angular/core';
import { UserService } from '../../core/user.service';
import { AuthService } from '../../core/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseUserModel } from '../../core/user.model';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  user: FirebaseUserModel = new FirebaseUserModel();
  profileForm: FormGroup;
  nonEmailLogin = false;
  updatedName;
  userUid;
  userData;
  customUser: any;
  userName;
  userEmail;
  userProvider;


  constructor(
    public userService: UserService,
    public authService: AuthService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    public db: AngularFirestore
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(routeData => {
      const data = routeData.data;
      if (data) {
        this.user = data;
        this.createForm(this.user.name);
      }
      if (data.name === '') {
        this.nonEmailLogin = true;
      }
    });

    this.getuserUid();

  }

  createForm(name) {
    this.profileForm = this.fb.group({
      name: [name, Validators.required ]
    });
  }

  getuserUid() {
    this.userService.getCurrentUser()
    .then(res => {
        this.userUid = res.uid;
        this.getUserData();
    });
  }
/// START HERE

  getUserData() {
    this.userService.getCustomUserData(this.userUid)
    .then(result => {
      this.userData = result;
      this.userName = this.userData.username;
      this.userEmail = this.userData.email;
      this.userProvider = this.userData.provider;
      console.log(this.userData);
    });
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
