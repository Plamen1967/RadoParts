import { Component, input } from '@angular/core'
import { SuspendedComponent } from '../suspended/suspended.component'
import { HelperComponent } from '../helper/helper.component'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatBadgeModule } from '@angular/material/badge'

@Component({
    selector: 'app-listtitle',
    templateUrl: './listtitle.component.html',
    styleUrls: ['./listtitle.component.scss'],
    imports: [SuspendedComponent, MatBadgeModule, MatButtonModule, MatIconModule],
})
export class ListTitleComponent extends HelperComponent {
    number = input<number>(0)
    title = input<string>('')
}
