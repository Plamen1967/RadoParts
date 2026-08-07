import { NgClass } from '@angular/common';
import { Component, input, output, } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-ngx-gallery-bullets',
    template: `
        @for (bullet of getBullets(); track $index) {
        <div class="ngx-gallery-bullet" (click)="handleChange($event, $index)" [ngClass]="{ 'ngx-gallery-active': $index === active() }" role="none"></div>
        }
    `,
    styleUrls: ['./ngx-gallery-bullets.component.scss'],
    imports: [NgClass]
})
export class NgxGalleryBulletsComponent {
    count = input<number | undefined>();
    active = input<number>(0);

    // eslint-disable-next-line @angular-eslint/no-output-on-prefix
    onChange = output<number>();

    getBullets(): number[] {
        return Array(this.count() || 0);
    }

    handleChange(event: Event, index: number): void {
        this.onChange.emit(index);
    }
}
