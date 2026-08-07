import { Component, input, output } from '@angular/core'
import AddPartComponent from '../addPart/addpart.component'
import { UpdateEnum } from '@model/enum/update.enum'
import { DisplayPartView } from '@model/displayPartView'

@Component({
    selector: 'app-updatepart',
    templateUrl: './updatepart.component.html',
    styleUrls: ['./updatepart.component.css'],
    imports: [AddPartComponent],
})
export default class UpdatePartComponent {
    mode = UpdateEnum.Update
    id = input<number>()
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
