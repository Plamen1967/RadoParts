import { Component, input, output } from '@angular/core'
import AddCarComponent from '@app/data/cars/addCar/addcar.component'
import { DisplayPartView } from '@model/displayPartView'
import { UpdateEnum } from '@model/enum/update.enum'

@Component({
    selector: 'app-updatebus',
    templateUrl: './updatebus.component.html',
    styleUrls: ['./updatebus.component.css'],
    imports: [AddCarComponent],
})
export default class UpdateBusComponent {
    bus = 1
    mode = UpdateEnum.Update
    id = input<number | undefined>()
    displayPartView = input<DisplayPartView | undefined>()
    saved = output<number>()
    noChange = output<number>()

    backEvent(event: number) {
        this.noChange.emit(event)
    }
    savedEvent(event: number) {
        this.saved.emit(event)
    }
}
