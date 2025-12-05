import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HelperComponent } from '@components/custom-controls/helper/helper.component';
import { SaveButtonComponent } from '../buttons/saveButton/saveButton.component';
import { CancelButtonComponent } from '../buttons/cancelButton/cancelButton.component';

@Component({
  standalone: true,
  selector: 'app-toolbar',
  templateUrl: './toolBar.component.html',
  styleUrls: ['./toolBar.component.css'],
  imports: [SaveButtonComponent,CancelButtonComponent]
})
export class ToolBarComponent extends HelperComponent {

  constructor() { super() }

  @Input({required: true}) canSave?: boolean;
  @Input({required: true}) canCancel?: boolean;
  @Input() saveName = this.labels.SAVE;
  @Input() cancelName = this.labels.CANCEL;
  @Input() changed = false;
  @Output() save = new EventEmitter()
  @Output() cancel = new EventEmitter()

  clickSave() {
    this.save.emit()
  }
  clickCancel() {
    this.cancel.emit()
  }

}
