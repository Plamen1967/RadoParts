import { Component, computed, effect, input, Input, model, output } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { SelectOption } from '@model/selectOption'
import { SelectBaseComponent } from './select-base/select-base.component'
import { FormValueControl, ValidationError } from '@angular/forms/signals'

@Component({
    selector: 'app-select',
    templateUrl: './select.component.html',
    styleUrls: ['./select.component.css'],
    imports: [FormsModule, ReactiveFormsModule, SelectBaseComponent],
})
export class SelectComponent implements FormValueControl<number> {
    value = model<number>(0);
    type = input<number>(0);
    label = input<string | undefined>();
    hint = input<string | undefined>();
    hasError = input(false);
    isDisabled = input(false);
    isRequired = input(false);
    group = input<boolean | undefined>()
    groupSelection = input(false)
    readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);
    submitted = input(false)
    id = input('selectId')
    data = input.required<SelectOption[]>();
    valueChanged = output<number>()
    // readonly error = input(ValidationErrors | null);

   
    @Input() set initialValue(value: number ) {
        this.value.set(value)
        this.selectedValue24 = value
    }
    _data = computed(() => {
        const _data = this.data()
        _data?.forEach((element) => {
            element.color = element.value === -1 ? 'lightgray' : element.color
        })

        return _data
        })  


    changeOption = output<number | undefined>()
    closeEvent = output()
    first = true
    selectedValue24?: number | undefined

    constructor() {
        effect(() => {
            this.selectedValue24 = this.value()
            this.changeOption.emit(this.selectedValue24)
        })
    }

    changeSelectOption(obj: number) {
        this.selectedValue24 = obj
        this.value.set(obj)
    }

    onChangeSelect() {
        this.value.set(this.selectedValue24!) 
        this.changeSelectOption(this.value())
    }

    onSelect(element: SelectOption) {
        this.changeSelectOption(element.value!)
    }

    close() {
        this.closeEvent.emit(undefined)
    }
}
