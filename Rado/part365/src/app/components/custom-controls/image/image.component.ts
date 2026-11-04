import { Component, DestroyRef, inject, input, effect, output, computed, signal } from '@angular/core'
import { NgxGalleryImage } from '@app/ngx-gallery/models/ngx-gallery-image.model'
import { ImageService } from '@services/image.service'
import { NgxGalleryHelperService } from '@app/ngx-gallery/services/ngx-gallery-helper.service'
import { convertImage, convertImages } from '@app/functions/functions'
import { DisplayPartView } from '@model/displayPartView'
import { NgClass, NgStyle } from '@angular/common'
import { AlertService } from '@services/alert.service'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatBadgeModule } from '@angular/material/badge'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
@Component({
    selector: 'app-imagecomponent',
    templateUrl: './image.component.html',
    styleUrls: ['./image.component.css'],
    imports: [NgStyle, NgClass],
    providers: [NgxGalleryHelperService, MatBadgeModule, MatIconModule, MatButtonModule],
})
export class ImageComponent {
    images = signal<NgxGalleryImage[]>([])
    mainImage = signal<NgxGalleryImage | undefined>(undefined)
    imageCount = signal(0)
    _partId = signal(0)
    showIcon = signal(false)
    noImage = signal(false)
    private imageService: ImageService = inject(ImageService)
    private alertService: AlertService = inject(AlertService)
    private destroyRef: DestroyRef = inject(DestroyRef)

    // @Input() height = '8em'
    // @Input() width = '6em'
    showAsIcon = input<boolean>(false)
    showDetails = input<boolean>(true)
    id = input<number | undefined>()
    showNumberPhotos = input<boolean>(true)
    showImage = input<string>()
    dispayPartView = input<DisplayPartView>()
    imageNumbers = input<number>(0)
    displayMain = input<boolean>(false)
    mainImageLoaded = output<NgxGalleryImage>()
    imagesLoaded = output<NgxGalleryImage[]>()

    partId = input<number>(0)

    $imageCount = computed(() => {
        return this.imageNumbers() === 0 ? this.imageCount() : this.imageNumbers()
    })
    imageCountStr = computed(() => {
        if (this.$imageCount()) {
            if (this.$imageCount() === 1) return `${this.$imageCount()} снимка`

            return `${this.$imageCount()} снимки`
        }

        return ''
    })
    image = computed(() => {
        if (this.mainImage() && this.mainImage()?.medium != 'null') {
            return this.mainImage()?.medium
        }
        return undefined
    })

    details = computed(() => {
        if (this.mainImage() && this.mainImage()!.medium != 'null') return 'Повече детайли и ' + this.imageCountStr()

        return ''
    })

    constructor() {
        effect(() => {
            if (this.id()) {
                this.showIcon.set(this.id() === this._partId())
            }
            if (this.showImage()) {
                this.mainImage.set({ small: this.showImage(), medium: this.showImage(), big: this.showImage() })
            }
            if (this.dispayPartView()) {
                this.updateDisplayPartView(this.dispayPartView()!)
            }
            if (this.partId()) {
                this.updatePartId(this.partId()!)
            }
        })

        effect(() => {
            console.log(`Image Count ${this.imageCount()} ${this.$imageCount()} ${this.showAsIcon()} ${this.showNumberPhotos()}`)
        })
    }

    updatePartId(value: number) {
        if (this._partId() === value) return

        if (value === 0) {
            this.imagesLoaded.emit(this.images())
            return
        }

        this._partId.set(value)
        this.imageService
            .getMainPicture(this.partId())
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((res) => {
                if (res) {
                    this.mainImage.set(convertImage(res))
                    this.mainImageLoaded.emit(this.mainImage()!)
                }

                setTimeout(() => {
                    this.restImages()
                }, 1000)
            })
    }
    updateDisplayPartView(value: DisplayPartView) {
        this._partId.set(value.id!)
        this.mainImage.set(value.mainImage)
        this.imageCount.set(value.imageCount ?? 0)
        if (value.mainPicture) {
            this.mainImage.set({ medium: value.mainPicture, small: value.mainPicture, big: value.mainPicture })
        } else if (value.mainImageData) {
            this.mainImage.set(convertImage(value.mainImageData))
        } else {
            if (!this.mainImage() && value.imageCount) {
                this.alertService.error(`Main image missing ${this._partId()} ${value.imageCount}`)
                this.imageService
                    .getMainPicture(this._partId())
                    .pipe(takeUntilDestroyed(this.destroyRef))
                    .subscribe((res) => {
                        if (res !== null) {
                            this.mainImage.set(convertImage(res!))
                            this.mainImageLoaded.emit(this.mainImage()!)
                        }
                    })
            }
        }
        this.images.set(value.ngImages!)
    }
    // background(image: NgxGalleryImage) {
    //     const str = "{'background-image': 'url(" + `"${image.medium}"` + ")'}"
    //     return str
    // }

    restImages() {
        this.imageService
            .getImages(this.partId())
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((res) => {
                this.images.set(convertImages(res!))
                this.imagesLoaded.emit(this.images())
            })
    }
}
