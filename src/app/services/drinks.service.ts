import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore  } from '@angular/fire/firestore';
import 'rxjs/add/observable/of';
import { IDrink} from '../models/interfaces';
@Injectable({
  providedIn: 'root'
})
export class DrinksService {

  drink: IDrink
  constructor(public firebaseAuth: AngularFireAuth, private db: AngularFireDatabase, private afs: AngularFirestore,  private af: AngularFireDatabase) {
    this.drink = null;
   }



   getDrinks() {
     return this.db.object('drinks').valueChanges();
   }

   

   getDrink() {
     return this.drink;
   }


   getDrinkData(drinkId: string) {
    return this.db.object('drinks/' + drinkId + '/ratings').valueChanges();

  }
}
