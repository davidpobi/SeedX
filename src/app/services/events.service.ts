import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore  } from '@angular/fire/firestore';
import 'rxjs/add/observable/of';
import { IEvent} from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  event: IEvent;
  constructor(public firebaseAuth: AngularFireAuth, private db: AngularFireDatabase, private afs: AngularFirestore,  private af: AngularFireDatabase) {
    this.event = null;
   }


   
   getEvents() {
    return this.db.object('events').valueChanges();
  }


   getEvent() {
    console.log(3);
     return this.event;
   }
}
