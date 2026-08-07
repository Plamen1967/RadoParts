import { Component, inject, input } from '@angular/core'
import { DomSanitizer } from '@angular/platform-browser'

@Component({
    selector: 'app-whats',
    templateUrl: './whats.component.html',
    styleUrls: ['./whats.component.css'],
    imports: [],
})
export class WhatsComponent {
    // <a href="https://wa.me/1234567890?text=hello" target="_blank">Chat on WhatsApp</a>
    private sanitizer: DomSanitizer = inject(DomSanitizer)
    number = input<string|undefined>(undefined)

    get whatsRef() {
        return `whatsapp://send?phone=${this.number()}&text=hello`
    }
    sanitize(url: string) {
        return this.sanitizer.bypassSecurityTrustUrl(url)
    }
}
