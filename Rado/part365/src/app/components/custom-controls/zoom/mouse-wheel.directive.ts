import { Directive, HostListener, output } from '@angular/core';

@Directive({
  selector: '[appLibMousewheel]'
})
export class MouseWheelDirective {

  mouseWheelUp = output();
  mouseWheelDown = output();

  @HostListener('mousewheel', ['$event']) onMouseWheelChrome(event: Event) {
    this.mouseWheelFunc(event);
  }

  @HostListener('DOMMouseScroll', ['$event']) onMouseWheelFirefox(event: Event) {
    this.mouseWheelFunc(event);
  }

  @HostListener('onmousewheel', ['$event']) onMouseWheelIE(event: Event) {
    this.mouseWheelFunc(event);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mouseWheelFunc(events: any) {
    const event = window.event || events; // old IE support
    const delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
    if (delta > 0) {
        this.mouseWheelUp.emit(event);
    } else if (delta < 0) {
        this.mouseWheelDown.emit(event);
    }
    // for IE
    event.returnValue = false;
    // for Chrome and Firefox
    if (event.preventDefault) {
        event.preventDefault();
    }
  }

}
