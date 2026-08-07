import { Component, effect, input, output } from '@angular/core'
import { SelectedItemComponent } from '@components/custom-controls/selectedItem/selecteditem.component'
import { SelectionItem } from '@model/selectionItem'

@Component({
    selector: 'app-choise',
    templateUrl: './choise.component.html',
    styleUrls: ['./choise.component.css'],
    imports: [SelectedItemComponent],
})
export class ChoiseComponent {
    selectedItems = input<SelectionItem[]>([])
    _selectedItems: SelectionItem[] = []
    constructor() {
        effect(() => {
            this._selectedItems = this.selectedItems()
        })
    }


    deleteSelection = output<number>()

    unSelected(id: number) {
        this._selectedItems = this._selectedItems?.filter((item) => item.id !== id)
        this.deleteSelection.emit(id)
    }
}
