import { Component, input } from '@angular/core'

@Component({
    selector: 'app-price',
    templateUrl: './price.component.html',
    styleUrls: ['./price.component.css'],
    imports: [],
})
export class PriceComponent {
    price = input<number>()
    currency = 'EURO'
}
