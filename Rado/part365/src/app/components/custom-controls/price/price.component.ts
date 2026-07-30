import { Component, Input, ChangeDetectionStrategy } from '@angular/core'

@Component({
    selector: 'app-price',
    templateUrl: './price.component.html',
    styleUrls: ['./price.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [],
})
export class PriceComponent {
    @Input() price?: number
    currency = 'EURO'
}
