import { Directive, ElementRef, Host, HostListener, inject } from '@angular/core';
import { MenuService } from '@services/Menu.service';

@Directive({
  selector: '[appOutside]',
  host: {
    '(document:click)': 'onClick($event)'
  }
})
export class OutsideDirective {
  onClick(event: Event) {
    const clickedInside = this.hostElement.nativeElement.contains(event.target);
    const isShown = this.menuService.showMenu();
    if (isShown && !clickedInside) {
      // Handle the click outside event here
      console.log('Clicked outside the element!');
      this.menuService.showMenu.set(false);
    }
  }

  menuService: MenuService
  constructor(@Host() private hostElement: ElementRef) { 
    this.menuService = inject(MenuService);
  }
}
