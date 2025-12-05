import { DestroyRef, Injectable } from '@angular/core';
import { ModalService } from './dialog-api/modal.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PopUpMessageComponent } from '@app/dialog/dialogs/popUpMessage/popUpMessage.component';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  public message = "";
  private opened = false;
  private dialogRef!: MatDialogRef<PopUpMessageComponent>;


  constructor(private modalService: ModalService, private dialog: MatDialog,
            private destroyRef: DestroyRef) { }


open(message: string, title = "Зареждане") {
  this.message = message;
    if (!this.opened) {
      this.opened = true;
      this.dialogRef = this.dialog.open(PopUpMessageComponent, {
        data: { title , content:message},
        panelClass: 'custom-container',
        disableClose: true,
        hasBackdrop: true,
      });

      this.dialogRef.afterClosed()
            .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.opened = false;
      });
    }
}

close() {
    this.dialogRef.close();
}

}

