import { Component, input, output } from '@angular/core'
import { MenuOption } from '@model/menuOption'
import { NgClass } from '@angular/common'
@Component({
    selector: 'app-buttonmenu',
    templateUrl: './buttonMenu.component.html',
    styleUrls: ['./buttonMenu.component.css'],
    imports: [NgClass],
})
export class ButtonMenuComponent {
    menuOptions = input<MenuOption[]>([
        { menuId: 1, menu: 'Option 1' },
        { menuId: 2, menu: 'Option 2' },
    ])
    justify = input<boolean>(false)
    menuSelectedEvent = output<number>()
    menuSelected(menuId?: number) {
        this.menuSelectedEvent.emit(menuId!)
    }
}
