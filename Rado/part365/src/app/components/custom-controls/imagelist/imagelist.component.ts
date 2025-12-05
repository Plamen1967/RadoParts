import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { HelperComponent } from '../helper/helper.component'
import { ImageData } from '@model/imageData'
import { FormsModule } from '@angular/forms'
import { UploadComponent } from '../upload/upload.component'
import { ImageService } from '@services/image.service'
import { PopUpServiceService } from '@app/dialog/services/popUpService.service'
import { CONSTANT } from '@app/constant/globalLabels'
import { ConfirmServiceService } from '@app/dialog/services/confirmService.service'
import { OKCancelOption } from '@app/dialog/model/confirmDialogData'
import { ToastService } from '@services/dialog-api/ToastService/toast.service'

@Component({
    standalone: true,
    selector: 'app-imagelist',
    templateUrl: './imagelist.component.html',
    styleUrls: ['./imagelist.component.css'],
    imports: [FormsModule, UploadComponent],
})
export class ImageListComponent extends HelperComponent implements OnInit {
    mainImageId?: number

    @Input({ required: true }) id?: number
    @Input({ required: true }) set mainImage(value: number) {
        this.mainImageId = value
        this.setDefaultImageById(this.mainImageId!)
    }
    @Input() images: ImageData[] = []
    @Input() UpdateFlag = false
    @Output() defaultImageEvent: EventEmitter<number> = new EventEmitter<number>()

    constructor(
        private imageService: ImageService,
        private popupService: PopUpServiceService,
        private confirmService: ConfirmServiceService,
        private toastService: ToastService
    ) {
        super()
    }

    ngOnInit(): void {
        if (this.id && this.images) {
            this.imageService.getImages(this.id!).subscribe((res) => {
                this.images = res
                this.setDefaultImageById(this.mainImageId!)
            })
        }
    }

    setDefaultImageById(imageId: number) {
        const index = this.images.findIndex((item) => item.imageId == imageId)
        if (index != -1) {
            const imageMain = this.images.splice(index, 1)
            this.images.unshift(imageMain[0])
        } else if (this.images?.length) {
            this.mainImageId = this.images[0].imageId
        }
    }

    defaultImageChanged(imageId: number) {
        this.mainImageId = imageId
        this.defaultImageEvent.emit(this.mainImageId)
    }
    setDefaultImage(image: ImageData) {
        if (!this.images) return
        this.setDefaultImageById(image.imageId!)
        this.defaultImageChanged(image.imageId!)
    }

    addImage(image: ImageData[]) {
        image.forEach((x) => {
            this.images.push(x)
        })

        if (this.images.length == 1 || !this.mainImageId) this.defaultImageChanged(this.images[0].imageId!)
    }

    deleteImage(image: ImageData) {
        this.confirmService.OKCancel('Съобщение', 'Потвърдете, че желаете да изтиете снмката').subscribe({
            next: (res) => {
                if (res === OKCancelOption.OK) {
                    this.imageService.deleteImage(image.imageId!).subscribe({
                        next: () => {
                            this.toastService.show('Снимката е успешно изтрита', 2)
                            const index = this.images.findIndex((item) => item.imageId === +image.imageId!)
                            if (index || index === 0) {
                                this.images.splice(index, 1)
                            }
                            if (this.mainImageId == image.imageId!)
                                if (this.images.length > 0) this.defaultImageChanged(this.images[0].imageId!)
                                else this.defaultImageChanged(0)
                        },
                        error: () => {
                            this.confirmService.OK(CONSTANT.MESSAGE, 'Снимката не може да бъде изтрита')
                        },
                    })
                }
            },
        })
    }

}
