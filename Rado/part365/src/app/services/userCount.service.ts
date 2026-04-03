//#region imports
import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { environment } from '@env/environment'
import { UserCount } from '@model/userCount'
import { BehaviorSubject, Observable, Subject, take, tap } from 'rxjs'
import { LoggerService } from './authentication/logger.service'
//#endregion
//#region service
@Injectable({
    providedIn: 'root',
})
//#endregion
export class UserCountService {
    //#region variables and services
    private apiKey = `${environment.restAPI}/users/GetUserCount`
    private userCount: BehaviorSubject<UserCount | undefined> = new BehaviorSubject<UserCount | undefined>(undefined)
    public userCount$: Observable<UserCount | undefined> = this.userCount.asObservable()
    private kick = new Subject<undefined>()

    private http = inject(HttpClient)
    private loggerService = inject(LoggerService)
    //#endregion
    constructor() {
        this.kick.subscribe(() => this.fetchUserCount())
    }

    public clearUserCount() {
        this.userCount.next(undefined)
    }

    refresh() {
        this.kick.next(undefined)
    }

    public fetchUserCount() {
        this.http
            .get<UserCount>(`${environment.restAPI}/users/GetUserCount`)
            .pipe(
                take(1),
                tap({
                    next: (data: UserCount) => this.userCount.next(data),
                    error: (error) => {
                        this.userCount.next(undefined)
                        this.loggerService.logError(error)
                        return
                    },
                })
            )
            .subscribe()
    }
}
