import { Injectable } from '@angular/core';
import {  Observable,of, throwError } from 'rxjs';
import {  Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { AngularFirestore, AngularFirestoreCollection  } from '@angular/fire/firestore';
import {IUser, User} from '../models/interfaces';
import { switchMap, catchError} from 'rxjs/operators';
import 'rxjs/add/observable/of';


interface LoginResponse {
  access_token: string;
  userId: string;
  userRole: string;
  userType: string;
  userName: string;
  expires_in: string;
  expires: string;
  token_type: string;
}

export enum UserSetupState {
newUser,
knownUser
}
@Injectable()
export class AuthService {
  userSetupState: UserSetupState;
  actionCodeSettings;
  usersCollection: AngularFirestoreCollection<IUser>;
  userRef:  AngularFireObject<IUser>;
  user: Observable<firebase.User>;
  userId;
  private userContact;
  private authState: firebase.User;
  subscriptions: Array<Subscription>;
  constructor(public firebaseAuth: AngularFireAuth, private db: AngularFireDatabase, private afs: AngularFirestore,  private af: AngularFireDatabase, private router: Router) {
    this.subscriptions = [];
    this.userContact = '';
    this.userSetupState = null;
    try {
    const sub$ = this.firebaseAuth.authState.subscribe((x) => {
      if( x!== null) {
     console.log(x.uid);
     this.userId = x.uid;
     this.authState = x;
      } else {
        console.log('null auth');
      }
    }, (error) => {
      console.log(error);
    });

    this.user = this.firebaseAuth.authState.pipe( 
      catchError(err => {
      console.log('auth state error', err);
      return throwError(err);
    }),  
    switchMap(auth => {
      if (auth) {   
       console.log('userrrrrrr id is set ' + auth.uid);
       this.userId = auth.uid;
        return this.db.object('admin/' + auth.uid).valueChanges();
      } else {
        this.userId = null;
       // this.authState = null;
        return of(null);
      }
    })
    )

    this.subscriptions.push(sub$);

      } catch(err) {
    alert(err);
      }
  }



  createUserWithEmail(email, password) {
    return this.firebaseAuth.auth.createUserWithEmailAndPassword(email, password);
  }



  async saveUserDetails(userId, obj: IUser) {
    console.log(obj);
    const user:any = {
      firstname: obj.firstname,
      lastname: obj.lastname,
      gender: obj.gender,
      email: obj.email,
      contact: obj.contact,
      birthday: obj.birthday,
      photoUrl: obj.photoUrl    
    };

     user.roles =  {user: true};


    const userRef= this.af.object(`admin/${userId}`);
    const userRef2= this.af.object(`admin_/${userId}`);

    await userRef2.update(obj);
    return userRef.update(user);
  }



  async clientLogin(email, password) {
    let state = null;
     await this.firebaseAuth.auth.signInWithEmailAndPassword(email, password).then((result) => {
         console.log('user signed in');
         state = true;
         console.log(result);
         const ref = this.db.object('admin/' + result.user.uid).query.once('value',
          data => {
            console.log(data.val())
         if (data.val() === null) {
          console.log('doesnt exist');
          const userObj: IUser = {
           id: result.user.uid,
           email: result.user.email,
           username: null,
           photoUrl: ''  ,
         }
   
         this.updateUser(userObj);
         } else {
           console.log('data exists');
           this.router.navigate(['work/me']);
         }
         });

       
        })
        .catch(function(error) {
          state = false;
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode === 'auth/wrong-password') {
        alert('Wrong password.');
      } else {
        alert(errorMessage);
      }
      console.log(error);
       });
      return state;   
  }


    
  sendEmailVerificationLink() {
   return this.authState.sendEmailVerification();
   }



  private updateUser(authData: IUser) {
          const userData = new User(authData);
          const user:IUser = {
          email: authData.email,
          username: authData.username
          }
          // users_ public facing aggregates
          const ref_ = this.db.object('admin_/' + authData.id);
          const ref = this.db.object('admin/' + authData.id);  
              ref.update(userData).then(x => {
                console.log('added');
                ref_.update(user).then((x) => {
                  console.log('completed');
                  this.router.navigate(['work/me']);
              });
              })
              .catch(y => {
                console.log(y);
              });
  }



  logout() { 
        this.firebaseAuth.auth.signOut().then(x => {
          console.log('signed out');
          sessionStorage.clear();
        this.router.navigate(['enter']);
        }).catch( y => {
          console.log('error signing out');
        });
       //  this.router.navigate(['main']);
  }



  async addUserPhoto(photoUrl: string) {
     let response = null;
    await this.db.object('admin_/' + this.userId + '/photoUrl').set(photoUrl).then(()=> {
     response = true;
    }).catch((e) => {
      response = false;
    })
    return response;
  }

 }
