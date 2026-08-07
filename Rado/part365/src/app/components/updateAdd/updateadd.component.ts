import { Component, input, OnInit, output } from '@angular/core'
import UpdateBusComponent from '@app/data/bus/updateBus/updatebus.component'
import UpdateCarComponent from '@app/data/cars/updateCar/updateCar.component'
import UpdatePartComponent from '@app/data/parts/updatepart/updatepart.component'
import UpdateTyreComponent from '@app/data/tyre/updateTyre/updateTyre.component'
import { DisplayPartView } from '@model/displayPartView'
import { ItemType } from '@model/enum/itemType.enum'

@Component({
    selector: 'app-updateadd',
    templateUrl: './updateadd.component.html',
    styleUrls: ['./updateadd.component.css'],
    imports: [UpdateCarComponent, UpdateBusComponent, UpdatePartComponent, UpdateTyreComponent],
})
export class UpdateAddComponent implements OnInit {
    displayPartView = input<DisplayPartView | undefined>()

    bus?: boolean
    id?: number
    car?: boolean
    tyre?: boolean
    part?: boolean
    saved = output<number>()
    noChange = output<number>()

    backEvent(event: number) {
        this.noChange.emit(event)
    }
    savedEvent(event: number) {
        this.saved.emit(event)
    }

    ngOnInit() {
        this.id = this.displayPartView()?.id

        switch (this.displayPartView()?.itemType) {
            case ItemType.CarPart: {
                this.bus = false
                this.part = true
                break
            }
            case ItemType.BusPart: {
                this.bus = true
                this.part = true
                break
            }
            case ItemType.OnlyCar: {
                this.bus = false
                this.car = true
                break
            }
            case ItemType.OnlyBus: {
                this.bus = true
                this.car = true
                break
            }
            case ItemType.Rim:
            case ItemType.Tyre:
            case ItemType.RimWithTyre: {
                this.tyre = true
                break
            }
            default: {
                break
            }
        }
    }
}
