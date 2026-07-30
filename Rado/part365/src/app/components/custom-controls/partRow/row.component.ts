import { NgClass } from '@angular/common'
import { Component, Input, ChangeDetectionStrategy } from '@angular/core'

@Component({
    selector: 'app-row',
    templateUrl: './row.component.html',
    styleUrls: ['./row.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [NgClass],
})
export class RowComponent {
    @Input() label?: string
    @Input() value?: string | number
    @Input() price?: boolean = false
}
