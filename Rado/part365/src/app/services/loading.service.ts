//#region imports
import { DestroyRef, Injectable, inject } from '@angular/core'
import { ModalService } from './dialog-api/modal.service'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { PopUpMessageComponent } from '@app/dialog/dialogs/popUpMessage/popUpMessage.component'
//#endregion
//#region service
@Injectable({
    providedIn: 'root',
})
//#endregion
export class LoadingService {
    //#region variables and services
    public message = ''
    private opened = false
    private dialogRef!: MatDialogRef<PopUpMessageComponent>
    private modalService = inject(ModalService)
    private dialog = inject(MatDialog)
    private destroyRef = inject(DestroyRef)
    //#endregion

    open(message: string, title = 'Зареждане') {
        this.message = message
        if (!this.opened) {
            this.opened = true
            this.dialogRef = this.dialog.open(PopUpMessageComponent, {
                data: { title, content: message },
                panelClass: 'custom-container',
                disableClose: true,
                hasBackdrop: true,
            })

            this.dialogRef
                .afterClosed()
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe(() => {
                    this.opened = false
                })
        }
    }

    close() {
        this.dialogRef.close()
    }
}
