import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {AuthService } from '../services/auth.service';
import { switchMap} from 'rxjs/operators';
import {  Subscription } from 'rxjs/Subscription';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {

  offlineState: boolean;
  emailString: string;
  passwordString: string;
  loginState: boolean;
  subscriptions: Array<Subscription>;
  constructor(private router: Router, private route: ActivatedRoute, private auth: AuthService) { 
    this.offlineState = false;
    this.emailString = null;
    this.passwordString = null;
    this.loginState = null;
    this.subscriptions = [];
    const sub$ = auth.user.subscribe((auth) => {
      if(auth !== null) {
   //     this.router.navigate(['play']);
      } else {
      }
    });
  this.subscriptions.push(sub$);
 
  }

  ngOnInit() {
    if (!navigator.onLine) {
      this.offlineState = true;
      //    alert('offline');
     // this.router.navigate(['/enter']);
          // Handle offline error
        } else {
      this.offlineState = false;
         // alert('online');
          // Handle Http Error (error.status === 403, 404...)
        }
  }


  ngAfterViewInit() {

  }


  ngOnDestroy() {
  this.subscriptions.forEach((x) => {
  x.unsubscribe();
  });
  }




  
  signInWithEmail(event) {
    event.preventDefault();
    const passString = "seedx";
   // const password = this.passwordString + passString;
   // console.log(password);
    this.auth.clientLogin(this.emailString, this.passwordString).then((state)=> {
      console.log('state is ' + state);
      if(state === true ){
        this.loginState = true;
      } else 
      {
        this.loginState = false;
      }
    }).catch((error) => {

      console.log(error);


        });
  }


  checkPin($event) {
    $event.preventDefault();

    console.log(this.passwordString);
    const holdNumb: any = this.passwordString;
    if(isNaN(holdNumb)) {
      console.log('not a number');
      this.passwordString = '';
    }else {
      console.log(' a number');
    }
  }



  logout($event) {
    $event.preventDefault();
    this.auth.logout(); 
  }

}
