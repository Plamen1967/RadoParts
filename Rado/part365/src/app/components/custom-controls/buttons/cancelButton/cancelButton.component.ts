import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core'
import { HelperComponent } from '@components/helper.old/helper.component'

@Component({
    selector: 'app-cancelbutton',
    templateUrl: './cancelButton.component.html',
    styleUrls: ['./cancelButton.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [],
})
export class CancelButtonComponent extends HelperComponent {
    @Input() label = this.labels.SAVE
    @Output() cancelEvent: EventEmitter<void> = new EventEmitter<void>()

    cancelClick() {
        this.cancelEvent.emit()
    }
}
