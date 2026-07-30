import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core'
import AddPartComponent from '../addPart/addpart.component'
import { UpdateEnum } from '@model/enum/update.enum'
import { DisplayPartView } from '@model/displayPartView'

@Component({
    selector: 'app-updatepart',
    templateUrl: './updatepart.component.html',
    styleUrls: ['./updatepart.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [AddPartComponent],
})
export default class UpdatePartComponent {
    mode = UpdateEnum.Update
    @Input() id!: number
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
