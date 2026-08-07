import { Component, output } from '@angular/core'

@Component({
    selector: 'app-topbar',
    templateUrl: './topBar.component.html',
    styleUrls: ['./topBar.component.css'],
    imports: [],
})
export class TopBarComponent {
    option1 = output<void>()
    option2 = output<void>()

    option1Clicked() {
        this.option1.emit(undefined)
    }

    option2Clicked() {
        this.option2.emit(undefined)
    }
}
