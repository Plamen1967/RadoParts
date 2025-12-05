import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HelperComponent } from '@components/helper.old/helper.component';

@Component({
  standalone: true,
  selector: 'app-clearbutton',
  templateUrl: './clearbutton.component.html',
  styleUrls: ['./clearbutton.component.css'],
  imports: []
})
export class ClearbuttonComponent extends HelperComponent implements OnInit {

  @Output() click: EventEmitter<void> = new EventEmitter(); 

  constructor() { super() }

  ngOnInit() {
  }

  generateEvent(event:Event) {
    event.stopPropagation();
    this.click.emit();
  }

}
