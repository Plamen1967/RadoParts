import { Component, effect, inject, input, OnInit, output } from '@angular/core'
import { HelperComponent } from '../helper/helper.component'
import { ImageData } from '@model/imageData'
import { FormsModule } from '@angular/forms'
import { UploadComponent } from '../upload/upload.component'
import { ImageService } from '@services/image.service'
import { PopUpService } from '@app/dialog/services/popUpService.service'
import { CONSTANT } from '@app/constant/globalLabels'
import { ConfirmServiceService } from '@app/dialog/services/confirmService.service'
import { OKCancelOption } from '@app/dialog/model/confirmDialogData'
import { ToastService } from '@services/dialog-api/ToastService/toast.service'

@Component({
    selector: 'app-imagelist',
    templateUrl: './imagelist.component.html',
    styleUrls: ['./imagelist.component.css'],
    imports: [FormsModule, UploadComponent],
})
export class ImageListComponent extends HelperComponent implements OnInit {
    id = input.required<number>()
    mainImage = input.required<number>()
    mainImageId?: number
    images_ : ImageData[] = []
    images = input<ImageData[]>([])

    UpdateFlag = input<boolean>(false)
    defaultImageEvent = output<number>()

    private imageService: ImageService = inject(ImageService)
    private popupService: PopUpService = inject(PopUpService)
    private confirmService: ConfirmServiceService = inject(ConfirmServiceService)
    private toastService: ToastService = inject(ToastService)

    constructor() {
        super()
        effect(() => {
            if (this.mainImage()) {
                this.mainImageId = this.mainImage()
                this.setDefaultImageById(this.mainImage())
            }

            if (this.images()) {
                this.images_ = [...this.images()]
            }
        })
    }

    ngOnInit(): void {
        if (this.id && this.images()) {
            this.imageService.getImages(this.id()!).subscribe((res) => {
                this.images_ = [...res]
                this.setDefaultImageById(this.mainImage())
            })
        }
    }

    setDefaultImageById(imageId: number) {
        const index = this.images_.findIndex((item) => item.imageId == imageId)
        if (index != -1 && this.images_) {
            const imageMain = this.images_.splice(index, 1)
            this.images_.unshift(imageMain[0])
        } else if (this.images_?.length) {
            this.mainImageId = this.images_[0].imageId
        }
    }

    defaultImageChanged(imageId: number) {
        this.mainImageId = imageId
        this.defaultImageEvent.emit(this.mainImageId)
    }
    setDefaultImage(image: ImageData) {
        if (!this.images_) return
        this.setDefaultImageById(image.imageId!)
        this.defaultImageChanged(image.imageId!)
    }

    addImage(image: ImageData[]) {
        image.forEach((x) => {
            this.images_?.push(x)
        })

        if (this.images_.length == 1 || !this.mainImageId) this.defaultImageChanged(this.images_[0].imageId!)
    }

    deleteImage(image: ImageData) {
        this.confirmService.OKCancel('Съобщение', 'Потвърдете, че желаете да изтиете снмката').subscribe({
            next: (res) => {
                if (res === OKCancelOption.OK) {
                    this.imageService.deleteImage(image.imageId!).subscribe({
                        next: () => {
                            this.toastService.show('Снимката е успешно изтрита', 2)
                            const index = this.images_.findIndex((item) => item.imageId === +image.imageId!)
                            if (index || index === 0) {
                                this.images_.splice(index, 1)
                            }
                            if (this.mainImageId == image.imageId!)
                                if (this.images_.length > 0) this.defaultImageChanged(this.images_[0].imageId!)
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
