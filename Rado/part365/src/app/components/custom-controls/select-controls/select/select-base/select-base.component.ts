import { NgClass, NgStyle } from '@angular/common'
import { Component, EventEmitter, Input, Output } from '@angular/core'
import { FormsModule, ValidationErrors } from '@angular/forms'
import { SelectOption } from '@model/selectOption'
import { ErrorService } from '@services/error.service'

@Component({
    standalone: true,
    selector: 'app-select-base',
    templateUrl: './select-base.component.html',
    styleUrls: ['./select-base.component.css'],
    imports: [FormsModule, NgClass, NgStyle],
})
export class SelectBaseComponent {
    value?: number
    @Input() type?: number
    @Input() label?: string
    @Input() hint?: string
    @Input() invalid?: boolean
    @Input() error: ValidationErrors | null = null
    @Input() control?: string
    @Input() set data(data_: SelectOption[] | undefined) {
        this._data = data_
        this.selectedValue = this.value
        this._data?.forEach((element) => {
            element.color = element.value === -1 ? 'lightgray' : element.color
        })
    }

    @Input() set initialValue(value: number) {
        this.value = value
        this.selectedValue = value
    }
    @Input() group?: boolean
    @Input() readonly?: boolean
    @Input() required?: boolean
    @Input() groupSelection = false
    @Input() submitted = false
    @Input() id = 'selectId'

    @Output() changeOption: EventEmitter<number> = new EventEmitter<number>()
    _data?: SelectOption[] = []
    first = true
    selectedValue?: number

    constructor(public errorService: ErrorService) {}
    // ngOnChanges(changes: SimpleChanges): void {
    //     if (changes['initialValue']) {
    //         this.selectedValue = changes['initialValue'].currentValue
    //     }
    // }

    onChangeSelect() {
        this.value = this.selectedValue
        this.changeOption.emit(this.value)
    }

    onSelect(element: SelectOption) {
        const value = element.value
        this.changeOption.emit(value)
    }

    color(element: SelectOption) {
        if (!element) return 'white'
        if (this.disabled(element)) return 'lightgray'
        return 'white'
    }

    get errorMessage() {
        return this.errorService.getMessage(this.label!, this.error!)
    }

    disabled(element: SelectOption): boolean | undefined {
        if (!element) return true
        if (element.value === -1) return true

        this.first = false
        return undefined
    }
}
