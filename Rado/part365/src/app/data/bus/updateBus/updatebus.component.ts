import { Component, EventEmitter, Input, Output } from '@angular/core';
import AddCarComponent from '@app/data/cars/addCar/addcar.component';
import { DisplayPartView } from '@model/displayPartView';
import { UpdateEnum } from '@model/enum/update.enum';

@Component({
  standalone: true,
  selector: 'app-updatebus',
  templateUrl: './updatebus.component.html',
  styleUrls: ['./updatebus.component.css'],
  imports: [AddCarComponent]
})
export default class UpdateBusComponent {

  bus = 1;
  mode = UpdateEnum.Update;
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
