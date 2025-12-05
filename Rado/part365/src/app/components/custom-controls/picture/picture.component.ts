import { Component, DestroyRef, EventEmitter, Input, Output } from '@angular/core'
import { ImageService } from '@services/image.service'
import { HelperComponent } from '@components/custom-controls/helper/helper.component'
import { ImageData } from '@model/imageData'
import { UploadComponent } from '../upload/upload.component'
import { FormsModule } from '@angular/forms'
import { ConfirmServiceService } from '@app/dialog/services/confirmService.service'
import { OKCancelOption } from '@app/dialog/model/confirmDialogData'
import { PopUpServiceService } from '@app/dialog/services/popUpService.service'
import { AlertService } from '@services/alert.service'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'

@Component({
    standalone: true,
    selector: 'app-picture',
    templateUrl: './picture.component.html',
    styleUrls: ['./picture.component.css'],
    imports: [UploadComponent, FormsModule],
})
export class PictureComponent extends HelperComponent {
    @Input() updateFlag?: boolean
    @Input({ required: true }) id?: number
    @Input() images: ImageData[] = []
    @Input() currentMainImageId?: number
    @Input() mainImageFlag = true

    @Output() mainImageIdChange: EventEmitter<number> = new EventEmitter<number>()

    deleteImageId?: number
    message?: string

    constructor(
        private imageService: ImageService,
        private popupService: PopUpServiceService,
        private alertService: AlertService,
        private contirmationService: ConfirmServiceService,
        private destroyRef: DestroyRef
    ) {
        super()
    }
    imageAdded(image: ImageData[]) {
        image.forEach((x) => {
            this.images.push(x)
        })
        if (this.images.length == 1 || this.images.findIndex((image) => image.imageId === this.currentMainImageId) === -1) {
            this.currentMainImageId = this.images[0].imageId
            this.mainImageIdChange.emit(this.images[0].imageId)
        }
    }

    deleteImageDlg(image: ImageData) {
        this.deleteImageId = image.imageId
        this.contirmationService
            .OKCancel('Съобщение', 'Моля потвърдете изтриването на снимката', 'Изтрий', 'Откажи@')
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((result) => {
                if (result === OKCancelOption.OK) {
                    this.deleteImage(this.deleteImageId!)
                }
            })
    }

    deleteImage(imageId: number) {
        this.imageService
            .deleteImage(imageId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.popupService.openWithTimeout(this.labels.MESSAGE, 'Снимката e успешно изтрита')

                    let imageChanged
                    const index = this.images.findIndex((image) => image.imageId === this.deleteImageId)
                    if (index || index === 0) {
                        this.images.splice(index, 1)
                    }
                    if (this.currentMainImageId == this.deleteImageId) {
                        if (this.images.length > 0) imageChanged = this.images[0].imageId
                        else imageChanged = 0
                    }

                    if (this.images.length == 1) imageChanged = this.images[0].imageId

                    this.currentMainImageId = imageChanged
                    this.mainImageIdChange.emit(this.currentMainImageId)
                },
                error: (error) => {
                    this.popupService.openWithTimeout(this.labels.MESSAGE, 'Снимката не може да бъде изтрита')
                    this.alertService.error(error)
                },
                complete: () => {
                    return
                },
            })
    }
    //#endregion

    get moreImages() {
        return this.images.length < 10
    }

    onChange($event: number) {
        this.currentMainImageId = $event
        this.mainImageIdChange.emit(this.currentMainImageId)
    }
}
