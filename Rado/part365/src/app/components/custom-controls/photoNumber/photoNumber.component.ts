import { Component, Input, ChangeDetectionStrategy } from '@angular/core'

@Component({
    selector: 'app-photonumber',
    templateUrl: './photoNumber.component.html',
    styleUrls: ['./photoNumber.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [],
})
export class PhotoNumberComponent {
    @Input() phone = ''
}
