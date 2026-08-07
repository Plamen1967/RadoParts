import { Component, input, model } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { CONSTANT } from '@app/constant/globalLabels'
import { NgClass } from '@angular/common'
import { FormValueControl } from '@angular/forms/signals'
@Component({
    selector: 'app-inputpassword',
    templateUrl: './inputpassword.component.html',
    styleUrls: ['./inputpassword.component.css'],
    imports: [NgClass, FormsModule],
})
export class InputPasswordComponent implements FormValueControl<string> {
    value = model<string>('')

    errorMessage = input<string>('')
    autocomplete = input<string>('')
    label = input<string>('')
    placeHolder = input<string>('')
    hint = input<string>('')
    submitted = input<boolean>(false)
    errors_ = input<Map<string, string>>()
    showFlag = false
    type = 'password'

    get labels() {
        return CONSTANT
    }

    get contolName(): string {
        return this.label() ?? this.placeHolder() ?? ''
    }

    show() {
        this.showFlag = !this.showFlag
        this.type = this.showFlag ? 'text' : 'password'
    }

    change() {
        this.value.set(this.value())
    }
}
