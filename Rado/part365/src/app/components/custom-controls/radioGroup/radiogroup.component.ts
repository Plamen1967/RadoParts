import { Component, input, model, output } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { FormValueControl } from '@angular/forms/signals'
import { RadioButton } from '@model/radioButton'

@Component({
    selector: 'app-radiogroup',
    templateUrl: './radiogroup.component.html',
    styleUrls: ['./radiogroup.component.css'],
    imports: [FormsModule],
})
export class RadioGroupComponent implements FormValueControl<number|undefined> {
    value = model<number|undefined>(undefined)
    radios = input<RadioButton[]>([])
    changeRadioGroup = output<number>()
    panelClosed = output<number>()
    IsDisabled = input<boolean>(false)
    controlName = input<string | number>()

    click(event: Event, value: number) {
        event.stopPropagation()
        this.value.set(value)
        this.panelClosed.emit(value)
    }
}
