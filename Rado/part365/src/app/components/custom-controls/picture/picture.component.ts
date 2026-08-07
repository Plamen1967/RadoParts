import { Component, computed, DestroyRef, effect, inject, input, output } from '@angular/core'
import { ImageService } from '@services/image.service'
import { HelperComponent } from '@components/custom-controls/helper/helper.component'
import { ImageData } from '@model/imageData'
import { UploadComponent } from '../upload/upload.component'
import { FormsModule } from '@angular/forms'
import { ConfirmServiceService } from '@app/dialog/services/confirmService.service'
import { OKCancelOption } from '@app/dialog/model/confirmDialogData'
import { PopUpService } from '@app/dialog/services/popUpService.service'
import { AlertService } from '@services/alert.service'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'

@Component({
    selector: 'app-picture',
    templateUrl: './picture.component.html',
    styleUrls: ['./picture.component.css'],
    imports: [UploadComponent, FormsModule],
})
export class PictureComponent extends HelperComponent {
    //#region services and variables
    private imageService: ImageService = inject(ImageService)
    private popupService: PopUpService = inject(PopUpService)
    private alertService: AlertService = inject(AlertService)
    private contirmationService: ConfirmServiceService = inject(ConfirmServiceService)
    private destroyRef: DestroyRef = inject(DestroyRef)
    //#endregion
    //#region variables
    updateFlag = input<boolean>(false)
    id = input<number | undefined>(undefined)
    images = input<ImageData[]>([])
    currentMainImageId = input<number | undefined>(undefined)
    mainImageFlag = input<boolean>(true)

    images_: ImageData[] = []
    mainImageIdChange = output<number>()
    currentMainImageId_?: number;
    deleteImageId?: number
    message?: string
    //#endregion

    constructor() {
        super()
        //#region inject services
        effect(() => {
            this.images_ = computed(() => this.images())()
            this.currentMainImageId_ = computed(() => this.currentMainImageId())()
        })
        //#endregion
    }

    imageAdded(image: ImageData[]) {
        image.forEach((x) => {
            this.images_.push(x)
        })
        if (this.images.length == 1 || this.images_.findIndex((image) => image.imageId === this.currentMainImageId()) === -1) {
            const id = this.images_[0].imageId ?? 0
            this.currentMainImageId_ = this.images_[0].imageId
            this.mainImageIdChange.emit(id)
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
                    const index = this.images_.findIndex((image) => image.imageId === this.deleteImageId)
                    if (index || index === 0) {
                        this.images_.splice(index, 1)
                    }
                    if (this.currentMainImageId() == this.deleteImageId) {
                        if (this.images.length > 0) imageChanged = this.images_[0].imageId
                        else imageChanged = 0
                    }

                    if (this.images.length == 1) imageChanged = this.images_[0].imageId

                    this.currentMainImageId_ = imageChanged
                    this.mainImageIdChange.emit(this.currentMainImageId_!)
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
        this.currentMainImageId_ = $event
        this.mainImageIdChange.emit(this.currentMainImageId_)
    }
}
