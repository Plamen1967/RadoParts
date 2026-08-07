import { Component, input, output } from '@angular/core'
import { UpdateEnum } from '@model/enum/update.enum'
import AddTyreComponent from '../addTyre/addTyre.component'
import { DisplayPartView } from '@model/displayPartView'

@Component({
    selector: 'app-updatetyre',
    templateUrl: './updateTyre.component.html',
    styleUrls: ['./updateTyre.component.css'],
    imports: [AddTyreComponent],
})
export default class UpdateTyreComponent {
    mode: UpdateEnum = UpdateEnum.Update
    id = input<number | undefined>()
    displayPartView = input.required<DisplayPartView>()

    saved = output<number>()
    noChange = output<number>()

    backEvent(event: number) {
        this.noChange.emit(event)
    }
    savedEvent(event: number) {
        this.saved.emit(event)
    }
}
