import { Component, HostListener, Input, ChangeDetectionStrategy } from '@angular/core'

@Component({
    selector: 'app-dealer',
    templateUrl: './dealer.component.html',
    styleUrls: ['./dealer.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [],
})
export class DealerComponent {
    @HostListener('click', ['$event'])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    click(event: any) {
        event.stopPropagation()
    }
    @Input() companyName?: string
    @Input() sellerLogo?: string
    @Input() dealer?: boolean
    @Input() sellerWebPage = ''
}
