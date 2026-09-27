import { NgClass } from '@angular/common'
import { Component, effect, input, model, output } from '@angular/core'
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
    this.value.update(() => {
        const selectItem = this.radios().find((item) => item.id === id)
        console.log(selectItem)
        return selectItem?.id ?? 0
    })
    // console.log(`Test`)
    // this.selectedValue.set(id?.toString() ?? '')
    // this.value.update(() => {
    //     const selectItem = this.radios().find((item) => item.id?.toString() === this.selectedValue())
    //     console.log(selectItem)
    //     return selectItem?.id ?? 0
    // })
}

    value = model(0)
    selectedValue = model('')
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
            console.log(`Selected Value: ${this.selectedValue()}`)
            console.log(`Value: ${this.value()}`)
        })
        // effect(() => {
        //     this.selectedValue.update(() => {
        //         const id = this.radios().find(
        //             (item) => item.id != null && item.id.toString() === this.value().toString(),
        //         )?.id

        //         return id?.toString() ?? ''
        //     })
        // })
        // effect(() => {
        //     console.log(this.radios())
        //     console.log(this.value())
        // })

        // effect(() => {
        //     this._radios = [...this.radios()]
        //     this.selection = this._radios.map((item) => {
        //         return { value: item.id, text: item.label }
        //     })
        // })
    }

    // isChecked(id: number) {
    //     return id == this._value ? true : undefined
    // }

    // controlId(id: number) {
    //     return this.controlName?.toString() + id.toString()
    // }
}
//     function model<T>(undefined: undefined) {
//     throw new Error('Function not implemented.')
// }

