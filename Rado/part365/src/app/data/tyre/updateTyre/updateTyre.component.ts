import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core'
import { UpdateEnum } from '@model/enum/update.enum'
import AddTyreComponent from '../addTyre/addTyre.component'
import { DisplayPartView } from '@model/displayPartView'

@Component({
    selector: 'app-updatetyre',
    templateUrl: './updateTyre.component.html',
    styleUrls: ['./updateTyre.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [AddTyreComponent],
})
export default class UpdateTyreComponent {
    mode: UpdateEnum = UpdateEnum.Update
    @Input() id?: number
    @Input() displayPartView?: DisplayPartView

    @Output() saved: EventEmitter<number> = new EventEmitter<number>()
    @Output() noChange: EventEmitter<number> = new EventEmitter<number>()

    backEvent(event: number) {
        this.noChange.emit(event)
    }
    savedEvent(event: number) {
        this.saved.emit(event)
    }
}
