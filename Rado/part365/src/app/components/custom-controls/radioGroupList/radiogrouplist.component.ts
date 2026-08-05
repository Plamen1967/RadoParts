import { NgClass } from '@angular/common'
import { AfterViewInit, Component, ElementRef, EventEmitter, inject, Input, model, OnInit, Output, Renderer2, ViewChild } from '@angular/core'
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

    @Input() all = true
    @Input() groupListDisplay: 'flex' | 'none' | undefined = 'flex'
    @Input() set radios(radioButtons: RadioButton[]) {
        this._radios = [...radioButtons]
        this.selection = this._radios?.map((radio) => {
            return { value: radio.id, text: radio.label, count: radio.count }
        })
    }
    @Input() itemSize = 70
    @Input() label?: string
    @Input() style = 1
    @Output() changeRadioGroup: EventEmitter<number> = new EventEmitter<number>()

    @ViewChild('radioGroup', { static: false }) radioGroup?: ElementRef
    private renderer: Renderer2 = inject(Renderer2)
    private _el: ElementRef = inject(ElementRef)

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

