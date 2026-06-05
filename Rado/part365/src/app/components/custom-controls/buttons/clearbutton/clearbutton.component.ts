import { Component, EventEmitter, Output } from '@angular/core';
import { HelperComponent } from '@components/helper.old/helper.component';

@Component({
    standalone: true,
    selector: 'app-clearbutton',
    templateUrl: './clearbutton.component.html',
    styleUrls: ['./clearbutton.component.css'],
    imports: []
})
export class ClearbuttonComponent extends HelperComponent  {

  @Output() clickButton: EventEmitter<void> = new EventEmitter<void>(); 

  constructor() { 
    super() 
  }

  

  generateEvent(event:Event) {
    event.stopPropagation();
    this.clickButton.emit();
  }

}
