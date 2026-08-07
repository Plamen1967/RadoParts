import { Component, input, output } from '@angular/core'
import { HelperComponent } from '@components/custom-controls/helper/helper.component'
import { SaveButtonComponent } from '../buttons/saveButton/saveButton.component'
import { CancelButtonComponent } from '../buttons/cancelButton/cancelButton.component'

@Component({
    selector: 'app-toolbar',
    templateUrl: './toolBar.component.html',
    styleUrls: ['./toolBar.component.css'],
    imports: [SaveButtonComponent, CancelButtonComponent],
})
export class ToolBarComponent extends HelperComponent {
    constructor() {
        super()
    }

    canSave = input.required<boolean>()
    canCancel = input.required<boolean>()
    saveName = input<string>(this.labels.SAVE)
    cancelName = input<string>(this.labels.CANCEL)
    isChanged = input<boolean>(false)
    Save = output()
    Cancel = output()

    clickSave() {
        this.Save.emit()
    }
    clickCancel() {
        this.Cancel.emit()
    }
}
