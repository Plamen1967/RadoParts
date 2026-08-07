import { Component, effect, input } from '@angular/core'

@Component({
    selector: 'app-webpage',
    templateUrl: './webPage.component.html',
    styleUrls: ['./webPage.component.css'],
    imports: [],
})
export class WebPageComponent {
    webPage_?: string
    webPage = input<string>();

    constructor() {
        effect(() => {
            this.webPage_ = `https:\\\\${this.webPage()}.radoparts.com`
        })
    }
}
