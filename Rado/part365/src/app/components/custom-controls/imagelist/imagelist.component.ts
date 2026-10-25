import { Component, computed, effect, inject, input, OnInit, output, signal } from '@angular/core'
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
import { httpResource } from '@angular/common/http'
import { environment } from '@env/environment'

@Component({
    selector: 'app-imagelist',
    templateUrl: './imagelist.component.html',
    styleUrls: ['./imagelist.component.css'],
    imports: [FormsModule, UploadComponent],
})
export class ImageListComponent extends HelperComponent implements OnInit {
    itemId = input<number>()
    mainImage = input.required<number>()
    mainImageId = signal(0)
    images_ = signal<ImageData[]>([])
    images = input<ImageData[]>([])

    UpdateFlag = input<boolean>(false)
    defaultImageEvent = output<number>()

    private imageService: ImageService = inject(ImageService)
    private popupService: PopUpService = inject(PopUpService)
    private confirmService: ConfirmServiceService = inject(ConfirmServiceService)
    private toastService: ToastService = inject(ToastService)

    $mainImage = computed(() => {
        if (this.mainImageId() != 0)
            return this.mainImageId()
        return this.mainImage()
    })
    imageResource = httpResource<ImageData[]>(() => ({
            url: `${environment.restAPI}/image/GetImages?id=${this.itemId()}`,
            defaultValue: [],
            parse: (res: ImageData[]) => {
                    this.images_.set([...res])
                    this.setDefaultImageById(this.mainImage())
                    return res
            },
    }))


// }

// resource = httpResource<UserList>(() => ({
//     url: "api/schools/collection/filter",
//     method: "POST",
//     body: {pageSize: this.pageSize(), page: this.page()}
//   }));

    constructor() {
        super()
        effect(() => {
            console.log(`Main image: ${this.$mainImage()} ${this.mainImageId()}`)
        })
        effect(() => {
            console.log(`Images Item Id: ${this.itemId()} ${this.mainImage()}`)
        })
        effect(() => {
            if (this.images()) {
                this.images_.set([...this.images()])
            }
        })
        // effect(() => {
        //     if (this.mainImage()) {
        //         this.mainImageId = this.mainImage()
        //         this.setDefaultImageById(this.mainImage())
        //     }

        // })
    }

    ngOnInit(): void {
        if (this.itemId()) {
            this.imageService.getImages(this.itemId()!).subscribe((res) => {
                this.images_.set([...res])
                this.setDefaultImageById(this.mainImage())
            })
        }
    }

    setDefaultImageById(imageId: number) {
        const currentImages = [...this.images_()]
        const index = currentImages.findIndex((item) => item.imageId == imageId)

        if (index !== -1) {
            const [imageMain] = currentImages.splice(index, 1)
            currentImages.unshift(imageMain)
            this.images_.set(currentImages)
            return
        }

        if (currentImages.length) {
            this.mainImageId.set(currentImages[0].imageId!)
        }
    }

    defaultImageChanged(imageId: number) {
        this.mainImageId.set(imageId)
        this.defaultImageEvent.emit(this.mainImageId())
    }

    setDefaultImage(image: ImageData) {
        if (!this.images_()) return
        this.setDefaultImageById(image.imageId!)
        this.defaultImageChanged(image.imageId!)
    }

    addImage(image: ImageData[]) {
        const currentImages = [...this.images_()]
        image.forEach((x) => currentImages.push(x))
        this.images_.set(currentImages)

        if (currentImages.length == 1 || !this.mainImageId()) this.defaultImageChanged(currentImages[0].imageId!)
    }

    deleteImage(image: ImageData) {
        this.confirmService.OKCancel('Съобщение', 'Потвърдете, че желаете да изтиете снмката').subscribe({
            next: (res) => {
                if (res === OKCancelOption.OK) {
                    this.imageService.deleteImage(image.imageId!).subscribe({
                        next: () => {
                            this.toastService.show('Снимката е успешно изтрита', 2)
                            const currentImages = [...this.images_()]
                            const index = currentImages.findIndex((item) => item.imageId === +image.imageId!)

                            if (index !== -1) {
                                currentImages.splice(index, 1)
                                this.images_.set(currentImages)
                            }

                            if (this.mainImageId() == image.imageId!)
                                if (this.images_().length > 0) this.defaultImageChanged(this.images_()[0].imageId!)
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
