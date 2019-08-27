import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot , RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

@Injectable()
export class RoleGuardService implements CanActivate {

  constructor(public auth: AuthService, public router: Router) { }

   canActivate( next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
   try {
    if (!navigator.onLine) {
      alert('navigator 2 offline');
      this.router.navigate(['/offline']);
      return false;
     } else {
    // const expectedRole = next.data.expectedRole;
      return this.auth.user
     .map(user => _.has(_.get(user, 'roles'), 'admin'))
     .do(authorized => {
       if (!authorized) {
         console.log(authorized);
         console.log('route prevented!')
          this.router.navigate(['/enter']);
       } else {
         console.log('route authorized!')
       }
     },(e) => {
       console.log(e);
     },() => {
       
     })

     //return true;
    }
    
    }
  catch(err) {
    alert(err);
  }
}

}
