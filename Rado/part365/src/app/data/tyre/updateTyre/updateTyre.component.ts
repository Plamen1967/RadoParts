import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UpdateEnum } from '@model/enum/update.enum';
import AddTyreComponent from '../addTyre/addTyre.component';
import { DisplayPartView } from '@model/displayPartView';

@Component({
  standalone: true,
  selector: 'app-updatetyre',
  templateUrl: './updateTyre.component.html',
  styleUrls: ['./updateTyre.component.css'],
  imports: [AddTyreComponent]
})
export default class UpdateTyreComponent {

  mode: UpdateEnum = UpdateEnum.Update;
  @Input() id?: number;
  @Input() displayPartView?: DisplayPartView;
    
  @Output() saved: EventEmitter<number> = new EventEmitter<number>()
  @Output() noChange: EventEmitter<number> = new EventEmitter<number>()

  backEvent(event: number) {
    this.noChange.emit(event)
  }
  savedEvent(event: number) {
    this.saved.emit(event)
  }
}
