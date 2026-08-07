//#region Imports

import { Component, DestroyRef, inject, OnInit, input, output } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
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

@Component({
    selector: 'app-requestbyemail',
    templateUrl: './requestByEmail.component.html',
    styleUrls: ['./requestByEmail.component.css'],
    imports: [ReactiveFormsModule, NgStyle, InputComponent, TextAreaComponent, CatchaComponent],
})
//#endregion
export class RequestByEmailComponent extends HelperComponent implements OnInit {
    message?: string
    imageData?: Catcha
    requestByEmail: FormGroup
    submitted!: boolean

    id = input.required<number>();
    itemType = input<ItemType | undefined>()

    messageSent = output<boolean>()
    private formBuilder: FormBuilder = inject(FormBuilder)
    private messageService: MessageService = inject(MessageService)
    private imageService: ImageService = inject(ImageService)
    private popupService: PopUpService = inject(PopUpService)
    private destroyRef: DestroyRef = inject(DestroyRef)

    constructor() {
        super()
        this.requestByEmail = this.formBuilder.group({
            name: ['', Validators.required],
            email: ['', Validators.required],
            request: ['', Validators.required],
            sendCopy: [false],
            catcha: ['', Validators.required],
        })
    }

    ngOnInit() {
        this.imageService
            .getCatcha()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((imageData) => (this.imageData = imageData))
    }

    sendRequest() {
        this.submitted = true
        if (!this.requestByEmail.valid) return
        this.imageService
            .verifyCatcha({ id: this.imageData?.imageId, catchaText: this.requestByEmail.value.catcha })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    const emailMessage = this.requestByEmail.value
                    emailMessage['id'] = this.id
                    emailMessage['itemType'] = this.itemType
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
