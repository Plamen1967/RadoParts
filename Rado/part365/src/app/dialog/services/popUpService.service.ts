import { Injectable } from '@angular/core'
import { PopUpDialogData } from '../model/popUpDialogData'
import { MatDialog } from '@angular/material/dialog'
import { PopUpMessageComponent } from '../dialogs/popUpMessage/popUpMessage.component'

@Injectable({
    providedIn: 'root',
})
export class PopUpServiceService {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dialogRef?: any
    constructor(private matDialog: MatDialog) {}

    openWithTimeout(title: string, content: string, timeout = 2000) {
        const data: PopUpDialogData = {
            title: title,
            content: content,
        }
        const dialogRef = this.matDialog.open(PopUpMessageComponent, {
            panelClass: 'custom-container',
            data: data,
            disableClose: true,
        })

        setTimeout(() => {
            this.matDialog.closeAll()
        }, timeout)

        return dialogRef.afterClosed()
    }

    open(content: string) {
        const data: PopUpDialogData = {
            content: content,
        }
        this.dialogRef = this.matDialog.open(PopUpMessageComponent, {
            panelClass: 'custom-container',
            data: data,
            disableClose: true,
        })
    }

    close() {
        this.dialogRef?.close()
    }
}

