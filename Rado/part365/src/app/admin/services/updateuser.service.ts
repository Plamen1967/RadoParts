import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment.prod';
import { User } from '@model/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpdateUserService {
  private http = inject(HttpClient);
  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'accept': '*/*'
    })
  }

  constructor() { 
    console.log('UpdateUserService constructor')
  }
  
  updateUser(user: User): Observable<boolean> {
    return this.http.post<boolean>(`${environment.restAPI}/users/updateUser`, JSON.stringify(user), this.httpHeader);
  }

  deleteUser(userId: number) {
    return this.http.post(`${environment.restAPI}/users/deleteUser`, { id: userId }, { responseType: 'text' });
  }

  userPrivate() {
    return this.http.post(`${environment.restAPI}/users/userPrivate`, {}, { responseType: 'text' });
  }

  userDealer() {
    return this.http.post(`${environment.restAPI}/users/userDealer`, {}, { responseType: 'text' });
  }

}
