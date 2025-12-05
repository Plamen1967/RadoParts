import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UpdateEnum } from '@model/enum/update.enum';
import  AddCarComponent  from '../addCar/addcar.component';
import { DisplayPartView } from '@model/displayPartView';

@Component({
  standalone: true,
  selector: 'app-updatecar',
  templateUrl: './updateCar.component.html',
  styleUrls: ['./updateCar.component.css'],
  imports: [AddCarComponent]
})
export default class UpdateCarComponent {

  mode: UpdateEnum = UpdateEnum.Update;
  @Input() id?: number;
  @Input() displayPartView?: DisplayPartView;
  @Input() carId?: number;
  @Input() query?: number;
  @Output() saved: EventEmitter<number> = new EventEmitter<number>()
  @Output() noChange: EventEmitter<number> = new EventEmitter<number>()

  backEvent(event: number) {
    this.noChange.emit(event)
  }
  savedEvent(event: number) {
    this.saved.emit(event)
  }
}
