import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { BackendMessage } from '@model/backMessage';
import { Numberparts } from '@model/numberparts';
import { User } from '@model/user';
import { UserCount } from '@model/userCount';
import { UserView } from '@model/userView';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { first, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'accept': '*/*'
    })
  }

  users: User[] = [];
  private userCount?: UserCount;
  public userPageObj = new BehaviorSubject<number>(0);
  public userPage: Observable<number>;

  constructor(private http: HttpClient) { 
    this.userPage = this.userPageObj.asObservable();
  }
  public userViews: UserView[] = [];

  setUserCount(userCount: UserCount) {
    this.userCount = userCount;
  }
  getAll() {
    return this.http.get<User[]>(`${environment.restAPI}/admin/users`);
  }

  getUserCount() {
    return this.http.get<UserCount>(`${environment.restAPI}/users/GetUserCount`);
  }
  
  getUserById(id: number): Observable<User> {
    const user = this.users.find(user => user.userId == id);
    if (user) return of(user);

    return this.http.get<User>(`${environment.restAPI}/users/${id}`)
    .pipe(
      map(res => { this.users.push(res); return res}));
  }

  getUserByDomainName(domainName: string): Observable<UserView> {
    return this.http.get<User>(`${environment.restAPI}/users/getUserByDomainName/${domainName}`)
    .pipe()
  }

  // getUserViewById(id: number) {
  //   const userView = this.userViews.find(user => user.userId == id);
  //   if (userView) return of(userView);

  //   return this.http.get<UserView>(`${environment.restAPI}/users/GetUserView?userId=${id}`)
  //   .pipe(
  //     map(res => 
  //       { 
  //         this.userViews.push(res); 
  //         return res
  //       }));
  // }


  registerUser(user: User): Observable<BackendMessage> {
    return this.http.post<BackendMessage>(`${environment.restAPI}/users/registerUser`, JSON.stringify(user), this.httpHeader).pipe(first());
  }

  getNewUserId(): Observable<number> {
    return this.http.get<number>(`${environment.restAPI}/users/getNewUserId`, this.httpHeader).pipe(first());
  }

  updateUser(user: User): Observable<boolean> {
    return this.http.post<boolean>(`${environment.restAPI}/users/updateUser`, JSON.stringify(user), this.httpHeader).pipe(first());
  }


  delete(id: number) {
    return this.http.delete(`${environment.restAPI}/users/${id}`).pipe(first());
  }

  loadCurretUser(userId: number): Observable<User> {
    return this.http.get<User>(`${environment.restAPI}/users/${userId}`).pipe(first())
  }

  loadUserByActivationCode(activationCode: string): Observable<User> {
    return this.http.get<User>(`${environment.restAPI}/users/getUserByActivationCode/${activationCode}`).pipe(first())
  }

  numberOfPartsPerUser(): Observable<Numberparts> {
    return this.http.get<Numberparts>(`${environment.restAPI}/users/numberOfPartsPerUser`).pipe(first());
  }

  activateUser(activationCode: string) {
    return this.http.post(`${environment.restAPI}/users/activateUser`, { activationCode }, { responseType: 'text' }).pipe(first());
  }

  unLockUser(password: string, activationCode: string) {
    return this.http.post(`${environment.restAPI}/users/unLockUser`, { password, activationCode }, { responseType: 'text' }).pipe(first());
  }

  unBlockUser(userName: string) {
    return this.http.post(`${environment.restAPI}/users/unBlockUser/${userName}`, { responseType: 'text' }).pipe(first());
  }
  recoverUser(account: string) {
    return this.http.post<BackendMessage>(`${environment.restAPI}/users/recoverUser/${account}`, {}).pipe(first());
  }

  deleteUser(userId: number) {
    return this.http.post(`${environment.restAPI}/users/deleteUser`, { id: userId }, { responseType: 'text' }).pipe(first());
  }

  getAccountByActivationCode(activationCode: string) {
    return this.http.post<User>(`${environment.restAPI}/users/getAccountByActivationCode`, { activationCode }).pipe(first());
  }

  adminActivateUser(userId: number) {
    return this.http.post<BackendMessage>(`${environment.restAPI}/users/adminActivateUser/${userId}`, {}).pipe(first());
  }

  adminUnLockUser(userId: number) {
    return this.http.post<BackendMessage>(`${environment.restAPI}/users/adminUnLockUser/${userId}`, {}).pipe(first());
  }

  adminDeleteUser(userId: number) {
    return this.http.post(`${environment.restAPI}/users/adminDeleteUser/${userId}`, {}, { responseType: 'text' }).pipe(first());
  }

  userPrivate() {
    return this.http.post(`${environment.restAPI}/users/userPrivate`, {}, { responseType: 'text' }).pipe(first());

  }
  userDealer() {
    return this.http.post(`${environment.restAPI}/users/userDealer`, {}, { responseType: 'text' }).pipe(first());

  }

}
