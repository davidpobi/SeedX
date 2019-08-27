import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor ,
    HttpErrorResponse, HttpHeaders , HttpResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  token: string;
  // cachedRequests: Array<HttpRequest<any>> = [];

  constructor() {


  }

  getToken() {
    this.token = sessionStorage.getItem('token');
    if ( this.token === null) {
      console.log('token is null');
   return this.token = 'token';
    } else {
      console.log('token is NOT null');
    return this.token;
    }
}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  console.log('interceptING with ' + this.getToken());
  const  newRequest = request.clone({
    headers: request.headers.set('Authorization', 'Bearer ' + this.getToken()),
    withCredentials: true,
   // .set('Access-Control-Allow-Credentials', 'true')
  });

  console.log(newRequest);
  console.log(newRequest.body);
  return next.handle(newRequest).do((event: HttpEvent<any>) => {
    if (event instanceof HttpResponse) {
      console.log(' authorized');
      // do stuff with response if you want
    }
  }, (err: any) => {
    if (err instanceof HttpErrorResponse) {
      if (err.status === 401) {
        console.log('not authorized');
       // this.collectFailedRequest(newRequest);
        // redirect to the login route
        // or show a modal
      }
    }
  });
  }


collectFailedRequest(request): void {
  //  this.cachedRequests.push(request);
}



retryFailedRequests(): void {
  // retry the requests. this method can
  // be called after the token is refreshed
}

}
