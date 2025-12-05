import { Component, DestroyRef, EventEmitter, Input, Output } from '@angular/core'
import { NgxGalleryImage } from '@app/ngx-gallery/models/ngx-gallery-image.model'
import { ImageService } from '@services/image.service'
import { DomSanitizer, SafeStyle } from '@angular/platform-browser'
import { NgxGalleryHelperService } from '@app/ngx-gallery/services/ngx-gallery-helper.service'
import { convertImage, convertImages, isMobile } from '@app/functions/functions'
import { DisplayPartView } from '@model/displayPartView'
import { NgClass, NgStyle } from '@angular/common'
import { AlertService } from '@services/alert.service'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatBadgeModule } from '@angular/material/badge'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
@Component({
    standalone: true,
    selector: 'app-imagecomponent',
    templateUrl: './image.component.html',
    styleUrls: ['./image.component.css'],
    imports: [NgStyle, NgClass],
    providers: [NgxGalleryHelperService, MatBadgeModule, MatIconModule, MatButtonModule],
})
export class ImageComponent {
    
    images: NgxGalleryImage[] = []
    public mainImage?: NgxGalleryImage
    numberImages?: number
    _partId?: number
    showIcon = false
    noImage = false

    @Input() height = '8em'
    @Input() width = '6em'
    @Input() showDetails = true
    @Input() id?: number
    @Input() showNumberPhotos = false
    @Input() set numberPhotos(value: number) {
        this.numberImages = value
    }

    @Input() set showImage(value: string) {
        this.mainImage = { small: value, medium: value, big: value }
    }

    @Input() set dispayPartView(value: DisplayPartView) {
        this._partId = value.id
        this.mainImage = value.mainImage
        this.numberImages = value.numberImages
        if (value.mainPicture) {
            this.mainImage = {}
            this.mainImage.medium = value.mainPicture
            this.mainImage.small = value.mainPicture
            this.mainImage.big = value.mainPicture
        } else if (value.mainImageData) {
            this.mainImage = convertImage(value.mainImageData)
        } else {
            if (!this.mainImage && value.numberImages) {
                this.alertService.error(`Main image missing ${this._partId}`)
                this.imageService
                    .getMainPicture(this._partId!)
                    .pipe(takeUntilDestroyed(this.destroyRef))
                    .subscribe((res) => {
                        if (res !== null) {
                            this.mainImage = convertImage(res!)
                            this.mainImageLoaded.emit(this.mainImage)
                        }
                        // if (!value.images && value.numberImages)
                        //   setTimeout(() => { this.restImages() }, 1000);
                    })
            }
        }
        this.images = value.ngImages!
    }

    @Input() imageNumbers?: number
    @Input() displayMain = false
    @Output() mainImageLoaded: EventEmitter<NgxGalleryImage> = new EventEmitter<NgxGalleryImage>()
    @Output() imagesLoaded: EventEmitter<NgxGalleryImage[]> = new EventEmitter<NgxGalleryImage[]>()

    @Input() set partId(value: number) {
        if (this._partId === value) return

        if (value === 0) {
            this.imagesLoaded.emit(this.images)
            return
        }

        this._partId = value

        this.imageService
            .getMainPicture(this.partId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((res) => {
                if (res) {
                    this.mainImage = convertImage(res)
                    this.mainImageLoaded.emit(this.mainImage)
                }

                setTimeout(() => {
                    this.restImages()
                }, 1000)
            })
    }

    constructor(
        private sanitization: DomSanitizer,
        private imageService: ImageService,
        private helperService: NgxGalleryHelperService,
        private alertService: AlertService,
        private destroyRef: DestroyRef
    ) {}

    background(image: NgxGalleryImage) {
        const str = "{'background-image': 'url(" + `"${image.medium}"` + ")'}"
        return str
    }

    getSafeUrl(image: string): SafeStyle {
        return this.sanitization.bypassSecurityTrustStyle(this.helperService.getBackgroundUrl(image))
    }

    get image() {
        if (this.mainImage && this.mainImage.medium != 'null') return this.mainImage.medium
        this.noImage = true
        return 'assets/NoImage.jpg'
    }

    restImages() {
        this.imageService
            .getImages(this.partId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((res) => {
                this.images = convertImages(res!)
                this.imagesLoaded.emit(this.images)
            })
    }

    get getNumberImages() {
        if (this.numberImages) {
            if (this.numberImages === 1) return `${this.numberImages} снимка`

            return `${this.numberImages} снимки`
        }

        return ''
    }
    get getOnlyNumbers() {
        if (this.numberImages) return `${this.numberImages}`

        return ''
    }

    get details() {
        if (this.mainImage && this.mainImage.medium != 'null') return 'Повече детайли и ' + this.getNumberImages

        return ''
    }
    get mobile() {
        return isMobile()
    }
}
