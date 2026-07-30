import { Component, Input, ChangeDetectionStrategy } from '@angular/core'

@Component({
    selector: 'app-datarow',
    templateUrl: './dataRow.component.html',
    styleUrls: ['./dataRow.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [],
})
export class DataRowComponent {
    @Input() label?: string
    @Input() value?: string
    @Input() price?: boolean
    @Input() normal = false
}
