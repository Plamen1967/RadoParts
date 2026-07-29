import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { environment } from '@env/environment'
import { ItemType } from '@model/enum/itemType.enum'
import { NextId } from '@model/nextId'
import { Observable } from 'rxjs'

@Injectable({
    providedIn: 'root',
})
export class NextIdService {
    private httpClient: HttpClient
    constructor() {
            this.httpClient = inject(HttpClient)
    }

    getNextId(itemType: ItemType): Observable<NextId> {
        return this.httpClient.get<NextId>(`${environment.restAPI}/users/GetNextId?itemType=${itemType}`)
    }
}
