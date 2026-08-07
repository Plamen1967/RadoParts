import { Component, input } from '@angular/core'

@Component({
    selector: 'app-photonumber',
    templateUrl: './photoNumber.component.html',
    styleUrls: ['./photoNumber.component.css'],
    imports: [],
})
export class PhotoNumberComponent {
    phone = input<string>('')
}
