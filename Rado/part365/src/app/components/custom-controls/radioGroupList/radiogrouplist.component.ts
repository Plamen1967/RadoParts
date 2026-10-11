import { NgClass } from '@angular/common'
import { Component, effect, input, model, output, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RadioButton } from '@model/radioButton'
import { SelectOption } from '@model/selectOption'
import { FormValueControl } from '@angular/forms/signals'

@Component({
    selector: 'app-radiogrouplist',
    templateUrl: './radiogrouplist.component.html',
    styleUrls: ['./radiogrouplist.component.scss'],
    imports: [NgClass, FormsModule],
})
export class RadioGroupListComponent implements FormValueControl<number> {
updateSelectValue(event: Event, id: number|undefined) {
    event.preventDefault()
    this.value.update(() => {
        const selectItem = this.radios().find((item) => item.id === id)
        console.log(selectItem)
        return selectItem?.id ?? 0
    })
}

    value = model(0)
    selectedValue3 = signal('')
    groupListDisplay = input<string>('')
    label = input<string>('')
    all = input<boolean>(true)
    radios = input<RadioButton[]>([])
    style = input<number>(1)
    changeRadioGroup = output<number>()

    id?: number
    _radios: RadioButton[] = []
    _value = 1
    isDisabled = false
    controlName =input.required<string>()
    selection: SelectOption[] = []

    constructor() {
        effect(() => {
            console.log(`Radio list Initial: ${this.value()}`)
        })
    }

}
