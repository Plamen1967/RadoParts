import { NgClass, NgStyle } from '@angular/common'
import { Component, inject, Input, model, input, output, computed } from '@angular/core'
import { FormsModule, ValidationErrors } from '@angular/forms'
import { SelectOption } from '@model/selectOption'
import { ErrorService } from '@services/error.service'

@Component({
    selector: 'app-select-base',
    templateUrl: './select-base.component.html',
    styleUrls: ['./select-base.component.css'],
    imports: [FormsModule, NgClass, NgStyle],
})
export class SelectBaseComponent{
    value = model(0);
    value_as_string?: string;
    readonly disabled = input(false);    
    type = input<number | undefined>();
    label = input<string | undefined>();
    hint = input<string | undefined>();
    error = input<ValidationErrors | null>(null);
    control = input<string | undefined>();
    data = input<SelectOption[] | undefined>();

    @Input() set initialValue(value: number) {
        this.value.set(value);
        this.selectedValue4 = value
    }
    isRequired = input<boolean | undefined>();
    isInvalid = input<boolean | undefined>();
    group = input<boolean | undefined>();
    groupSelection = input(false);
    submitted = input(false);
    id = input('selectId');

    changeOption = output<number>()
    first = true
    selectedValue4?: number
    public errorService: ErrorService = inject(ErrorService)

    _data = computed(() => {
        return this.data()?.map((item) => {
            item.color = item.value === -1 ? 'lightgray' : item.color
            return item
        })
    })

    constructor() {
        // effect(() => {
        //     console.log(`Select Base Value: ${this.data()}`)
        // })
    }
    onChangeSelect() {
        this.value.set(this.selectedValue4 ?? 0)
        this.changeOption.emit(this.value())
    }

    get errorMessage() {
        return this.errorService.getMessage(this.label()!, this.error!)
    }
}

