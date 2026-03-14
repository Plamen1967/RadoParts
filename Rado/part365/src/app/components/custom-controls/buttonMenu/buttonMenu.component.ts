/* eslint-disable @typescript-eslint/no-unused-vars */

import { Component, Input } from '@angular/core'
import { MenuOption } from '@model/menuOption'

@Component({
    selector: 'app-buttonmenu',
    templateUrl: './buttonMenu.component.html',
    styleUrls: ['./buttonMenu.component.css'],
    imports: [],
})
export class ButtonMenuComponent {
    @Input() menuOptions?: MenuOption[]

    menuSelected(menuId?: number) {
        return
    }
}
