import { Component, input } from '@angular/core'
import AddCarComponent from '@app/data/cars/addCar/addcar.component'
import { UpdateEnum } from '@model/enum/update.enum'

@Component({
    selector: 'app-addbus',
    templateUrl: './addBus.component.html',
    styleUrls: ['./addBus.component.css'],
    imports: [AddCarComponent],
})
export default class AddBusComponent {
    bus = 1
    carId = input<number | undefined>(undefined)
    add = input<boolean>(false)
    update = input<boolean>(false)
    mode = input<UpdateEnum>(UpdateEnum.New)
    ad = input<string>('')

}
