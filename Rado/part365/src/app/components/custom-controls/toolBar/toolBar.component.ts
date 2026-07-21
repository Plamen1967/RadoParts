import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HelperComponent } from '@components/custom-controls/helper/helper.component';
import { SaveButtonComponent } from '../buttons/saveButton/saveButton.component';
import { CancelButtonComponent } from '../buttons/cancelButton/cancelButton.component';

@Component({
    selector: 'app-toolbar',
    templateUrl: './toolBar.component.html',
    styleUrls: ['./toolBar.component.css'],
    imports: [SaveButtonComponent, CancelButtonComponent]
})
export class ToolBarComponent extends HelperComponent {

  constructor() { super() }

  @Input({required: true}) canSave?: boolean;
  @Input({required: true}) canCancel?: boolean;
  @Input() saveName = this.labels.SAVE;
  @Input() cancelName = this.labels.CANCEL;
  @Input() isChanged = false;
  @Output() Save = new EventEmitter()
  @Output() Cancel = new EventEmitter()

  clickSave() {
    this.Save.emit()
  }
  clickCancel() {
    this.Cancel.emit()
  }

}
