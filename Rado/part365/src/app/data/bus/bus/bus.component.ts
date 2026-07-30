import { Component, ChangeDetectionStrategy } from '@angular/core'
import ListCarsComponent from '@app/data/cars/listCars/listCars.component'

@Component({
    selector: 'app-bus',
    templateUrl: './bus.component.html',
    styleUrls: ['./bus.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [ListCarsComponent],
})
export default class BusComponent {}
