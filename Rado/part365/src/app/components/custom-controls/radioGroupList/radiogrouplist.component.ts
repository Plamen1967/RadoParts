import { NgClass } from '@angular/common'
import { Component, input, model, output, signal } from '@angular/core'
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
isChecked(arg0: number|undefined) {
    console.log(`Radio Id: ${arg0} ${this.value()} ${arg0 === this.value()}`)
}
updateSelectValue(event: Event, id: number|undefined) {
    event.preventDefault()
    this.value.update(() => {
        const selectItem = this.radios().find((item) => item.id === id)
        console.log(selectItem)
        this.changeRadioGroup.emit(selectItem?.id ?? 0)
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

}
