import { Component, input, output, } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-ngx-gallery-arrows',
    template: `
        <div class="ngx-gallery-arrow-wrapper ngx-gallery-arrow-left">
            <div class="ngx-gallery-icon ngx-gallery-arrow" aria-hidden="true" (click)="handlePrevClick()" [class.ngx-gallery-disabled]="prevDisabled()">
                <i class="ngx-gallery-icon-content borderClass {{arrowPrevIcon()}}"></i>
            </div>
        </div>
        <div class="ngx-gallery-arrow-wrapper ngx-gallery-arrow-right">
            <div class="ngx-gallery-icon ngx-gallery-arrow" aria-hidden="true" (click)="handleNextClick()" [class.ngx-gallery-disabled]="nextDisabled()">
                <i class="ngx-gallery-icon-content borderClass {{arrowNextIcon()}}"></i>
            </div>
        </div>
    `,
    styleUrls: ['./ngx-gallery-arrows.component.scss']
})
export class NgxGalleryArrowsComponent {
    prevDisabled = input<boolean>(false);
    nextDisabled = input<boolean>(false);
    arrowPrevIcon = input<string>('');
    arrowNextIcon = input<string>('');

    // eslint-disable-next-line @angular-eslint/no-output-on-prefix
    onPrevClick = output();
    // eslint-disable-next-line @angular-eslint/no-output-on-prefix
    onNextClick = output();

    handlePrevClick(): void {
        this.onPrevClick.emit();
    }

    handleNextClick(): void {
        this.onNextClick.emit();
    }
}
