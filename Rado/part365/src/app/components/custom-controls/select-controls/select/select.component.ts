import { Component, effect, input, Input, model, output } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { SelectOption } from '@model/selectOption'
import { SelectBaseComponent } from './select-base/select-base.component'
import { FormValueControl } from '@angular/forms/signals'

@Component({
    selector: 'app-select',
    templateUrl: './select.component.html',
    styleUrls: ['./select.component.css'],
    imports: [FormsModule, ReactiveFormsModule, SelectBaseComponent],
})
export class SelectComponent implements FormValueControl<number | undefined> {
    value = model<number | undefined>(undefined);
    type = input<number>(0);
    label = input<string | undefined>();
    hint = input<string | undefined>();
    hasError = input(false);
    isDisabled = input(false);
    IsInvalid = input(false);
    IsRequired = input(false);
    group = input<boolean | undefined>()
    groupSelection = input(false)
    submitted = input(false)
    id = input('selectId')
    // readonly error = input(ValidationErrors | null);

    error() {
        return this.hasError() ? { required: true } : null
    }
    
    @Input() set initialValue(value: number | undefined) {
        this.value.set(value)
        this.selectedValue = value
    }
    @Input() set data(data_: SelectOption[] | undefined) {
        this._data = data_
        this.selectedValue = this.value();
        this._data?.forEach((element) => {
            element.color = element.value === -1 ? 'lightgray' : element.color
        })
    }

    get data() {
        return this._data
    }


    changeOption = output<number | undefined>()
    closeEvent = output()
    _data?: SelectOption[] = []
    first = true
    selectedValue?: number | undefined

    constructor() {
        effect(() => {
            this.selectedValue = this.value()
            this.changeOption.emit(this.selectedValue)
        })
    }

    // override writeValue(obj: number): void {
    //     this.value.set(obj)
    //     this.selectedValue = obj
    //     this.changeSelectOption(obj)
    // }

    changeSelectOption(obj: number | undefined) {
        this.selectedValue = obj
        this.value.set(obj)
    }
    // blur() {
    //     this.markAsTouched()
    // }

    onChangeSelect() {
        this.value.set(this.selectedValue!) 
        this.changeSelectOption(this.value())
    }

    onSelect(element: SelectOption) {
        this.changeSelectOption(element.value!)
    }

    // markAsTouched() {
    //     if (!this.touched) {
    //         if (this.onTouched) this.onTouched()
    //         this.touched = true
    //     }
    // }

    // color(element: SelectOption) {
    //     if (!element) return 'white'
    //     if (this.disabled(element)) return 'lightgray'
    //     return 'white'
    // }

    // disabled(element: SelectOption): boolean | undefined {
    //     if (!element) return true
    //     if (element.value === -1) return true

    //     this.first = false
    //     return undefined
    // }

    // override get errorMessage() {
    //     return this.errorService.getMessage(this.label!, this.control.errors)
    // }

    close() {
        this.closeEvent.emit(undefined)
    }

    // override get contolName(): string {
    //     return this.control.name?.toString() ?? ''
    // }

    // get invalid() {
    //     return this.control.invalid ?? false
    // }
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
