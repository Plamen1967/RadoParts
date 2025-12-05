import { NgClass, NgStyle } from '@angular/common'
import { AfterContentInit, ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { ZoomComponent } from '../zoom/zoom/zoom.component'
import { NgxGalleryImage } from '@app/ngx-gallery/models/ngx-gallery-image.model'

@Component({
    standalone: true,
    selector: 'app-image-carousel',
    templateUrl: './image-carousel.component.html',
    styleUrls: ['./image-carousel.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgClass, NgStyle],
})
export class ImageCarouselComponent implements AfterContentInit {
    constructor(private matDialog: MatDialog) {}
    ngAfterContentInit(): void {
        setTimeout(() => {
            document.getElementById('next')?.click()
        }, 2000)
    }
    active = false

    @Input({ required: true }) images!: NgxGalleryImage[]
    @Input() previewButton = true;
    isActive(index: number) {
        if (!this.active && index === 0) {
            this.active = true
            return true
        }
        return false
    }

    previewCurrent(event: Event) {
        event.stopPropagation();
        const currentCollection = document.querySelector('.active img');
        if (!currentCollection) return undefined;

        const current = currentCollection.id;
        const image: NgxGalleryImage = this.images[+current];
        this.preview(image)

    }

    preview(image: NgxGalleryImage) {
        if (!this.previewButton) return
        this.matDialog.open(ZoomComponent, {
            width: '500px',
            height: '500px',
            panelClass: 'zoom',
            data: { myThumbnail : image.small, myFullresImage : image.big },
        })
    }
}
