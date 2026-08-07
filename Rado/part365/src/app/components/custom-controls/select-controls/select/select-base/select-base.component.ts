import { NgClass, NgStyle } from '@angular/common'
import { Component, inject, Input, model, input, output } from '@angular/core'
import { FormsModule, ValidationErrors } from '@angular/forms'
import { SelectOption } from '@model/selectOption'
import { ErrorService } from '@services/error.service'
import {FormValueControl} from '@angular/forms/signals';

@Component({
    selector: 'app-select-base',
    templateUrl: './select-base.component.html',
    styleUrls: ['./select-base.component.css'],
    imports: [FormsModule, NgClass, NgStyle],
})
export class SelectBaseComponent implements FormValueControl<number> {
    value = model(0);
    value_as_string?: string;
    readonly disabled = input(false);    
    type = input<number | undefined>();
    label = input<string | undefined>();
    hint = input<string | undefined>();
    error = input<ValidationErrors | null>(null);
    control = input<string | undefined>();
    @Input() set data(data_: SelectOption[] | undefined) {
        this._data = data_
        this.selectedValue = this.value();
        this._data?.forEach((element) => {
            element.color = element.value === -1 ? 'lightgray' : element.color
        })
    }

    @Input() set initialValue(value: number) {
        this.value.set(value);
        this.selectedValue = value
    }
    isRequired = input<boolean | undefined>();
    isInvalid = input<boolean | undefined>();
    group = input<boolean | undefined>();
    groupSelection = input(false);
    submitted = input(false);
    id = input('selectId');

    changeOption = output<number>()
    _data?: SelectOption[] = []
    first = true
    selectedValue?: number
    public errorService: ErrorService = inject(ErrorService)

    onChangeSelect() {
        this.value.set(this.selectedValue ?? 0)
        this.changeOption.emit(this.value())
    }

    get errorMessage() {
        return this.errorService.getMessage(this.label()!, this.error!)
    }
}

