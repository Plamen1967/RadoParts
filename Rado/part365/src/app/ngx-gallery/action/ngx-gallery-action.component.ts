import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-ngx-gallery-action',
    template: `
        <div class="ngx-gallery-icon" [class.ngx-gallery-icon-disabled]="disabled"
            aria-hidden="true"
            title="{{ titleText }}"
            (click)="handleClick($event)">
                <i class="ngx-gallery-icon-content {{ icon }}"></i>
        </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgxGalleryActionComponent {
    // @HostListener('window:keydown', ['$event'])
    // submitEvent(event) {
    // if (event.keyCode === 27)
    // {
    //     event.preventDefault()
    //     this.handleClick(event);
    //   }
    // }
    
    @Input() icon?: string;
    @Input() disabled = false;
    @Input() titleText = '';

    // eslint-disable-next-line @angular-eslint/no-output-on-prefix
    @Output() onClick = new EventEmitter<Event>();

    handleClick(event: Event) {
        if (!this.disabled) {
            this.onClick.emit(event);
        }

        event.stopPropagation();
        event.preventDefault();
    }
}
