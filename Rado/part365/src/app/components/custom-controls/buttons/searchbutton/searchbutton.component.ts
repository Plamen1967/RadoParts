import { Component, output } from '@angular/core'
import { HelperComponent } from '@components/helper.old/helper.component'

@Component({
    selector: 'app-searchbutton',
    templateUrl: './searchbutton.component.html',
    styleUrls: ['./searchbutton.component.css'],
    imports: [],
})
export class SearchbuttonComponent extends HelperComponent {
    clickButton = output<void>()

    constructor() {
        super()
    }

    generateEvent(event: Event) {
        event.stopPropagation()
        this.clickButton.emit()
    }
}
