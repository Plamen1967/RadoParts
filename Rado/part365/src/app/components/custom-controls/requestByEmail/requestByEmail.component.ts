//#region Imports

import { Component, DestroyRef, inject, OnInit, input, output, signal } from '@angular/core'
import { FormBuilder, ReactiveFormsModule } from '@angular/forms'
import { HelperComponent } from '@components/custom-controls/helper/helper.component'
import { ItemType } from '@model/enum/itemType.enum'
import { ImageService } from '@services/image.service'
import { MessageService } from '@app/messages/service/messageService'
import { NgStyle } from '@angular/common'
import { InputComponent } from '../input/input.component'
import { TextAreaComponent } from '../textArea/textArea.component'
import { CatchaComponent } from '../catcha/catcha.component'
import { PopUpService } from '@app/dialog/services/popUpService.service'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { Catcha } from '@model/catcha'
import { form, FormField } from '@angular/forms/signals'
//#endregion
//#region interface
interface requestByEmailInterface {
    name: string
    email: string
    request: string
    sendCopy: boolean
    catcha: string
}
//#endregion
//#region component
@Component({
    selector: 'app-requestbyemail',
    templateUrl: './requestByEmail.component.html',
    styleUrls: ['./requestByEmail.component.css'],
    imports: [ReactiveFormsModule, NgStyle, InputComponent, TextAreaComponent, CatchaComponent, FormField],
})
//#endregion
export class RequestByEmailComponent extends HelperComponent implements OnInit {
    //#region form
    requestByEmailModel = signal<requestByEmailInterface> ({
            name: '',
            email: '',
            request: '',
            sendCopy: false,
            catcha: '',
    })

    requestByEmail = form(this.requestByEmailModel)
    //#endregion
    message?: string
    imageData?: Catcha
    submitted!: boolean

    id = input.required<number>()
    itemType = input<ItemType | undefined>()

    messageSent = output<boolean>()
    private formBuilder: FormBuilder = inject(FormBuilder)
    private messageService: MessageService = inject(MessageService)
    private imageService: ImageService = inject(ImageService)
    private popupService: PopUpService = inject(PopUpService)
    private destroyRef: DestroyRef = inject(DestroyRef)

    constructor() {
        super()
    }

    ngOnInit() {
        this.imageService
            .getCatcha()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((imageData) => (this.imageData = imageData))
    }

    sendRequest() {
        this.submitted = true
        if (!this.requestByEmail().valid()) return
        this.imageService
            .verifyCatcha({ id: this.imageData?.imageId, catchaText: this.requestByEmailModel().catcha })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    const emailMessage = { ...this.requestByEmailModel(), ...{id: this.id(), itemType: this.itemType()}}
                    this.messageService
                        .sendEmail(emailMessage)
                        .pipe(takeUntilDestroyed(this.destroyRef))
                        .subscribe(() => {
                            this.popupService
                                .openWithTimeout('Съобщение', 'Е-майла е успешно изпратен!')
                                .pipe(takeUntilDestroyed(this.destroyRef))
                                .subscribe(() => {
                                    this.messageSent.emit(true)
                                })
                        })
                },
                error: (error) => {
                    this.popupService.openWithTimeout('Съобщение', error)
                },
                complete: () => {
                    return
                },
            })
    }
}
