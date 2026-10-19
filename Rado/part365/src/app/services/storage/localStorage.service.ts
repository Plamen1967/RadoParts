//#region imports
import { inject, Injectable } from '@angular/core'
import { PopUpService } from '@app/dialog/services/popUpService.service'
import { environment } from '@env/environment'
import { CheckOutService } from '@services/checkOut.service'
import { DisplayPartView, Enrich } from '@model/displayPartView'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { map } from 'rxjs'
import { StaticSelectionService } from '@services/staticSelection.service'
//#endregion

@Injectable({
    providedIn: 'root',
})
export class LocalStorageService {
    //#region services and variables
    private popupService: PopUpService
    private http = inject(HttpClient)
    private staticSelectionService = inject(StaticSelectionService)
    storeName = 'items'
    ids: number[] = []
    httpHeader = {
        headers: new HttpHeaders({
            'content-type': 'application/json',
            accept: '*/*',
            'Access-Control-Allow-Origin': 'true',
        }),
    }
    //#endregion

    checkOutService = inject(CheckOutService);
    constructor() {
        this.popupService = inject(PopUpService)
        const items = localStorage.getItem('items')
        this.ids = JSON.parse(items!)
        if (!this.ids) this.ids = []
        this.getCheckoutItems()
        this.checkOutService.checkout.set(this.ids.length)
    }

    clear() {
        localStorage.removeItem('items')
        this.ids = []
    }

        getCheckoutItems() {
            const ids = this.checkOutItems.map((id: number) => `id=${id}`)
            return this.http.get<DisplayPartView[]>(`${environment.restAPI}/checkout/GetCheckOutItems?${ids.join('&')}`, this.httpHeader).pipe(
                map((res) => {
                    res.forEach((part) => {
                        Enrich(part, this.staticSelectionService)
                    })
                    return res
                })
            )
        }
    
    
    addSavedItem(id: number) {
        if (this.ids.length > 9) {
            this.popupService.openWithTimeout('Съобщение', 'Максимум 10 обяви може да бъдат запзаени', 2000).subscribe(() => {
                this.popupService.close()
            })
        }
        this.ids.push(id)
        this.checkOutService.checkout.set(this.ids.length)
        localStorage.setItem(this.storeName, JSON.stringify(this.ids))
    }

    removeSavedItem(id: number) {
        this.ids.splice(
            this.ids.findIndex((item) => item === id),
            1
        )
        this.checkOutService.checkout.set(this.ids.length)
        localStorage.setItem(this.storeName, JSON.stringify(this.ids))
    }

    getSavedItems(): number[] {
        const items = localStorage.getItem(this.storeName)
        const arr = JSON.parse(items!) ?? []
        this.checkOutService.checkout.set(this.ids.length)
        return arr
    }

    isSaved(id: number) {
        return this.ids.findIndex((item) => item === id) !== -1
    }

    public get checkOutItems(): number[] {
        return this.ids
    }

    public get items() {
        return this.ids.length
    }
}
