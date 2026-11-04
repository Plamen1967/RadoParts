//#region imports
import { Component, computed, effect, input, model } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { NgClass, NgStyle } from '@angular/common'
import { FormValueControl, ValidationError } from '@angular/forms/signals'
//#endregion
//#region component
@Component({
    selector: 'app-input',
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.scss'],
    imports: [NgStyle, NgClass, FormsModule],
})
//#endregion
export class InputComponent implements FormValueControl<string | number> {
    value = model.required<string | number>()
    label = input<string | undefined>()
    readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);

    placeHolder = input<string | undefined>()
    hint = input<string | undefined>()
    border = input<boolean>(true)
    IsPrice = input<boolean | undefined>()
    inline = input<boolean>(true)
    Pattern = input<string | undefined>()
    isRequired = input<boolean | undefined>()
    IsInvalid = input<boolean | undefined>()
    submitted = input<boolean>(false)
    floating = input<boolean | undefined>()
    id = input<string>('')
    keyword = input<boolean | undefined>()
    show = input<boolean | undefined>()
    suffix = input<string | undefined>()
    prefix = input<string | undefined>()
    number = input<boolean | undefined>()
    text = input<string>('text')
    autocomplete = input<string | undefined>()
    errorMessage = input<string | undefined>()
    
    get contolName(): string {
        return this.label() || this.placeHolder() || ''
    }

    $pattern = computed(() => {
        if (this.Pattern()) {
            return this.Pattern()
        }
        if (this.IsPrice()) {
            return "^(([1-9](\\d*|\\d{0,2}(,\\d{3})*))|0)(\\.\\d{1,2})?$"
        }

        if (this.number()) {
            return "^([0-9])*$"
        }
        return ''
    })
    
    inputFunc(event: Event) {
        const inputElement = event.target as HTMLInputElement
        let inputValue: string | number = inputElement.value
        if (this.number()) {
            inputValue = Number(inputValue)
        } else {
            inputValue = inputValue.toString()
        }
        this.value.set(inputValue)
    }

    onFocus() {
        if (this.IsPrice()) {
            if (this.value()?.toString() == '0') {
                this.value.set('')
            }
        }
    }
    onBlur() {
        if (this.IsPrice()) {
            if (this.value()?.toString() == '') {
                this.value.set('0')
            }
        }
    }

    constructor() {
        effect(() => {
            console.log(`Pattern: ${this.Pattern()}`)
        })
    }
}
