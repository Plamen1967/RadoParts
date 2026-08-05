import { NgClass, NgStyle } from '@angular/common'
import { Component, effect, EventEmitter, input, model, Output } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { FormValueControl } from '@angular/forms/signals'

@Component({
    selector: 'app-searchinput',
    templateUrl: './searchInput.component.html',
    styleUrls: ['./searchInput.component.css'],
    imports: [FormsModule, NgStyle, NgClass],
})
export class SearchInputComponent implements FormValueControl<string> {
    value = model('');
    filter?: string
    clearBox?: boolean
    border = input<boolean>(true)
    label = input<string>('')
    placeHolder = input<string>('')

    @Output() filterChanged: EventEmitter<string> = new EventEmitter<string>()
    @Output() Search: EventEmitter<string> = new EventEmitter<string>()

    constructor() {
        effect(() => {
            this.clearBox = this.value() ? true : false
            this.filter = this.value()
            this.updateCheckBox()
            this.filterChanged.emit(this.filter)
        })
    }

    // override writeValue(obj: string): void {
    //     this.value = obj
    //     this.inputValue = obj
    //     this.filter = obj
    //     this.updateCheckBox()
    // }

    filterChange(event: Event) {
        this.filter = (event.target as HTMLInputElement).value
        this.value.set(this.filter ?? '')
    }

    onSearch() {
        this.Search.emit(this.filter)
    }

    onClearBox() {
        this.value.set('')
    }

    updateCheckBox() {
        this.clearBox = this.filter ? true : false
    }
}
