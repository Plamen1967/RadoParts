import { Component } from '@angular/core';
import AddCarComponent from '@app/data/cars/addCar/addcar.component';

@Component({
  standalone: true,
  selector: 'app-addbus',
  templateUrl: './addBus.component.html',
  styleUrls: ['./addBus.component.css'],
  imports: [AddCarComponent]
})
export default class AddBusComponent {

}
