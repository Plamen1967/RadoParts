import { NgClass, NgStyle } from '@angular/common'
import { Component, EventEmitter, inject, Input, Output, model, input } from '@angular/core'
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
    @Input() type?: number
    @Input() label?: string
    @Input() hint?: string
    @Input() error: ValidationErrors | null = null
    @Input() control?: string
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
    @Input() isRequired?: boolean;
    @Input() isInvalid?: boolean
    @Input() group?: boolean
    @Input() groupSelection = false
    @Input() submitted = false
    @Input() id = 'selectId'

    @Output() changeOption: EventEmitter<number> = new EventEmitter<number>()
    _data?: SelectOption[] = []
    first = true
    selectedValue?: number
    public errorService: ErrorService = inject(ErrorService)

    onChangeSelect() {
        this.value.set(this.selectedValue ?? 0)
        this.changeOption.emit(this.value())
    }

    get errorMessage() {
        return this.errorService.getMessage(this.label!, this.error!)
    }
}

