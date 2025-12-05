import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { UserCount } from '@model/userCount';
import { BehaviorSubject, Observable, Subject, take, tap } from 'rxjs';
import { LoggerService } from './authentication/logger.service';

@Injectable({
  providedIn: 'root'
})
export class UserCountService {
  private apiKey = `${environment.restAPI}/users/GetUserCount`;
  private userCount : BehaviorSubject<UserCount | undefined> = new BehaviorSubject<UserCount | undefined>(undefined);
  public userCount$: Observable<UserCount | undefined> = this.userCount.asObservable();
  private kick = new Subject<undefined>()


constructor(private http: HttpClient, private loggerService: LoggerService) { 
  this.kick.subscribe(
      () =>  this.fetchUserCount()
    )
}

public clearUserCount() {
  this.userCount.next(undefined);
}

refresh() {
  this.kick.next(undefined);
}

public fetchUserCount() {
  this.http.get<UserCount>(`${environment.restAPI}/users/GetUserCount`).pipe(
    take(1),
    tap({
          next: (data: UserCount) => this.userCount.next(data),
          error: (error) => { 
            this.userCount.next(undefined);
            this.loggerService.logError(error); return; 
          } 
        })
  ).subscribe();
}
}
