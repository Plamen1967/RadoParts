import { Component, Input } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { BaseControl } from '../baseControl'
import { CONSTANT } from '@app/constant/globalLabels'
import { NgClass } from '@angular/common'
@Component({
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

    constructor() {
        super()
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
