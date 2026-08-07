import { Component, input, output } from '@angular/core'
import { HelperComponent } from '@components/helper.old/helper.component'

@Component({
    selector: 'app-cancelbutton',
    templateUrl: './cancelButton.component.html',
    styleUrls: ['./cancelButton.component.css'],
    imports: [],
})
export class CancelButtonComponent extends HelperComponent {
    label = input<string>(this.labels.SAVE)
    cancelEvent = output<void>()

    cancelClick() {
        this.cancelEvent.emit()
    }
}
