import { Component, model, input, effect } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { CONSTANT } from '@app/constant/globalLabels'
import { NgClass } from '@angular/common'
import { AutofocusDirective } from '@app/directive/autofocus.directive'
import { FormField, FormValueControl } from '@angular/forms/signals'

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css'],
    imports: [AutofocusDirective, NgClass, FormsModule],
})
export class UserComponent implements FormValueControl<string> {
    value = model('');
    label = input<string>('')
    placeHolder = input<string>('')
    hint = input<string>('')
    submitted = input<boolean>(false)
    prefix = input<string>('')
    controlName = input<string>('')
    errors_ = input<Map<string, string>>()
    readonly control = input<FormField<string> | null>(null);
    readonly isDisabled = input(false);
    readonly isInvalid = input(false);
    readonly isRequired = input(false);
    readonly hasErrors = input(false);
    constructor() {
        effect(() => {
            //this.hasErrors.set(this.isRequired() && this.isInvalid())
            });        
    }

    change() {
        // Handle change event
    }

    get labels() {
        return CONSTANT
    }
}
