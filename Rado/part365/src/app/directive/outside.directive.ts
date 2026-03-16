import { Directive, Host, HostListener, inject } from '@angular/core';
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
    if (!clickedInside) {
      // Handle the click outside event here
      console.log('Clicked outside the element!');
    }
  }

  menuService: MenuService
  constructor(@Host() private hostElement: HTMLElement) { 
    this.menuService = inject(MenuService);
  }
}
