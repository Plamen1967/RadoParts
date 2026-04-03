//#region imports
import { Inject, Injectable, DOCUMENT, inject } from '@angular/core'
import { Router } from '@angular/router'
import { QueryParam } from '@model/queryParam'
//#endregion
//#region service
@Injectable({
    providedIn: 'root',
})
//#endregion

export class PathService {
    //#region variables and services
    shouldRun = /(^|.)(stackblitz|webcontainer).(io|com)$/.test(window.location.host)
    private router: Router = inject(Router)
    @Inject(DOCUMENT) private document: Document = inject(DOCUMENT)
    public lastPage: string[] = []
    //#endregion

    navigate(value: QueryParam) {
        const queryParam: QueryParam = {}
        let route = '/'
        if (value.query) queryParam.query = value.query
        if (value.userId) queryParam.userId = value.userId
        if (value.page) queryParam.page = value.page

        if (value.userId) {
            if (value.viewPartId || value.viewId) {
                const id = value.viewPartId || value.viewId
                queryParam.id = id
                route = `/part`
            } else if (value.query) {
                route = `/results`
            }
        } else if (value.query) {
            if (value.viewPartId || value.viewId) {
                const id = value.viewPartId || value.viewId
                queryParam.id = id
                route = `/part`
            } else route = `/results`
        }

        this.router.navigate([route], { queryParams: queryParam })
    }

    get userPage(): boolean {
        const radoPart = this.document.location.host === 'www.radoparts.com' || this.document.location.host === 'radoparts.com'
        const part365 = this.document.location.host === 'www.parts365.bg' || this.document.location.host === 'parts365.bg'
        const localhost = this.document.location.host.includes('localhost')

        if (this.document.location.href.includes('dealerwebpage')) return true
        if (radoPart || localhost || part365) return false

        const userPage = true
        return userPage
    }
}
