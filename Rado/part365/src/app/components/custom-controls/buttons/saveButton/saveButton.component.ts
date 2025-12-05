import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-savebutton',
  templateUrl: './saveButton.component.html',
  styleUrls: ['./saveButton.component.css'],
  imports: []
})
export class SaveButtonComponent {

  @Input({required: true}) label = "Запиши";
  @Input() changed = true;
  @Output() saveEvent: EventEmitter<void> = new EventEmitter<void>()

  onSubmit() {
    this.saveEvent.emit();
  }
}
