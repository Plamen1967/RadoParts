//#region imports
import { AfterViewInit, Directive, ElementRef, inject } from '@angular/core'
//#endregion
//#region directive
@Directive({
    selector: '[appAutofocus]',
    standalone: true,
})
//#endregion
export class AutofocusDirective implements AfterViewInit {
    private host: ElementRef = inject(ElementRef)

    ngAfterViewInit() {
        this.host.nativeElement.focus()
    }
}
