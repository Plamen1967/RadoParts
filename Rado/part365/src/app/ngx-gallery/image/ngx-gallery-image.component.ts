import { Component, Input, Output, EventEmitter, HostListener,  ElementRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeStyle, SafeUrl } from '@angular/platform-browser';

import { NgxGalleryHelperService } from '../services/ngx-gallery-helper.service';
import { NgxGalleryOrderedImage } from '../models/ngx-gallery-ordered-image.model';
import { NgxGalleryAnimation } from '../models/ngx-gallery-animation.model';
import { NgxGalleryAction } from '../action/ngx-gallery-action.model';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { NgxGalleryActionComponent } from '../action/ngx-gallery-action.component';
import { NgxGalleryArrowsComponent } from '../arrows/ngx-gallery-arrows.component';
import { NgxGalleryBulletsComponent } from '../bullets/ngx-gallery-bullets.component';

@Component({
    standalone: true,
    selector: 'app-ngx-gallery-image',
    template: `
        <div class="ngx-gallery-image-wrapper ngx-gallery-animation-{{animation}} ngx-gallery-image-size-{{size}}">
            <div role="none" class="ngx-gallery-image" *ngFor="let image of getImages(); let i = index;" [ngClass]="{ 'ngx-gallery-active': selectedIndex === image.index, 'ngx-gallery-inactive-left': (selectedIndex?? 0) > (image.index), 'ngx-gallery-inactive-right': selectedIndex ?? 0 < image.index, 'ngx-gallery-clickable': clickable }" [style.background-image]="getSafeUrl(image.src)" (click)="handleClick($event, image.index)">
                <div class="ngx-gallery-icons-wrapper">
                    <app-ngx-gallery-action *ngFor="let action of actions" [icon]="action.icon" [disabled]="action.disabled!" [titleText]="action.titleText!" (onClick)="action.onClick($event, image.index)"></app-ngx-gallery-action>
                </div>
                <div class="ngx-gallery-image-text" *ngIf="showDescription && descriptions && descriptions[image.index!]" [innerHTML]="descriptions[image.index]" (click)="$event.stopPropagation()" role="none"></div>
            </div>
        </div>
        <app-ngx-gallery-bullets *ngIf="bullets" [count]="images?.length" [active]="selectedIndex" (onChange)="show($event)"></app-ngx-gallery-bullets>
        <app-ngx-gallery-arrows class="ngx-gallery-image-size-{{size}}" *ngIf="arrows" (onPrevClick)="showPrev()" (onNextClick)="showNext()" [prevDisabled]="!canShowPrev()" [nextDisabled]="!canShowNext()" [arrowPrevIcon]="arrowPrevIcon" [arrowNextIcon]="arrowNextIcon"></app-ngx-gallery-arrows>
    `,
    styleUrls: ['./ngx-gallery-image.component.scss'],
    imports: [NgFor, NgClass, NgxGalleryActionComponent, NgIf, NgxGalleryArrowsComponent, NgxGalleryBulletsComponent]
})
export class NgxGalleryImageComponent implements OnInit, OnChanges {
    @Input() images?: NgxGalleryOrderedImage[];
    @Input() clickable?: boolean;
    @Input() selectedIndex?: number;
    @Input() arrows?: boolean;
    @Input() arrowsAutoHide?: boolean;
    @Input() swipe?: boolean;
    @Input() animation?: string;
    @Input() size?: string;
    @Input() arrowPrevIcon?: string;
    @Input() arrowNextIcon?: string;
    @Input() autoPlay?: boolean;
    @Input() autoPlayInterval?: number;
    @Input() autoPlayPauseOnHover?: boolean;
    @Input() infinityMove?: boolean;
    @Input() lazyLoading?: boolean;
    @Input() actions?: NgxGalleryAction[];
    @Input() descriptions?: string[];
    @Input() showDescription?: boolean;
    @Input() bullets?: boolean;

    // eslint-disable-next-line @angular-eslint/no-output-on-prefix
    @Output() onClick = new EventEmitter();
    // eslint-disable-next-line @angular-eslint/no-output-on-prefix
    @Output() onActiveChange = new EventEmitter();

    canChangeImage = true;

    private timer?: NodeJS.Timeout;

    constructor(private sanitization: DomSanitizer,
        private elementRef: ElementRef, private helperService: NgxGalleryHelperService) {}

    ngOnInit(): void {
        if (this.arrows && this.arrowsAutoHide) {
            this.arrows = false;
        }

        if (this.autoPlay) {
            this.startAutoPlay();
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['swipe']) {
            this.helperService.manageSwipe(this.swipe!, this.elementRef, 'image', () => this.showNext(), () => this.showPrev());
        }
    }

    @HostListener('mouseenter') onMouseEnter() {
        if (this.arrowsAutoHide && !this.arrows) {
            this.arrows = true;
        }

        if (this.autoPlay && this.autoPlayPauseOnHover) {
            this.stopAutoPlay();
        }
    }

    @HostListener('mouseleave') onMouseLeave() {
        if (this.arrowsAutoHide && this.arrows) {
            this.arrows = false;
        }

        if (this.autoPlay && this.autoPlayPauseOnHover) {
            this.startAutoPlay();
        }
    }

    reset(index: number): void {
        this.selectedIndex = index;
    }

    getImages(): NgxGalleryOrderedImage[] {
        if (!this.images) {
            return [];
        }

        if (this.lazyLoading) {
            const indexes = [this.selectedIndex];
            const prevIndex = this.selectedIndex! - 1;

            if (prevIndex === -1 && this.infinityMove) {
                indexes.push(this.images.length - 1)
            } else if (prevIndex >= 0) {
                indexes.push(prevIndex);
            }

            const nextIndex = this.selectedIndex! + 1;

            if (nextIndex == this.images.length && this.infinityMove) {
                indexes.push(0);
            } else if (nextIndex < this.images.length) {
                indexes.push(nextIndex);
            }

            return this.images.filter((img, i) => indexes.indexOf(i) != -1);
        } else {
            return this.images;
        }
    }

    startAutoPlay(): void {
        this.stopAutoPlay();

        this.timer = setInterval(() => {
            if (!this.showNext()) {
                this.selectedIndex = -1;
                this.showNext();
            }
        }, this.autoPlayInterval);
    }

    stopAutoPlay() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }

    handleClick(event: Event, index: number): void {
        if (this.clickable) {
            this.onClick.emit(index);

            event.stopPropagation();
            event.preventDefault();
        }
    }

    show(index: number) {
        this.selectedIndex = index;
        this.onActiveChange.emit(this.selectedIndex);
        this.setChangeTimeout();
    }

    showNext(): boolean {
        if (this.canShowNext() && this.canChangeImage) {
            this.selectedIndex!++;

            if (this.selectedIndex === this.images?.length) {
                this.selectedIndex = 0;
            }

            this.onActiveChange.emit(this.selectedIndex);
            this.setChangeTimeout();

            return true;
        } else {
            return false;
        }
    }

    showPrev(): void {
        if (this.canShowPrev() && this.canChangeImage) {
            this.selectedIndex!--;

            if (this.selectedIndex! < 0 && this.images) {
                this.selectedIndex = this.images?.length - 1;
            }

            this.onActiveChange.emit(this.selectedIndex);
            this.setChangeTimeout();
        }
    }

    setChangeTimeout() {
        this.canChangeImage = false;
        let timeout = 1000;

        if (this.animation === NgxGalleryAnimation.Slide
            || this.animation === NgxGalleryAnimation.Fade) {
                timeout = 500;
        }

        setTimeout(() => {
            this.canChangeImage = true;
        }, timeout);
    }

    canShowNext(): boolean {
        if (this.images) {
            return this.infinityMove || this.selectedIndex! < this.images.length - 1
                ? true : false;
        } else {
            return false;
        }
    }

    canShowPrev(): boolean {
        if (this.images) {
            return this.infinityMove || this.selectedIndex! > 0 ? true : false;
        } else {
            return false;
        }
    }

    getSafeUrl(image: string | SafeUrl): SafeStyle {
        return this.sanitization.bypassSecurityTrustStyle(`url(${this.helperService.getBackgroundUrl(image as string)})`);
    }
}
