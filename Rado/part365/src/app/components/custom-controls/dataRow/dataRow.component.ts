import { Component, input } from '@angular/core'

@Component({
    selector: 'app-datarow',
    templateUrl: './dataRow.component.html',
    styleUrls: ['./dataRow.component.css'],
    imports: [],
})
export class DataRowComponent {
    label = input<string>('')
    value = input<string | undefined>(undefined)
    price = input<boolean | undefined>(undefined)
    normal = input<boolean>(false)
}
