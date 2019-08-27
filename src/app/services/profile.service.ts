import { Injectable } from '@angular/core';
import {  Observable,of, throwError } from 'rxjs';
import {  Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { AngularFirestore, AngularFirestoreCollection  } from '@angular/fire/firestore';
import {IClient, IUser, User} from '../models/interfaces';
import { switchMap, catchError} from 'rxjs/operators';
import 'rxjs/add/observable/of';
import { AuthService} from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  userId: string;
  constructor(private auth: AuthService, public firebaseAuth: AngularFireAuth, private db: AngularFireDatabase, private afs: AngularFirestore,  private af: AngularFireDatabase, private router: Router) { 
    this.userId = this.auth.userId;
  }



  getUserData(){
 return this.db.object('users_/' + this.userId).valueChanges();
  }



  getUserVisit() {
   return this.db.object('visits/'+ this.userId + '/visitCount').valueChanges();
  }

}
