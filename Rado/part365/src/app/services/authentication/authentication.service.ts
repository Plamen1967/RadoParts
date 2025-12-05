import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '@env/environment';
import { first, map } from 'rxjs/operators';
import { AuthenticatedUser } from '@model/authenticatedUser';
import { User } from '@model/user';
import { UserType } from '@model/enum/userType.enum';
import { UserCountService } from '@services/userCount.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<AuthenticatedUser | undefined>; // Keep inform all subscriptions informed.
  public currentUser: Observable<AuthenticatedUser | undefined>;

  clientId: number = Date.now();
  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'accept': '*/*'
    })
  }  
  constructor(private http: HttpClient, private userCountService: UserCountService) {
    this.currentUserSubject = new BehaviorSubject<AuthenticatedUser | undefined>(JSON.parse(localStorage.getItem('currentUser')!));
    this.currentUser = this.currentUserSubject.asObservable();

  }

  public get currentUserValue(): AuthenticatedUser | undefined {
    return this.currentUserSubject.value;
  }

  public get currentToken(): string {
    return this.currentUserSubject?.value?.token ?? '';
  }

  login(userName: string, password: string) {
    return this.http.post<AuthenticatedUser>(`${environment.restAPI}/users/autenticate`, {userName, password}, this.httpHeader)
          .pipe(map(user => {
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
            this.userCountService.refresh();
            return user;
          }));
  }

  updateUser(user : User) {
    return this.http.post<User>(`${environment.restAPI}/users/updateUser`, user)
          .pipe();
  }

  validateToken() {
    const headers = { 'content-type': 'application/json'};
    return this.http.post<User>(`${environment.restAPI}/users/ValidateJWT`, `"${this.currentUserValue?.token}"`, { headers })
          .pipe(first());
  }

  updatePassword(oldPassword_ : string, password_: string ) {
    return this.http.post(`${environment.restAPI}/users/updatePassword`, {oldPassword : oldPassword_, password : password_ }, this.httpHeader)
          .pipe(first());
  }
  
logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(undefined);
    this.userCountService.fetchUserCount();
  }

  get user() {
    return this.logged;
  }

  get seller() {
    return this.currentUserSubject.value?.dealer === UserType.Dealer;
  }

  get suspended() {
    return this.currentUserSubject.value?.suspended;
  }


  get admin() {
    return this.currentUserSubject.value?.dealer === UserType.Admin ;
  }

  get regionId() {
    return this.currentUserValue?.regionId;
  }
  
  get logged() {
    return this.currentUserValue;
  }
}


