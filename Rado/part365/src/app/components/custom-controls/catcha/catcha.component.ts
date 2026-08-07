import { Component, input } from '@angular/core'
import { Catcha } from '@model/catcha'

@Component({
    selector: 'app-catcha',
    templateUrl: './catcha.component.html',
    styleUrls: ['./catcha.component.css'],
    imports: [],
})
export class CatchaComponent {
    imageData = input<Catcha>()
}
