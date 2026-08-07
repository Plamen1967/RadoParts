import { Component, input, output } from '@angular/core'
import { SelectionItem } from '@model/selectionItem'

@Component({
    selector: 'app-selecteditem',
    templateUrl: './selecteditem.component.html',
    styleUrls: ['./selecteditem.component.css'],
    imports: [],
})
export class SelectedItemComponent {
    item = input<SelectionItem | undefined>()
    unSelectedId = output<number>()
    color = 'blue'

    unSelect() {
        const id = this.item()?.id
        if (id !== undefined)
            this.unSelectedId.emit(id)
    }

    clear() {
        const id = this.item()?.id
        if (id)
            this.unSelectedId.emit(id)
    }
}
