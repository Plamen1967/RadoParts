import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SelectedItemComponent } from '@components/custom-controls/selectedItem/selecteditem.component';
import { SelectionItem } from '@model/selectionItem';

@Component({
  standalone: true,
  selector: 'app-choise',
  templateUrl: './choise.component.html',
  styleUrls: ['./choise.component.css'],
  imports: [NgFor, NgIf, SelectedItemComponent]
})
export class ChoiseComponent {

  _selectedItems?: SelectionItem[];

  @Input() set selectedItems(value) {
    this._selectedItems = value;
  };
  get selectedItems() { return this._selectedItems};

  @Output() deleteSelection: EventEmitter<number> = new EventEmitter<number>()

  unSelected(id: number) {
    this._selectedItems = this._selectedItems?.filter(item => item.id !== id);
    this.deleteSelection.emit(id);
  }

}
