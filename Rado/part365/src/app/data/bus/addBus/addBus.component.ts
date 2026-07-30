import { Component, ChangeDetectionStrategy } from '@angular/core'
import AddCarComponent from '@app/data/cars/addCar/addcar.component'

@Component({
    selector: 'app-addbus',
    templateUrl: './addBus.component.html',
    styleUrls: ['./addBus.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [AddCarComponent],
})
export default class AddBusComponent {}
