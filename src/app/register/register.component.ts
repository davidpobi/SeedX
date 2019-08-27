import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import {AuthService } from '../services/auth.service';
import { IClient, Gender} from '../models/interfaces';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { finalize, catchError } from 'rxjs/operators';
import {  Subscription } from 'rxjs/Subscription';
import { Observable, throwError } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, AfterViewInit, OnDestroy {

  contactInput: string;  
  emailInput: string;
  firstnameInput: string;
  lastnameInput: string;
  ageInput: number;
  agePass: boolean;
  genderInput: Gender;
  birthdayInput: any;
  passwordString: string;
  passwordString_: string;
  emailVerifyState: boolean = false;
  seedxPin: string; // generated 4 digit pin
  setupLevel: number = 1;

  //
  genderSet: Array<any>;
  //errors
  emailInvalid: boolean = null;
  emailExists: boolean = null;
  firstnameInvalid: boolean = null;
  lastnameInvalid: boolean = null;
  contactInvalid: boolean = null;


  userId: string;
  uploadPercent: Observable<number>;
  uploadPercent_: number;
  downloadURL: Observable<string>;
  subscriptions: Array<Subscription>;
  constructor(private auth: AuthService, public firebaseAuth: AngularFireAuth, private router: Router, private storage: AngularFireStorage) { 
    this.userId = null;
    this.seedxPin = null;
    this.contactInput = null;
    this.emailInput = null;
    this.firstnameInput = null;
    this.lastnameInput = null;
    this.ageInput = null;
    this.agePass = null;
    this.birthdayInput = null;
    this.passwordString = null;
    this.passwordString_ = null;
    this.genderSet = [{name:'Man', key: Gender.Man},{name:'Woman', key: Gender.Woman},{name:'Rather Not Say', key: Gender.Other}];
    this.subscriptions = [];

    try {
    const sub$ =this.firebaseAuth.authState.subscribe((x) => {
   //  console.log(x);
      if(x !== null && x !== undefined) {
        if (x.emailVerified === true) {
          console.log('email is emailVerified');  
        } 
  
        if (x.emailVerified === false) {
          this.verifyEmail().then((x) => {
            console.log('verify email sent');
          })
        } 
      } else {
        console.log('x is null');
      }
      });

      this.subscriptions.push(sub$);
    }catch(err) {
   console.log(err);
    }
  }

  async ngOnInit() {
   // this.auth.logout();
  }



  ngAfterViewInit() {

  }



  async ngOnDestroy() {
  await this.subscriptions.forEach((x) => {
      x.unsubscribe();
    });
  }


   verifyEmail() {
   return this.auth.sendEmailVerificationLink();
   }


    
   async createClient($event) {
     $event.preventDefault();
     let agePass_ = null;
     const obj: IClient = {
      firstname: this.firstnameInput,
      lastname: this.lastnameInput,
      email: this.emailInput,
      contact: this.contactInput,
      gender: this.genderInput,
      birthday: this.birthdayInput,
      photoUrl: null
     }

     console.log(obj);
     agePass_ = this.checkAge($event);
     console.log('password is ' + this.passwordString);
     if(agePass_ === true ) {
       console.log('can sign up');
        await this.auth.createUserWithEmail(this.emailInput, this.passwordString).then(async(x) => {
         console.log(x.user.uid);
         this.userId = x.user.uid;
        await this.auth.saveUserDetails(x.user.uid, obj).then((x) => {
          console.log('added');
          this.setupLevel = 2;
         }).catch((err) => {
           console.log(err);
         })     
       }).catch((err) => {
         console.log(err);
         if(err.code === "auth/email-already-in-use") {
           console.log(err.message);
           this.emailExists = true;
         }
       });
     } else {
      console.log('underage cant sign up');
     }
   }



   checkAge($event) {
    $event.preventDefault();
    let response: boolean = null;
    let age: number = null;
    console.log(this.getAge());
    if(this.getAge() !== null){
      age = Math.abs(this.getAge());

    } else {
      age = null;
    }
    if(age >= 18 && age <= 100) {
      this.ageInput = age;
      console.log('Legal');
      this.agePass = true;
      response = true;
      return response;
    } 

      this.ageInput = age;
      this.agePass = false;
      response = false;
      return response;
   }



   getAge() {
    if(this.birthdayInput !== null){
    const today = new Date();
    const birthDate = new Date(this.birthdayInput);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age = age - 1;
    }

    return age || 0;
  } else {
    console.log('empty');
    this.ageInput = null;
    return null;
  }
   }


   selectGender($event, form) {
     $event.preventDefault();
     this.genderInput = form;
     console.log('form is ' + form);
   }



   async runFileSelect($event) {
     try {
     console.log('s');
     const file = $event.target.files[0];
     console.log(file);

     const filePath = 'ProfilePhotos/' + this.userId + '/photo';
     const fileRef = this.storage.ref(filePath);
     const task = this.storage.upload(filePath, file);
 
        // observe percentage changes
     this.uploadPercent = await task.percentageChanges();
     await this.uploadPercent.subscribe((x: number)=> {
       console.log(x);
       this.uploadPercent_ = Math.floor(x);
       console.log(this.uploadPercent_);
     })
        // get notified when the download URL is available
      const sub$ = await task.snapshotChanges().pipe(
        catchError(err => {
          console.log('auth state error', err);
          return throwError(err);
        }),
        finalize(() =>
          this.downloadURL = fileRef.getDownloadURL()
        )
      )
      .subscribe();

      await task.then(async (y) => {
       console.log(y);
       console.log('done')
       const sub2$ = await this.downloadURL.subscribe(async (x) => {
        console.log('here'); 
        if(x !== null && x !== undefined ) {
        await this.addUserPhoto(x).then((z) => {
          console.log(z); 
          if(z === true){
          console.log('photo url added');
          this.router.navigate(['/work/me']);
          }else { 
            console.log('not yet')
        }

          sub2$.unsubscribe();
          this.subscriptions.push(sub$,sub2$);
        }).catch((e) => {
          console.log(e);
        })
      }
      });
      }).catch(e => {
       console.log(e);
      });
    } catch(err) {
      console.log(err);
    }
   }



   uploadFile($event) {
     $event.preventDefault();
     document.getElementById('imageInput').click();
   }



  async addUserPhoto(photoUrl: string) {
    let response = null;
    await  this.auth.addUserPhoto(photoUrl).then((x)=> {
      console.log(x);
      response = true;
    }).catch((e) => {
      console.log(e);
      response = false;
    });
    return response;
  }
}
