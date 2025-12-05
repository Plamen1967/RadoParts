import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from '@env/environment'
import { Observable } from 'rxjs'

@Injectable({
    providedIn: 'root',
})
export class NextIdService {
    constructor(private httpClient: HttpClient) {}

    getNextId(): Observable<number> {
        return this.httpClient.get<number>(`${environment.restAPI}/part/GetNextId`)
    }
}
