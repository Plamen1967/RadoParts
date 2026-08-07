import { Component, HostListener, OnInit, input } from '@angular/core'

@Component({
    selector: 'app-phone',
    templateUrl: './phone.component.html',
    styleUrls: ['./phone.component.css'],
    imports: [],
})
export class PhoneComponent implements OnInit {
    @HostListener('click', ['$event'])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    click(event: any) {
        event.stopPropagation()
    }

    phone = input<string | undefined>()
    isMobile = input<boolean | undefined>()
    refPhone? : string;

    ngOnInit() {
        this.refPhone = `tel:${this.phone}`
    }
}
