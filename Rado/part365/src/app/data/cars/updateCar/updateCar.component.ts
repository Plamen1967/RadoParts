import { Component, input, output } from '@angular/core'
import { UpdateEnum } from '@model/enum/update.enum'
import AddCarComponent from '../addCar/addcar.component'
import { DisplayPartView } from '@model/displayPartView'

@Component({
    selector: 'app-updatecar',
    templateUrl: './updateCar.component.html',
    styleUrls: ['./updateCar.component.css'],
    imports: [AddCarComponent],
})
export default class UpdateCarComponent {
    mode: UpdateEnum = UpdateEnum.Update
    id = input<number>()
    displayPartView = input<DisplayPartView>()
    carId = input<number>()
    query = input<number>()
    saved = output<number>()
    noChange = output<number>()

    backEvent(event: number) {
        this.noChange.emit(event)
    }
    savedEvent(event: number) {
        this.saved.emit(event)
    }
}
