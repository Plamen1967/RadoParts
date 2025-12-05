import { Component, ElementRef, EventEmitter, Input, Output, Self } from '@angular/core'
import { FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms'
import { SelectOption } from '@model/selectOption'
import { ErrorService } from '@services/error.service'
import { BaseControl } from '../../baseControl'
import { SelectBaseComponent } from "./select-base/select-base.component";

@Component({
    standalone: true,
    selector: 'app-select',
    templateUrl: './select.component.html',
    styleUrls: ['./select.component.css'],
    imports: [FormsModule, ReactiveFormsModule, SelectBaseComponent]
})

export class SelectComponent extends BaseControl<number>{
    @Input() type?: number
    @Input() label?: string
    @Input() hint?: string
    @Input() set data(data_: SelectOption[] | undefined) {
        this._data = data_
        this.selectedValue = this.value
        this._data?.forEach(element => {
            element.color = element.value === -1? 'lightgray' :  element.color;
        });
    }

    get data() {
        return this._data;
    }

    @Input() set initialValue(value: number) {
        this.value = value;
        this.writeValue(value)
    }
    @Input() group?: boolean
    @Input() readonly?: boolean
    @Input() required?: boolean
    @Input() groupSelection = false
    @Input() submitted = false
    @Input() id = 'selectId'

    @Output() changeOption: EventEmitter<number> = new EventEmitter<number>()
    // eslint-disable-next-line @angular-eslint/no-output-on-prefix
    @Output() onClose: EventEmitter<ElementRef> = new EventEmitter<ElementRef>()
    _data?: SelectOption[] = []
    first = true
    selectedValue?: number

    constructor(
        @Self() control: NgControl,
        erroService: ErrorService,
        private _el: ElementRef
    ) {
        super(control, erroService, _el)
        this.control.valueAccessor = this;
    }

    override writeValue(obj: number): void {
        this.value = obj
        this.selectedValue = obj
        this.changeSelectOption(obj)
    }

    changeSelectOption(obj: number) {
        this.selectedValue = obj;
        this.value = obj
        if (this.onChange) this.onChange(this.value!)
        this.markAsTouched()
        this.changeOption.emit(obj)
    }
    blur() {
        this.markAsTouched()
    }

    onChangeSelect() {
        this.value = this.selectedValue
        if (this.onChange) this.onChange(this.value!)
        this.markAsTouched()
        this.changeSelectOption(this.value!)
        this.onClose.emit(this._el)
    }

    onSelect(element: SelectOption) {
        this.changeSelectOption(element.value!)
    }

    markAsTouched() {
        if (!this.touched) {
            if (this.onTouched) this.onTouched()
            this.touched = true
        }
    }

    color(element: SelectOption) {
        if (!element) return 'white'
        if (this.disabled(element)) return 'lightgray'
        return 'white'
    }

    disabled(element: SelectOption): boolean| undefined {
        if (!element) 
            return true
        if (element.value === -1) 
            return true

        this.first = false
        return undefined
    }

    override get errorMessage() {
        return this.errorService.getMessage(this.label!, this.control.errors)
    }

    close() {
        this.onClose.emit()
    }

    override get contolName() : string{
      return this.control.name?.toString()??"";
    }

    get invalid() {
        return this.control.invalid ?? false;
    }

}

// data_?.sort((a, b) => {
//         if ( a[this.displayProperty] < b[this.displayProperty]) return -1;
//         if ( a[this.displayProperty] > b[this.displayProperty]) return 1;
//         return 0
//       })
// console.log(data_)
// console.log(`${this.displayProperty} ${this._value}`)
// if (this.type === 1) {
//   this._value.push({text: `Избери ${this.label}`, value: 0})
// }
// if (this.type === 2) {

// }this._value.push({text: `Избери ${this.label}`, value: undefined})
