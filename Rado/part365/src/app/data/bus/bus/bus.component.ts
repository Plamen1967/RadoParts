import { Component } from '@angular/core';
import ListCarsComponent from '@app/data/cars/listCars/listCars.component';

@Component({
    selector: 'app-bus',
    templateUrl: './bus.component.html',
    styleUrls: ['./bus.component.css'],
    imports: [ListCarsComponent]
})
export default class BusComponent{
}
