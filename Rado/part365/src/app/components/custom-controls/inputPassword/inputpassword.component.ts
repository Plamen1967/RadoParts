import { Component, ElementRef, Input, Self } from '@angular/core'
import { FormsModule, NgControl } from '@angular/forms'
import { ErrorService } from '@services/error.service'
import { BaseControl } from '../baseControl'
import { CONSTANT } from '@app/constant/globalLabels'
import { NgClass } from '@angular/common'
@Component({
    standalone: true,
    selector: 'app-inputpassword',
    templateUrl: './inputpassword.component.html',
    styleUrls: ['./inputpassword.component.css'],
    imports: [NgClass, FormsModule]
})
export class InputPasswordComponent extends BaseControl<string> {
    @Input() label?: string
    @Input() placeHolder?: string
    @Input() hint?: string
    @Input() pattern?: string
    @Input() submitted = false

    showFlag = false
    type = 'password'

    constructor(@Self() control: NgControl, errorService: ErrorService, element: ElementRef) {
        super(control, errorService, element)
    }

    get labels() {
        return CONSTANT
    }

    override get contolName(): string {
        return this.control.name?.toString() ??  this.label ?? this.placeHolder ?? '';
    }

    show() {
        this.showFlag = !this.showFlag
        this.type = this.showFlag ? 'text' : 'password'
    }

    change() {
        if (this.onChange)
        this.onChange(this.value!)
    }
}
