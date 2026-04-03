//#region imports
import { inject, Injectable } from '@angular/core'
import { NavigationEnd, Router } from '@angular/router'
import { Location } from '@angular/common'
//#endregion
//#region service
@Injectable({
    providedIn: 'root',
})
//#endregion
export class NavigationService {
    //#region variables and services
    private history: string[] = []
    private router: Router = inject(Router)
    private location: Location = inject(Location)
    //#endregion
    
    public startSaveHistory(): void {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.history.push(event.urlAfterRedirects)
                console.log(event.urlAfterRedirects)
            }
        })
    }

    back() {
        history.back()
        return true
    }

    public getHistory(): string[] {
        return this.history
    }

    public goBack(): void {
        this.history.pop()
        if (this.history.length > 0) {
            this.location.back()
        } else {
            this.router.navigateByUrl('/')
        }
    }

    public getPreviouUrl(): string {
        // if (this.history.length > 0) {
        //   return this.history[this.history[this.history.length - 2]]
        // }
        return ''
    }
}
