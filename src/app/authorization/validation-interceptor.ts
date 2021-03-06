import { Injectable } from '@angular/core';
import { HttpEvent, 
         HttpInterceptor, 
         HttpHandler, 
         HttpRequest, 
         HttpResponse, 
         HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

import { AuthService } from './authorization.service';

// setup to route properly for validation

@Injectable()
export class ValidationInterceptor implements HttpInterceptor {

  constructor(private router: Router, private auth: AuthService) {}

  nav(location: string){
    this.router.navigate([location]);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${this.auth.getToken()}`
      }
    });

    return next.handle(req).do((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse && event.body && event.body.message === 'Authorized') {
        this.auth.setToken(event.body.token);
      }
    }, (err: any) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          // redirect to the login route
          this.nav('/login');
          // and show a modal
        }
      }
    });
  }
}