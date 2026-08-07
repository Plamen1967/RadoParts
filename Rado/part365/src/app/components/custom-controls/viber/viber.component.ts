import { Component, HostListener, inject, input } from '@angular/core'
import { DomSanitizer } from '@angular/platform-browser'

@Component({
    selector: 'app-viber',
    templateUrl: './viber.component.html',
    styleUrls: ['./viber.component.css'],
    imports: [],
})
export class ViberComponent{
    private sanitizer: DomSanitizer = inject(DomSanitizer)
    number = input<string | undefined>()
    @HostListener('click', ['$event'])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    click(event: any) {
        event.stopPropagation()
    }

    // ngOnInit() {
    //     // if (this.number())
    //     // {
    //     //     const num = this.number()!;
    //     //     if (num.length == 10 && num[0] == '0') this.number()!.set(num.replace('0', '359'))
    //     // }
            
    // }
    get viberNumber() {
        return this.number()    
    }

    get viberRef() {
        return `viber://add?number=${this.viberNumber}&message=hello&text=hello`
    }
    get chatviberRef() {
        return `viber://chat?number=${this.viberNumber}&text=hello`
    }
    sanitize(url: string) {
        return this.sanitizer.bypassSecurityTrustUrl(url)
    }
}
