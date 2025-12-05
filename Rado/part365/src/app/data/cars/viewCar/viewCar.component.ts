import { Component } from '@angular/core';
import { UpdateEnum } from '@model/enum/update.enum';
import AddCarComponent from '../addCar/addcar.component';

@Component({
  standalone: true,
  selector: 'app-viewcar',
  templateUrl: './viewCar.component.html',
  styleUrls: ['./viewCar.component.css'],
  imports: [AddCarComponent]
})
export default class ViewCarComponent {

  mode: UpdateEnum = UpdateEnum.View;
  
}
