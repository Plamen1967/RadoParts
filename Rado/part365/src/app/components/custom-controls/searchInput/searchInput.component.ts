import { NgClass, NgStyle } from '@angular/common'
import { Component, ElementRef, EventEmitter, Input, Optional, Output, Self } from '@angular/core'
import { FormsModule, NgControl } from '@angular/forms'
import { BaseControl } from '../baseControl'
import { ErrorService } from '@services/error.service'

@Component({
    standalone: true,
    selector: 'app-searchinput',
    templateUrl: './searchInput.component.html',
    styleUrls: ['./searchInput.component.css'],
    imports: [FormsModule, NgStyle, NgClass],
})
export class SearchInputComponent extends BaseControl<string> {
    filter?: string
    clearBox?: boolean
    @Input() border = true
    @Input() label = ''
    @Input() placeHolder = ''

    @Output() filterChanged: EventEmitter<string> = new EventEmitter<string>()
    @Output() search: EventEmitter<string> = new EventEmitter<string>()

    constructor(
        @Optional() @Self() public ngControl: NgControl,
        errorService: ErrorService,
        element: ElementRef
    ) {
        super(ngControl, errorService, element)
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
       this.search.emit(this.filter)
    }

    onClearBox() {
        this.filter = ''
        this.updateCheckBox()
        this.filterChanged.emit(this.filter)
        if (this.onChange) this.onChange('');
    }

    updateCheckBox() {
        this.clearBox = this.filter ? true : false
    }
}
