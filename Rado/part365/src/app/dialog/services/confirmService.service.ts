import { inject, Injectable } from '@angular/core';
import { ConfirmDialogData, OKCancelOption } from '../model/confirmDialogData';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../dialogs/confirmDialog/confirmDialog.component';

@Injectable({
  providedIn: 'root',
})
export class ConfirmServiceService {
  matDialog = inject(MatDialog);
  response: Subject<OKCancelOption> = new Subject<OKCancelOption>();

  OKCancel(
    title: string,
    content: string,
    okButtonName = 'Потвърди',
    cancelButtonName = 'Откажи'
  ) {
    const data: ConfirmDialogData = {
      title: title,
      content: content,
      okButtonName: okButtonName,
      cancelButtonName: cancelButtonName,
      okCancel: OKCancelOption.Cancel,
    };

    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      panelClass: 'custom-container',
      data: data,
      disableClose: true,
    });
    return dialogRef.afterClosed();
  }


  OK(
    title: string,
    content: string,
    okButtonName = 'Потвърди',
  ) {
    const data: ConfirmDialogData = {
      title: title,
      content: content,
      okButtonName: okButtonName,
      okCancel: OKCancelOption.OK,
    };

    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      data: data,
      disableClose: true,
    });
    return dialogRef.afterClosed();
  }
}
