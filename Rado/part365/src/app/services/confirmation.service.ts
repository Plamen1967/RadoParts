//#region imports
import { Injectable, inject } from '@angular/core'
import { ModalService } from './dialog-api/modal.service'
//#endregion
//#region service
@Injectable({
    providedIn: 'root',
})
//#endregion
export class ConfirmationService {
    //#region variables and services
    private modalService = inject(ModalService)

    public funcOk?() {
        return
    }
    public funcCancel?() {
        return
    }
    public header?: string
    private _content?: string
    public cancelButton = true
    //#endregion
    get content(): string | undefined {
        return this._content
    }

    set content(value: string) {
        console.log(value)
        this._content = value
    }

    open(header: string, message: string) {
        this.header = header
        this._content = message
        if (!this.funcCancel) this.cancelButton = false
        // TODO this.modalService.open('okCancelDlg')
    }

    close() {
        // TODO this.modalService.close('okCancelDlg')
        this.funcCancel = this.funcOk = undefined
    }
    public ok() {
        if (this.funcOk) {
            // TODO this.modalService.close('okCancelDlg')
            this.funcOk()
        } else console.log(`Something is wrong with ConfirmationService:Ok`)
    }
    public cancel() {
        if (this.funcCancel) {
            // TODO this.modalService.close('okCancelDlg')
            this.funcCancel()
        } else console.log(`Something is wrong with ConfirmationService:Cancel`)
    }
}
