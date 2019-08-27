import { Component, OnInit, AfterViewInit, OnDestroy, NgZone} from '@angular/core';
import {Location} from '@angular/common';
import { Event, NavigationCancel,NavigationEnd,NavigationError,NavigationStart,Router, RouterOutlet} from '@angular/router';
import { AngularFireDatabase} from '@angular/fire/database';
import {  Subscription } from 'rxjs/Subscription';
// interface NetworkStatus {
//   connected : boolean;
//   connectionType : any;
//   }

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [ // <-- add your animations here
    // fader,
    // slider,
    // transformer,
   // stepper
  ]
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {

  title = 'seedx';
  loading: boolean = false;
  subscriptions: Array<Subscription>;
  constructor(private zone: NgZone, private db: AngularFireDatabase, private router: Router, private _location: Location) {
    this.subscriptions = [];
    // this.zone.onError.subscribe((e) => {
    //   console.log(e);
    // });  

    const sub$ = this.router.events.subscribe((event: Event) => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.loading = true;
          break;
        }

        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.loading = false;
          break;
        }
        default: {
          break;
        }
      }
    });

    console.log('ddddd');
    this.zone.onError.subscribe(this.onZoneError);
    this.zone.onUnstable.subscribe(this.onZoneUnstable);
    this.subscriptions.push(sub$);
  }



  async ngOnInit() {
    try {

    } catch(e) {
    alert(e);
    }
  } 

 

  async ngAfterViewInit() {

  }



  ngOnDestroy() {
    this.subscriptions.forEach((x) => {
      x.unsubscribe();
    });
  }


  onZoneError(error) {
  console.log(error instanceof Error);
  }


  onZoneUnstable(error) {
   // alert(error instanceof Error);
  }


  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
