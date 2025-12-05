import { Component, EventEmitter, Output } from '@angular/core';
import { HelperComponent } from '@components/helper.old/helper.component';

@Component({
  standalone: true,
  selector: 'app-searchbutton',
  templateUrl: './searchbutton.component.html',
  styleUrls: ['./searchbutton.component.css'],
  imports: []
})
export class SearchbuttonComponent extends HelperComponent  {

  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() click = new EventEmitter<void>(); 

  constructor() { super() }

  

  generateEvent(event:Event) {
    event.stopPropagation();
    this.click.emit();
  }
}
