import { NgClass } from '@angular/common'
import { AfterViewInit, Component, effect, ElementRef, inject, input, model, OnInit, output, Renderer2, ViewChild } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RadioButton } from '@model/radioButton'
import { SelectOption } from '@model/selectOption'
import { SelectBaseComponent } from '../select-controls/select/select-base/select-base.component'
import { FormValueControl } from '@angular/forms/signals'

@Component({
    selector: 'app-radiogrouplist',
    templateUrl: './radiogrouplist.component.html',
    styleUrls: ['./radiogrouplist.component.scss'],
    imports: [NgClass, FormsModule, ReactiveFormsModule, SelectBaseComponent],
})
export class RadioGroupListComponent implements FormValueControl<number|undefined>, OnInit, AfterViewInit {
    value = model<number|undefined>(undefined)
    id?: number
    _radios: RadioButton[] = []
    _value = 1
    isDisabled = false
    controlName: string | undefined
    selection: SelectOption[] = []

    all = input<boolean>(true)
    groupListDisplay = input<'flex' | 'none' | undefined>('flex')
    radios = input<RadioButton[]>([])
    itemSize = input<number>(70)
    label = input<string | undefined>(undefined)
    style = input<number>(1)
    changeRadioGroup = output<number>()

    @ViewChild('radioGroup', { static: false }) radioGroup?: ElementRef
    private renderer: Renderer2 = inject(Renderer2)
    private _el: ElementRef = inject(ElementRef)

    constructor() {
        effect(() => {
            this._radios = [...this.radios()]
            this.selection = this._radios.map((item) => {
                return { value: item.id, text: item.label }
            })
        })
    }
    private onTouched?() {
        return
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private onChange?(_: unknown) {
        return
    }

    ngAfterViewInit(): void {
        if (this.onChange) this.onChange(this._value)
    }

    writeValue(value: number): void {
        this._value = value
    }
    setDisabledState?(isDisabled: boolean): void {
        this.isDisabled = isDisabled
    }

    click(value: number) {
        this._value = value
        if (this.onChange) this.onChange(value)
        this.changeRadioGroup.emit(value)
    }
    ngOnInit() {
        this.id = Date.now()
    }

    isChecked(id: number) {
        return id == this._value ? true : undefined
    }

    controlId(id: number) {
        return this.controlName?.toString() + id.toString()
    }
}
//     function model<T>(undefined: undefined) {
//     throw new Error('Function not implemented.')
// }

