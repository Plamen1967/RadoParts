import { AfterViewInit, Directive } from '@angular/core';
import { goTop } from '@functions/functions';

@Directive({
  selector: '[appGotop]'
})
export class GotopDirective implements AfterViewInit {
  
      ngAfterViewInit() {
        goTop()
    }

}
