//#region imports
import { Component, ViewEncapsulation, ElementRef, Input, OnInit, OnDestroy, inject } from '@angular/core'
import { ModalService } from '@services/dialog-api/modal.service'
//#endregion
//#region component
@Component({
    selector: 'app-jw-modal',
    templateUrl: 'jw-modal.component.html',
    styleUrls: ['jw-modal.component.css'],
    encapsulation: ViewEncapsulation.None,
    imports: [],
})
//#endregion
export class ModalComponent implements OnInit, OnDestroy {
    //#region variables and services
    @Input() id?: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private element: any
    private modalService: ModalService = inject(ModalService)
    private el: ElementRef = inject(ElementRef)
    //#endregion

    constructor() {
        this.element = this.el.nativeElement
    }

    ngOnInit(): void {
        // ensure id attribute exists
        if (!this.id) {
            console.error('modal must have an id')
            return
        }

        // move element to bottom of page (just before </body>) so it can be displayed above everything else
        document.body.appendChild(this.element)

        // close modal on background click
        this.element.addEventListener('click', (el: { target: { className: string } }) => {
            if (el.target.className === 'jw-modal') {
                this.close()
            }
        })

        // add self (this modal instance) to the modal service so it's accessible from controllers
        this.modalService.add(this)
    }

    // remove self from modal service when component is destroyed
    ngOnDestroy(): void {
        this.element.remove()
    }

    // open modal
    open(): void {
        this.element.style.display = 'block'
        document.body?.classList.add('jw-modal-open')
    }

    // close modal
    close(): void {
        this.element.style.display = 'none'
        document.body?.classList.remove('jw-modal-open')
    }
}
