import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class RegistrationService {

  constructor(private http: HttpClient) { }

  createUser(user: any): Observable<any>{
    const body = JSON.stringify({ ...user });
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(`/api/authentication/register`, body, { headers })
    .catch(error => Observable.throw(error));
  }

}
