import { Injectable } from '@angular/core'
import { ModalService } from './modal.service'

@Injectable({
    providedIn: 'root',
})
export class PopUpService {
    constructor(private modalService: ModalService) {}

    private message_ = ''
    private header_ = ''
    private time = 2000

    public getMessage() {
        return this.message_
    }
    private get message() {
        return this.message_
    }

    private set message(value: string) {
        this.message_ = value
    }

    public getHeader() {
        return this.header_
    }

    private get header() {
        return this.header_
    }

    private set header(value: string) {
        this.header_ = value
    }

    private close() {
        return;
    }

    public closePopup() {
        return;
    }

    public openPopup(header: string, message: string) {
        this.header_ = header
        this.message_ = message
    }

    showMessage(header: string, message: string, time = 2000) {
        this.header_ = header
        this.message_ = message
        this.time = time
        this.close.bind(this)
        setTimeout(() => {
            this.close()
        }, 2000)
    }
}
