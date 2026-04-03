//#region imports
import { Directive, ElementRef, Host, inject } from '@angular/core'
import { MenuService } from '@services/Menu.service'
//#endregion
//#region directive
@Directive({
    selector: '[appOutside]',
    host: {
        '(document:click)': 'onClick($event)',
    },
})
//#endregion
export class OutsideDirective {
    //#region variables and services
    @Host() private hostElement: ElementRef = inject(ElementRef)
    menuService: MenuService
    //#endregion

    constructor() {
        this.menuService = inject(MenuService)
    }

    onClick(event: Event) {
        const clickedInside = this.hostElement.nativeElement.contains(event.target)
        const isShown = this.menuService.showMenu()
        if (isShown && !clickedInside) {
            // Handle the click outside event here
            console.log('Clicked outside the element!')
            this.menuService.showMenu.set(false)
        }
    }
}
