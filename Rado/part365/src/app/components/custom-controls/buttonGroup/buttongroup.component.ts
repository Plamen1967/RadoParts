import { NgClass, NgStyle } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-buttongroup',
  templateUrl: './buttongroup.component.html',
  styleUrls: ['./buttongroup.component.css'],
  imports: [NgClass, FormsModule, NgStyle]
})

export class ButtonGroupComponent {

  @Input() selection?: string;
  @Input() clearBox?: boolean;
  @Input() active = false;
  @Input() placeholder?: string;
  @Input() useFilter = false;

  filter?: string;
  _clearBox?: boolean;

  @Output() clickSelect: EventEmitter<unknown> = new EventEmitter<unknown>();
  @Output() filterChanged: EventEmitter<unknown> = new EventEmitter<unknown>();
  @Output() clear: EventEmitter<unknown> = new EventEmitter<unknown>();

  onClickSelect(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (this.filter) this.onFilterChanged('');
    else this.clickSelect.emit(event)
  }

  onFilterChanged(event: string) {
    this.filterChanged.emit(event)
    this.filter = event;
    this.active = this.filter?true:false;
  }

  onClear(event: MouseEvent) {
    this.clear.emit(event);

  }


}
