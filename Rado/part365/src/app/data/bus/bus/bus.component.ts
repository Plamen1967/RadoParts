import { Component, input } from '@angular/core'
import ListCarsComponent from '@app/data/cars/listCars/listCars.component'

@Component({
    selector: 'app-bus',
    templateUrl: './bus.component.html',
    styleUrls: ['./bus.component.css'],
    imports: [ListCarsComponent],
})
export default class BusComponent {
    carId = input<number>()
    partId = input<number>()
    updateCar = input(0)
    updateBus = input(0)
    updatePart = input(0)
    addCar = input(0)
    addBus = input(0)
    addPart = input(0)
    update = input<number | string>()
    ad = input<number | string>()
    bus = input<number>(0)

}
