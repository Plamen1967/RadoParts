import { Component, input, output } from '@angular/core'

@Component({
    selector: 'app-savebutton',
    templateUrl: './saveButton.component.html',
    styleUrls: ['./saveButton.component.css'],
    imports: [],
})
export class SaveButtonComponent {
    label = input<string>('Запиши')
    changed = input<boolean>(true)
    saveEvent = output<void>()

    onSubmit() {
        this.saveEvent.emit()
    }
}
