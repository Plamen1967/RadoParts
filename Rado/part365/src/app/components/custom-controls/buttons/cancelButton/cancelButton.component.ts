import { Component, EventEmitter, Input, Output } from '@angular/core'
import { HelperComponent } from '@components/helper.old/helper.component'

@Component({
    standalone: true,
    selector: 'app-cancelbutton',
    templateUrl: './cancelButton.component.html',
    styleUrls: ['./cancelButton.component.css'],
    imports: [],
})
export class CancelButtonComponent extends HelperComponent {
    @Input() label = this.labels.SAVE
    @Output() cancelEvent: EventEmitter<void> = new EventEmitter<void>()

    cancelClick() {
        this.cancelEvent.emit()
    }
}
