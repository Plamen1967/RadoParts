//#region import
import { HttpClient, HttpEventType } from '@angular/common/http'
import { Component, DestroyRef, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { HelperComponent } from '@components/custom-controls/helper/helper.component'
import { ImageService } from '@services/image.service'
import { WebcamImage } from 'ngx-webcam'
import { ImageData } from '@model/imageData'
import { CameraComponent } from '../camera/camera.component'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { PopUpServiceService } from '@app/dialog/services/popUpService.service'
import { CONSTANT } from '@app/constant/globalLabels'
import { ErrorService } from '@services/error.service'
//#endregion
//#region component
@Component({
    standalone: true,
    selector: 'app-upload',
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.css'],
    imports: [CameraComponent],
})
//#endregion
export class UploadComponent extends HelperComponent implements OnInit {
    public progress = 0
    public message?: string
    cameraOn = false
    webcamImage: WebcamImage | undefined
    images: ImageData[] = []
    maxPictures = 10
    imageCount?: number

    @Input({ required: true }) id?: number
    @Input({ required: true }) businessCard?: boolean
    @Input({ required: true }) addPicture?: string = 'Добави снимка'
    @Input() multiple?: boolean
    @Input() camera = true

    @Output() uploadFinished = new EventEmitter<ImageData[]>()
    @Output() uploadProcess = new EventEmitter<number>()

    constructor(
        private http: HttpClient,
        private imageService: ImageService,
        private destroyRef: DestroyRef,
        private popupService: PopUpServiceService,
        private errorService: ErrorService
    ) {
        super()
    }
    ngOnInit(): void {
        this.updateCount();
    }
    get buttonMessage() {
        if (this.businessCard) return 'Качи Бизнес карта'
        else return this.labels.UPLOAD
    }

    handleImage(webcamImage: WebcamImage) {
        this.webcamImage = webcamImage
        const imageId = Date.now()
        if (this.imageCount === this.maxPictures) {
            this.popupService.openWithTimeout(CONSTANT.MESSAGE, 'Максималният брой снимки 10 е достигнат')
        } else {
            this.imageService
                .uploadWebImage(this.id!, imageId, webcamImage.imageAsBase64)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe({
                    next: (image) => {
                        const images: ImageData[] = []
                        images.push(image)
                        this.uploadFinished.emit(images)
                        this.cameraOn = false
                        this.updateCount()
                    },
                    error: (error) => {
                        this.popupService.openWithTimeout(CONSTANT.MESSAGE, error)
                    },
                })
        }
    }

    updateCount() {
        if (this.id) {
            this.imageService.getImageCount(this.id!)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (count) => (this.imageCount = count),
                error: (error) => this.errorService.logError(error),
            })
            }
            else {
                this.imageCount = 0;
            }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public uploadFile(event: any) {
        if (event.target.files.length === 0) {
            return
        }
        const total = event.target.files.length + this.imageCount

        if (total > this.maxPictures) this.popupService.openWithTimeout(CONSTANT.MESSAGE, 'Максималният брой снимки които може да качите е 10', 3000)
        else {
            try {
                this.imageService
                    .uploadImages(event.target.files, this.id!, this.businessCard!)
                    .pipe(takeUntilDestroyed(this.destroyRef))
                    .subscribe({
                        next: (event) => {
                            if (event.type === HttpEventType.UploadProgress) this.progress = Math.round((100 * event.loaded) / event.total!)
                            else if (event.type === HttpEventType.Response) {
                                this.message = 'Качването на снимката e успешно.'
                                setTimeout(() => {
                                    this.message = ''
                                }, 5000)
                                this.images = [...event.body!]
                                this.uploadFinished.emit(this.images)
                                this.updateCount()
                            }
                        },
                        error: (error) => {
                            this.popupService.openWithTimeout(CONSTANT.MESSAGE, error.error.message)
                        },
                    })
            } catch (error) {
                console.log(error)
            }
        }
    }

    cameraClick() {
        this.cameraOn = !this.cameraOn
    }
}
