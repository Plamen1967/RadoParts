import { Component, Input, ChangeDetectionStrategy } from '@angular/core'
import { BaseControl } from '../baseControl'
import { FormsModule } from '@angular/forms'
import { NgClass, NgStyle } from '@angular/common'

@Component({
    selector: 'app-input',
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [NgStyle, NgClass, FormsModule],
})
export class InputComponent extends BaseControl<string> {
    @Input() label?: string
    @Input() placeHolder?: string
    @Input() hint?: string
    @Input() pattern?: string
    @Input() border = true
    @Input() price?: boolean = undefined
    @Input() inline = true
    @Input() required?: boolean
    @Input() sizeInput = 'col-sm-10'
    @Input() submitted = false
    @Input() floating?: boolean
    @Input() small = true
    @Input() id = ''
    @Input() keyword?: boolean
    @Input() show?: boolean
    @Input() suffix?: string
    @Input() prefix?: string
    @Input() number?: boolean
    @Input() text = 'text'

    // prefer inject() over constructor parameter injection
    constructor() {
        super()
    }

    override get contolName(): string {
        return this.label || this.placeHolder || ''
    }

    get type() {
        return this.text
    }
    sizeClass() {
        return this.sizeInput
    }

    onChangeEvent() {
        return
    }

    inputFunc() {
        if (this.onChange) this.onChange(this.inputValue!)
        return
    }

    onFocus() {
        if (this.price) {
            if (this.inputValue?.toString() == '0') {
                this.inputValue = ''
            }
        }
    }
    onBlur() {
        if (this.price) {
            if (this.inputValue?.toString() == '') {
                this.inputValue = '0'
            }
        }
    }
}
