import { Component, ChangeDetectionStrategy } from '@angular/core'
import { UpdateEnum } from '@model/enum/update.enum'
import AddCarComponent from '../addCar/addcar.component'

@Component({
    selector: 'app-viewcar',
    templateUrl: './viewCar.component.html',
    styleUrls: ['./viewCar.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [AddCarComponent],
})
export default class ViewCarComponent {
    mode: UpdateEnum = UpdateEnum.View
}
