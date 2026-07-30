import { NgClass, NgStyle } from '@angular/common'
import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { BaseControl } from '../baseControl'

@Component({
    selector: 'app-searchinput',
    templateUrl: './searchInput.component.html',
    styleUrls: ['./searchInput.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [FormsModule, NgStyle, NgClass],
})
export class SearchInputComponent extends BaseControl<string> {
    filter?: string
    clearBox?: boolean
    @Input() border = true
    @Input() label = ''
    @Input() placeHolder = ''

    @Output() filterChanged: EventEmitter<string> = new EventEmitter<string>()
    @Output() Search: EventEmitter<string> = new EventEmitter<string>()

    constructor() {
        super()
    }

    override writeValue(obj: string): void {
        this.value = obj
        this.inputValue = obj
        this.filter = obj
        this.updateCheckBox()
    }

    filterChange(event: Event) {
        this.filter = (event.target as HTMLInputElement).value
        this.updateCheckBox()
        if (this.onChange) this.onChange(this.filter!)
        this.filterChanged.emit(this.filter)
    }

    onSearch() {
        this.Search.emit(this.filter)
    }

    onClearBox() {
        this.filter = ''
        this.updateCheckBox()
        this.filterChanged.emit(this.filter)
        if (this.onChange) this.onChange('')
    }

    updateCheckBox() {
        this.clearBox = this.filter ? true : false
    }
}
