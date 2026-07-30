import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core'
import { SelectionItem } from '@model/selectionItem'

@Component({
    selector: 'app-selecteditem',
    templateUrl: './selecteditem.component.html',
    styleUrls: ['./selecteditem.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [],
})
export class SelectedItemComponent {
    @Input() item?: SelectionItem
    @Output() unSelectedId: EventEmitter<number> = new EventEmitter<number>()

    color = 'blue'
    unSelect() {
        this.unSelectedId.emit(this.item?.id)
    }

    clear() {
        this.unSelectedId.emit(this.item?.id)
    }
}
