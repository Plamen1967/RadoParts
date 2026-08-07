import { NgClass } from '@angular/common'
import { Component, input } from '@angular/core'

@Component({
    selector: 'app-row',
    templateUrl: './row.component.html',
    styleUrls: ['./row.component.css'],
    imports: [NgClass],
})
export class RowComponent {
    label = input<string | undefined>()
    value = input<string | number | undefined>()
    price = input<boolean | undefined>(false)
}
