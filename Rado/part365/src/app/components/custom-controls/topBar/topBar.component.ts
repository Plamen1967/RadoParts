import { Component, EventEmitter, Output, ChangeDetectionStrategy } from '@angular/core'

@Component({
    selector: 'app-topbar',
    templateUrl: './topBar.component.html',
    styleUrls: ['./topBar.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [],
})
export class TopBarComponent {
    @Output() option1: EventEmitter<void> = new EventEmitter<void>()
    @Output() option2: EventEmitter<void> = new EventEmitter<void>()

    option1Clicked() {
        this.option1.emit(undefined)
    }

    option2Clicked() {
        this.option2.emit(undefined)
    }
}
