import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core'
import { MenuOption } from '@model/menuOption'
import { NgClass } from '@angular/common'
@Component({
    selector: 'app-buttonmenu',
    templateUrl: './buttonMenu.component.html',
    styleUrls: ['./buttonMenu.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [NgClass],
})
export class ButtonMenuComponent {
    @Input() menuOptions?: MenuOption[] = [
        { menuId: 1, menu: 'Option 1' },
        { menuId: 2, menu: 'Option 2' },
    ]
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    @Input() justify: boolean = false
    @Output() menuSelectedEvent = new EventEmitter<number>()
    menuSelected(menuId?: number) {
        this.menuSelectedEvent.emit(menuId)
    }
}
