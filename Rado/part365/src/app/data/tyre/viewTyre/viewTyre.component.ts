import { Component } from '@angular/core';
import { UpdateEnum } from '@model/enum/update.enum';
import AddTyreComponent from '../addTyre/addTyre.component';

@Component({
  standalone: true,
  selector: 'app-viewtyre',
  templateUrl: './viewTyre.component.html',
  styleUrls: ['./viewTyre.component.css'],
  imports: [AddTyreComponent]
})
export default class ViewTyreComponent {

  mode: UpdateEnum = UpdateEnum.View;
}
