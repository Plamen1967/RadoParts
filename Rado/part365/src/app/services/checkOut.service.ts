//#region imports
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { inject, Injectable, signal } from '@angular/core'
import { environment } from '@env/environment'
import { BehaviorSubject } from 'rxjs'
import { first } from 'rxjs/operators'
import { PartView } from '@model/part/partView'
import { CheckoutItem } from '@model/checkoutItem'
//#endregion
//#region service
@Injectable({
    providedIn: 'root',
})
//#endregion
export class CheckOutService {
    //#region variables and services
    public checkoutObj: BehaviorSubject<number> = new BehaviorSubject<number>(0)
    public checkout = signal<number>(0)
    public currentId?: number

    private http = inject(HttpClient)

    httpHeader = {
        headers: new HttpHeaders({
            'content-type': 'application/json',
            accept: '*/*',
            'Access-Control-Allow-Origin': 'true',
        }),
    }
    //#endregion

    addPart(part: PartView) {
        return this.http.post<number>(`${environment.restAPI}/checkout`, part, this.httpHeader).pipe(first())
    }

    getItems() {
        return this.http
            .get<number>(`${environment.restAPI}/checkout/1`)
            .pipe(first())
            .subscribe((x) => this.updateItems(x))
    }

    removeFromCheckout(checkoutId: number) {
        return this.http.delete<number>(`${environment.restAPI}/checkout/${checkoutId}`, this.httpHeader).pipe(first())
    }

    fetch() {
        return this.http.get<CheckoutItem[]>(`${environment.restAPI}/checkout`).pipe(first())
    }

    fetchItems() {
        return this.http.get<CheckoutItem[]>(`${environment.restAPI}/checkout/items`).pipe(first())
    }

    updateItems(items: number) {
        this.checkoutObj.next(items)
    }
}
