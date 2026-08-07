//#region imports
import { Component, inject, Input } from '@angular/core'
import { DataRowComponent } from '@components/custom-controls/dataRow/dataRow.component'
import { HelperComponent } from '@components/custom-controls/helper/helper.component'
import { DisplayPartView } from '@model/displayPartView'
import { StaticSelectionService } from '@services/staticSelection.service'
//#endregion
//#region component
@Component({
    selector: 'app-partdetailview',
    templateUrl: './partDetailView.component.html',
    styleUrls: ['./partDetailView.component.css'],
    imports: [DataRowComponent],
})
//#endregion
export class PartDetailViewComponent extends HelperComponent {
    //#region variables and services
    @Input() set part(value: DisplayPartView) {
        this.viewPart = value
    }

    viewPart!: DisplayPartView
    public staticService: StaticSelectionService = inject(StaticSelectionService)
    //#endregion

    constructor() {
        super()
    }
}
