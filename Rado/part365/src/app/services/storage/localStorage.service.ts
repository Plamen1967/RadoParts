//#region imports
import { inject, Injectable } from '@angular/core'
import { PopUpService } from '@app/dialog/services/popUpService.service'
//#endregion

@Injectable({
    providedIn: 'root',
})
export class LocalStorageService {
    //#region services and variables
    private popupService: PopUpService
    storeName = 'items'
    ids: number[] = []
    //#endregion

    constructor() {
        this.popupService = inject(PopUpService)
        const items = localStorage.getItem('items')
        this.ids = JSON.parse(items!)
        if (!this.ids) this.ids = []
    }

    clear() {
        localStorage.removeItem('items')
        this.ids = []
    }
    addSavedItem(id: number) {
        if (this.ids.length > 9) {
            this.popupService.openWithTimeout('Съобщение', 'Максимум 10 обяви може да бъдат запзаени', 2000).subscribe(() => {
                this.popupService.close()
            })
        }
        this.ids.push(id)
        localStorage.setItem(this.storeName, JSON.stringify(this.ids))
    }

    removeSavedItem(id: number) {
        this.ids.splice(
            this.ids.findIndex((item) => item === id),
            1
        )
        localStorage.setItem(this.storeName, JSON.stringify(this.ids))
    }

    getSavedItems(): number[] {
        const items = localStorage.getItem(this.storeName)
        const arr = JSON.parse(items!) ?? []
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
