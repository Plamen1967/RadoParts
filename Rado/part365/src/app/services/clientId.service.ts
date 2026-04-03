//#region imports
import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { environment } from '@env/environment'
//#endregion
//#region service
@Injectable({
    providedIn: 'root',
})
//#endregion
export class ClientIdService {
    //#region variables and services
    private httpClient: HttpClient = inject(HttpClient)

    clientId_?: string
    //#endregion
    get clientId() {
        return sessionStorage.getItem('clientId') ?? ''
    }

    set clientId(value: string) {
        this.clientId_ = value
    }

    getClientId() {
        return this.httpClient.get<number>(`${environment.restAPI}/clientId`)
    }
}
