import { Component, Input } from '@angular/core';
import { Catcha } from '@model/catcha';

@Component({
  standalone: true,
  selector: 'app-catcha',
  templateUrl: './catcha.component.html',
  styleUrls: ['./catcha.component.css'],
  imports: [],
})
export class CatchaComponent{

  @Input() imageData?: Catcha;

}
