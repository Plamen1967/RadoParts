//#region imports
import { Component, inject } from '@angular/core'
import { Filter } from '@model/filters/filter'
import { SaveSearchService } from '@services/saveSearch.service'
//#endregion
//#region component
@Component({
    selector: 'app-showfilter',
    templateUrl: './showfilter.component.html',
    styleUrls: ['./showfilter.component.css'],
})
//#endregion
export class ShowfilterComponent {
    //#region variables and services
    filters: Filter[] = []
    private saveSearchService: SaveSearchService = inject(SaveSearchService)
    //#endregion

    constructor() {
        this.filters = this.saveSearchService.getSavedItems()
    }
}
