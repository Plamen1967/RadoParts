//#region imports
import { Component, input, model } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { NgClass, NgStyle } from '@angular/common'
import { FormValueControl } from '@angular/forms/signals'
//#endregion
//#region component
@Component({
    selector: 'app-input',
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.scss'],
    imports: [NgStyle, NgClass, FormsModule],
})
//#endregion
export class InputComponent implements FormValueControl<string> {
    value = model('');
    label = input<string | undefined>()

    placeHolder = input<string | undefined>()
    hint = input<string | undefined>()
    border = input<boolean>(true)
    IsPrice = input<boolean | undefined>()
    inline = input<boolean>(true)
    Pattern = input<string | undefined>();
    IsRequired = input<boolean | undefined>()
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
    autocomplete = input<string | undefined>();
    errorMessage =  input<string | undefined>();

    get contolName(): string {
        return this.label() || this.placeHolder() || ''
    }

    inputFunc() {
        return
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
}
