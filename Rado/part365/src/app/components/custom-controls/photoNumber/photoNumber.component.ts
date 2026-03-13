import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-photonumber',
    templateUrl: './photoNumber.component.html',
    styleUrls: ['./photoNumber.component.css'],
    imports: []
})
export class PhotoNumberComponent {


  @Input() phone = "";

}
