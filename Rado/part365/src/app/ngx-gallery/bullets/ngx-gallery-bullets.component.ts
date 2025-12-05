import { NgClass, NgFor } from '@angular/common';
import { Component, Input, Output, EventEmitter, } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-ngx-gallery-bullets',
    template: `
        <div class="ngx-gallery-bullet" *ngFor="let bullet of getBullets(); let i = index;" (click)="handleChange($event, i)" [ngClass]="{ 'ngx-gallery-active': i === active }" role="none"></div>
    `,
    styleUrls: ['./ngx-gallery-bullets.component.scss'],
    imports: [NgFor, NgClass]
})
export class NgxGalleryBulletsComponent {
    @Input() count?: number;
    @Input() active?: number = 0;

    // eslint-disable-next-line @angular-eslint/no-output-on-prefix
    @Output() onChange = new EventEmitter();

    getBullets(): number[] {
        return Array(this.count);
    }

    handleChange(event: Event, index: number): void {
        this.onChange.emit(index);
    }
}
