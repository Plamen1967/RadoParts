import { Component, HostListener, input } from '@angular/core'

@Component({
    selector: 'app-dealer',
    templateUrl: './dealer.component.html',
    styleUrls: ['./dealer.component.css'],
    imports: [],
})
export class DealerComponent {
    @HostListener('click', ['$event'])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    click(event: any) {
        event.stopPropagation()
    }
    companyName = input<string | undefined>(undefined)
    sellerLogo = input<string | undefined>(undefined)
    dealer = input<boolean | undefined>(undefined)
    sellerWebPage = input<string>('')
}
