import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-ngx-gallery-action',
    template: `
        <div class="ngx-gallery-icon" [class.ngx-gallery-icon-disabled]="disabled()"
            aria-hidden="true"
            title="{{ titleText() }}"
            (click)="handleClick($event)">
                <i class="ngx-gallery-icon-content {{ icon() }}"></i>
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
    
    icon = input<string>();
    disabled = input<boolean>(false);
    titleText = input<string>('');

    clickEvent = output<Event>();

    handleClick(event: Event) {
        if (!this.disabled) {
            this.clickEvent.emit(event);
        }

        event.stopPropagation();
        event.preventDefault();
    }
}
