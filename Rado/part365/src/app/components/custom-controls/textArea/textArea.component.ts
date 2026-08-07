import { Component, input, model } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { NgClass, NgStyle } from '@angular/common'
import { FormValueControl } from '@angular/forms/signals'

@Component({
    selector: 'app-textarea',
    templateUrl: './textArea.component.html',
    styleUrls: ['./textArea.component.css'],
    imports: [NgClass, NgStyle, FormsModule],
})
export class TextAreaComponent implements FormValueControl<string> {
    value = model<string>('')
    label = input<string | undefined>()
    rows = input(2)
    border = input(true)
    submitted = input(false)
    length = input(500)
    placeHolder = input('')
    IsRequired = input<boolean | undefined>()

    IsInvalid = false
    errorMessage = 'This field is required'
    inputValue = ''


    get contolName(): string {
        return this.label() ?? this.placeHolder()
    }
    onTextChange() {
        this.value.set(this.inputValue)
        if (this.IsRequired()) {
            this.IsInvalid = this.inputValue.trim() === ''
        }
    }
}
