import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LoginService {

  constructor(private http: HttpClient) { }

  authenticate(email: string, password: string): Observable<any>{
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    const body = JSON.stringify({ email, password });
    return this.http.post(`/api/authentication/login`, body, { headers })
    .catch(error => Observable.throw(error));
  }

  reset(email: string): Observable<any>{
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    const body = JSON.stringify({ email });
    return this.http.post(`/api/authentication/password-reset`, body, { headers })
    .catch(error => Observable.throw(error));
  }

  changePassword(password: string, passwordResetToken: string): Observable<any>{
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    const body = JSON.stringify({ password, passwordResetToken });
    return this.http.post(`/api/authentication/change-password`, body, { headers })
    .catch(error => Observable.throw(error));
  }

}
