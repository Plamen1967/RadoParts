//#region imports
import { Component, HostListener, OnChanges, SimpleChanges, ElementRef, inject, input, output, effect, computed } from '@angular/core'
import { DomSanitizer, SafeStyle, SafeResourceUrl } from '@angular/platform-browser'
import { NgxGalleryHelperService } from '../services/ngx-gallery-helper.service'
import { NgxGalleryOrder } from '../models/ngx-gallery-order.model'
import { NgxGalleryAction } from './../action/ngx-gallery-action.model'
import { NgxGalleryActionComponent } from '../action/ngx-gallery-action.component'
import { NgxGalleryArrowsComponent } from '../arrows/ngx-gallery-arrows.component'
import { NgClass } from '@angular/common'
//#endregion
//#region component
@Component({
    standalone: true,
    selector: 'app-ngx-gallery-thumbnails',
    templateUrl: './ngx-gallery-thumbnails.component.html',
    styleUrls: ['./ngx-gallery-thumbnails.component.scss'],
    imports: [NgClass, NgxGalleryActionComponent, NgxGalleryArrowsComponent],
})
//#endregion

export class NgxGalleryThumbnailsComponent implements OnChanges {
    //#region variables and services
    thumbnailsLeft?: string
    thumbnailsMarginLeft?: string
    mouseenter?: boolean
    remainingCountValue?: number

    minStopIndex = 0

    images = input<string[] | SafeResourceUrl[]>()
    links = input<string[]>()
    labels = input<string[]>()
    linkTarget = input<string>()
    columns = input<number>()
    rows = input<number>()
    arrows = input<boolean>()
    arrowsAutoHide = input<boolean>()
    margin = input<number>()
    selectedIndex = input<number>()
    clickable = input<boolean>()
    swipe = input<boolean>()
    size = input<string>()
    arrowPrevIcon = input<string>()
    arrowNextIcon = input<string>()
    moveSize = input<number>()
    order = input<NgxGalleryOrder>()
    remainingCount = input<boolean>()
    lazyLoading = input<boolean>()
    actions = input<NgxGalleryAction[]>()
    images_ : string[] | SafeResourceUrl[] = []
    links_: string[] = []
    // eslint-disable-next-line @angular-eslint/no-output-on-prefix
    onActiveChange = output<number>()
    selectedIndex_? :number
    private index = 0
    contain = ''
    private sanitization: DomSanitizer = inject(DomSanitizer)
    private elementRef: ElementRef = inject(ElementRef)
    private helperService: NgxGalleryHelperService = inject(NgxGalleryHelperService)
    //#endregion

    constructor() {
        effect(() => {
            this.images_ = computed(() => this.images())()!
            this.links_ = computed(() => this.links())()!
        })
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['selectedIndex']) {
            this.validateIndex()
        }

        if (changes['swipe']) {
            this.helperService.manageSwipe(
                this.swipe()!,
                this.elementRef,
                'thumbnails',
                () => this.moveRight(),
                () => this.moveLeft()
            )
        }

        if (this.images) {
            this.remainingCountValue = this.images.length - this.rows()! * this.columns()!
        }
    }

    @HostListener('mouseenter') onMouseEnter() {
        this.mouseenter = true
    }

    @HostListener('mouseleave') onMouseLeave() {
        this.mouseenter = false
    }

    reset(index: number): void {
        this.selectedIndex_ = index
        this.setDefaultPosition()

        this.index = 0
        this.validateIndex()
    }

    getImages(): string[] | SafeResourceUrl[] {
        if (!this.images) {
            return []
        }

        if (this.remainingCount()) {
            return this.images_.slice(0, this.rows()! * this.columns()!)
        } else if (this.lazyLoading() && this.order() != NgxGalleryOrder.Row) {
            let stopIndex = 0

            if (this.order() === NgxGalleryOrder.Column) {
                stopIndex = (this.index + this.columns()! + this.moveSize()!) * this.rows()!
            } else if (this.order() === NgxGalleryOrder.Page) {
                stopIndex = this.index + this.columns()! * this.rows()! * 2
            }

            if (stopIndex <= this.minStopIndex) {
                stopIndex = this.minStopIndex
            } else {
                this.minStopIndex = stopIndex
            }

            return this.images_.slice(0, stopIndex)
        } else {
            return this.images_
        }
    }

    handleClick(event: Event, index: number): void {
        if (!this.hasLink(index)) {
            this.selectedIndex_ = index
            this.onActiveChange.emit(index)

            event.stopPropagation()
            event.preventDefault()
        }
    }

    hasLink(index: number): boolean {
        if (this.links && this.links.length && this.links_[index]) return true
        return false
    }

    moveRight(): void {
        if (this.canMoveRight()) {
            this.index += this.moveSize()!
            const maxIndex = this.getMaxIndex() - this.columns()!

            if (this.index > maxIndex) {
                this.index = maxIndex
            }

            this.setThumbnailsPosition()
        }
    }

    moveLeft(): void {
        if (this.canMoveLeft()) {
            this.index -= this.moveSize()!

            if (this.index < 0) {
                this.index = 0
            }

            this.setThumbnailsPosition()
        }
    }

    canMoveRight(): boolean {
        return this.index + this.columns()! < this.getMaxIndex() ? true : false
    }

    canMoveLeft(): boolean {
        return this.index !== 0 ? true : false
    }

    getThumbnailLeft(index: number): SafeStyle {
        let calculatedIndex

        if (this.order() === NgxGalleryOrder.Column) {
            calculatedIndex = Math.floor(index / this.rows()!)
        } else if (this.order() === NgxGalleryOrder.Page) {
            calculatedIndex = (index % this.columns()!) + Math.floor(index / (this.rows()! * this.columns()!)) * this.columns()!
        } else if (this.order() == NgxGalleryOrder.Row && this.remainingCount()) {
            calculatedIndex = index % this.columns()!
        } else {
            if (this.images) calculatedIndex = index % Math.ceil(this.images?.length / this.rows()!)
        }

        return this.getThumbnailPosition(calculatedIndex!, this.columns()!)
    }

    getThumbnailTop(index: number): SafeStyle {
        let calculatedIndex

        if (this.order() === NgxGalleryOrder.Column) {
            calculatedIndex = index % this.rows()!
        } else if (this.order() === NgxGalleryOrder.Page) {
            calculatedIndex = Math.floor(index / this.columns()!) - Math.floor(index / (this.rows()! * this.columns()!)) * this.rows()!
        } else if (this.order() == NgxGalleryOrder.Row && this.remainingCount()) {
            calculatedIndex = Math.floor(index / this.columns()!)
        } else {
            if (this.images) calculatedIndex = Math.floor(index / Math.ceil(this.images.length / this.rows()!))
        }

        return this.getThumbnailPosition(calculatedIndex!, this.rows()!)
    }

    getThumbnailWidth(): SafeStyle {
        return this.getThumbnailDimension(this.columns()!)
    }

    getThumbnailHeight(): SafeStyle {
        return this.getThumbnailDimension(this.rows()!)
    }

    setThumbnailsPosition(): void {
        this.thumbnailsLeft = -((100 / this.columns()!) * this.index) + '%'

        this.thumbnailsMarginLeft = -((this.margin()! - ((this.columns()! - 1) * this.margin()!) / this.columns()!) * this.index) + 'px'
    }

    setDefaultPosition(): void {
        this.thumbnailsLeft = '0px'
        this.thumbnailsMarginLeft = '0px'
    }

    canShowArrows(): boolean {
        if (this.remainingCount()) {
            return false
        } else if (this.arrows() && this.images && this.images.length > this.getVisibleCount() && (!this.arrowsAutoHide || this.mouseenter)) {
            return true
        } else {
            return false
        }
    }

    validateIndex(): void {
        if (this.images) {
            let newIndex

            if (this.order() === NgxGalleryOrder.Column) {
                newIndex = Math.floor(this.selectedIndex_! / this.rows()!)
            } else {
                newIndex = this.selectedIndex_! % Math.ceil(this.images.length / this.rows()!)
            }

            if (this.remainingCount()) {
                newIndex = 0
            }

            if (newIndex < this.index || newIndex >= this.index + this.columns()!) {
                const maxIndex = this.getMaxIndex() - this.columns()!
                this.index = newIndex > maxIndex ? maxIndex : newIndex

                this.setThumbnailsPosition()
            }
        }
    }

    getSafeUrl(image: string | SafeResourceUrl): SafeStyle {
        return this.sanitization.bypassSecurityTrustStyle(this.helperService.getBackgroundUrl(image as string))
    }

    private getThumbnailPosition(index: number, count: number): SafeStyle {
        return this.getSafeStyle('calc(' + (100 / count) * index + '% + ' + (this.margin()! - ((count - 1) * this.margin()!) / count) * index + 'px)')
    }

    private getThumbnailDimension(count: number): SafeStyle {
        if (this.margin() !== 0) {
            return this.getSafeStyle('calc(' + 100 / count + '% - ' + ((count - 1) * this.margin()!) / count + 'px)')
        } else {
            return this.getSafeStyle('calc(' + 100 / count + '% + 1px)')
        }
    }

    private getMaxIndex(): number {
        if (this.order() == NgxGalleryOrder.Page) {
            let maxIndex = Math.floor(this.images?.length ?? 0 / this.getVisibleCount()) * this.columns()!

            if (this.images && this.images.length % this.getVisibleCount() > this.columns()!) {
                maxIndex += this.columns()!
            } else {
                if (this.images) maxIndex += this.images.length % this.getVisibleCount()
            }

            return maxIndex
        } else {
            return Math.ceil(this.images?.length ?? 0 / this.rows()!)
        }
    }

    private getVisibleCount(): number {
        return this.columns()! * this.rows()!
    }

    private getSafeStyle(value: string): SafeStyle {
        return this.sanitization.bypassSecurityTrustStyle(value)
    }
}
