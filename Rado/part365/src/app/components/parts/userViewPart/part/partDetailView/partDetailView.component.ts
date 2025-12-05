import { Component, Input } from '@angular/core'
import { DataRowComponent } from '@components/custom-controls/dataRow/dataRow.component'
import { HelperComponent } from '@components/custom-controls/helper/helper.component'
import { DisplayPartView } from '@model/displayPartView'
import { StaticSelectionService } from '@services/staticSelection.service'

@Component({
    standalone: true,
    selector: 'app-partdetailview',
    templateUrl: './partDetailView.component.html',
    styleUrls: ['./partDetailView.component.css'],
    imports: [DataRowComponent],
})
export class PartDetailViewComponent extends HelperComponent {
    @Input() set part(value: DisplayPartView) {
        this.viewPart = value
    }

    viewPart!: DisplayPartView
    constructor(public staticService: StaticSelectionService) {
        super()
    }
}
