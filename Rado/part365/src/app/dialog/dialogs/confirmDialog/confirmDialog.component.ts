import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { ConfirmDialogData, OKCancelOption } from '../../model/confirmDialogData';

@Component({
  standalone: true,
  selector: 'app-confirmdialog',
  templateUrl: './confirmDialog.component.html',
  styleUrls: ['./confirmDialog.component.css'],
  imports: [MatDialogActions, MatDialogClose]
})
export class ConfirmDialogComponent {
  ok = OKCancelOption.OK;
  cancel = OKCancelOption.Cancel;

  showCancelButton = true;
  data:ConfirmDialogData = inject(MAT_DIALOG_DATA);
  constructor() {
    this.showCancelButton = this.data.okCancel == OKCancelOption.Cancel;
    this.showCancelButton = true;
   }


}
