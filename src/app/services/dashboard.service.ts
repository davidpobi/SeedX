import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore  } from '@angular/fire/firestore';
import 'rxjs/add/observable/of';
import {INight} from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  night: INight;
  constructor( public firebaseAuth: AngularFireAuth, private db: AngularFireDatabase, private afs: AngularFirestore,  private af: AngularFireDatabase, private router: Router) {
  this.night = null;
  }



  getNightData() {
    const date = this.getDate();
    console.log(date);
    return this.db.object('nights/'+ '15-8-2019').valueChanges();
  }



  getDate() {
    const d = new Date();
    //create new workday when necessary
    const hrOfDay = d.getHours();
    console.log(hrOfDay);
    let date = null;
    if(12 <= hrOfDay && hrOfDay < 24) {
       date = d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear()
      console.log(date);
      console.log(hrOfDay);
      console.log('New Day: ' + date); //save day date4
    }
  
    if(hrOfDay < 24 && hrOfDay > 13) {
      date = (d.getDate() - 1) + '-' + (d.getMonth() + 1)  + '-' + d.getFullYear()
      console.log(date);
      console.log('Same Day: ' + date); //save day date4
    }
    console.log(date);
    return date;
  }

}
