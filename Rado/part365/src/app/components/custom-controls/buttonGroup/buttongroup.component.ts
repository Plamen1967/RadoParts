import { NgClass, NgStyle } from '@angular/common'
import { Component, computed, effect, input, output } from '@angular/core'
import { FormsModule } from '@angular/forms'

@Component({
    selector: 'app-buttongroup',
    templateUrl: './buttongroup.component.html',
    styleUrls: ['./buttongroup.component.css'],
    imports: [NgClass, FormsModule, NgStyle],
})
export class ButtonGroupComponent {
    selection = input<string>()
    clearBox = input<boolean | undefined>(undefined)
    active = input<boolean>(false)
    placeholder = input<string | undefined>(undefined)
    useFilter = input<boolean>(false)

    filter?: string
    active_ = false
    _clearBox?: boolean

    clickSelect = output<unknown>()
    filterChanged = output<unknown>()
    clear = output<unknown>()

    constructor() {
        effect(() => {
            this.active_ = computed(() => this.active())()
        })
    }
    onClickSelect(event: MouseEvent) {
        event.preventDefault()
        event.stopPropagation()
        if (this.filter) this.onFilterChanged('')
        else this.clickSelect.emit(event)
    }

    onFilterChanged(event: string) {
        this.filterChanged.emit(event)
        this.filter = event
        this.active_ = this.filter ? true : false
    }

    onClear(event: MouseEvent) {
        this.clear.emit(event)
    }
}
