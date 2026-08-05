//#region imports
import { Component, Input, model } from '@angular/core'
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
    @Input() label?: string
    @Input() placeHolder?: string
    @Input() hint?: string
    @Input() border = true
    @Input() IsPrice?: boolean = undefined
    @Input() inline = true
    @Input() Pattern?: string;
    @Input() IsRequired?: boolean
    @Input() IsInvalid?: boolean
    @Input() submitted = false
    @Input() floating?: boolean
    @Input() id = ''
    @Input() keyword?: boolean
    @Input() show?: boolean
    @Input() suffix?: string
    @Input() prefix?: string
    @Input() number?: boolean
    @Input() text = 'text'
    @Input() autocomplete?: string;
    @Input() errorMessage?: string;

    get contolName(): string {
        return this.label || this.placeHolder || ''
    }

    inputFunc() {
        return
    }

    onFocus() {
        if (this.IsPrice) {
            if (this.value()?.toString() == '0') {
                this.value.set('')
            }
        }
    }
    onBlur() {
        if (this.IsPrice) {
            if (this.value()?.toString() == '') {
                this.value.set('0')
            }
        }
    }
}
