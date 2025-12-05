import { Injectable } from '@angular/core';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {

constructor(private dialog: MatDialog) {
 }


openDialog(header:string, message:string, id = 'confirmDialog'): MatDialogRef<ConfirmationComponent> {
  const dialogRef: MatDialogRef<ConfirmationComponent> =  this.dialog.open(ConfirmationComponent, {
    data: { header: header, content: message, showButtonOk: true, showButtonCancel: true},
    width: '250px',
    ariaModal: true,
    disableClose: true,
    hasBackdrop: true,  
    id: id  
  })
  return dialogRef;
};

}
