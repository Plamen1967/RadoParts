//#region imports
import { NgClass, NgStyle } from '@angular/common'
import { AfterViewInit, Component, inject, input, output, effect, computed, signal } from '@angular/core'
import { Router } from '@angular/router'
import { ConfirmServiceService } from '@app/dialog/services/confirmService.service'
import { PopUpService } from '@app/dialog/services/popUpService.service'
import { ImageComponent } from '@components/custom-controls/image/image.component'
import { CarView } from '@model/car/carView'
import { DealerActionType } from '@model/dealerActionType'
import { UpdateEnum } from '@model/enum/update.enum'
import { PartView } from '@model/part/partView'
import { AlertService } from '@services/alert.service'
import { AuthenticationService } from '@services/authentication/authentication.service'
import { CarService } from '@services/car.service'
import { NextIdService } from '@services/nextId.service'
import { RowPartDealerComponent } from '../parts/rowPartDealer/rowPartDealer.component'
import { HelperComponent } from '@components/custom-controls/helper/helper.component'
import { DealerViewCarComponent } from '../cars/dealerViewCar/dealerviewcar.component'
import { MatBadgeModule } from '@angular/material/badge'
import { MatIconModule } from '@angular/material/icon'
import { DealerViewTyreComponent } from '../tyre/dealerViewTyre/dealerViewTyre.component'
import { DisplayPartView } from '@model/displayPartView'
import { PartServiceService } from '@services/part/partService.service'
import { OKCancelOption } from '@app/dialog/model/confirmDialogData'
import { goToPosition } from '@app/functions/functions'
import { httpResource } from '@angular/common/http'
import { environment } from '@env/environment'
import AddPartComponent from '../parts/addPart/addpart.component';
//#endregion
//#region component
@Component({
    selector: 'app-dealerview',
    templateUrl: './dealerview.component.html',
    styleUrls: ['./dealerview.component.css'],
    imports: [NgClass, RowPartDealerComponent, ImageComponent, DealerViewCarComponent, MatBadgeModule, MatIconModule, DealerViewTyreComponent, AddPartComponent, NgStyle],
})
//#endregion
export class DealerViewComponent extends HelperComponent implements AfterViewInit {
back(arg0: number) {
    console.log(`${arg0}`)
}
savedPart($event: number) {
    console.log(`${$event}`)
}
    //#region variables and services
    parts: PartView[] = []
    mode: UpdateEnum = UpdateEnum.View
    currentPartId?: number
    _carView?: CarView
    addPartFlag = signal(false)
    id = signal<number>(0)
    getOnlyNumbers = signal<number>(0)
    carView = input<CarView>()
    partView = input<PartView | undefined>()
    allowUpdate = input<boolean>(false)
    rimWithTyreView = input<DisplayPartView | undefined>()
    mainPicture = input<string | undefined>()
    highlighted = input<number | undefined>()
    showPart = input<boolean>(false)
    action = output<DealerActionType>()
    addPartCarId = output<number>()
    displayPartsEvent = output<number>()
    private authernticationService: AuthenticationService = inject(AuthenticationService)
    private confirmService: ConfirmServiceService = inject(ConfirmServiceService)
    private router: Router = inject(Router)
    private partService: PartServiceService = inject(PartServiceService)
    private nextIdService: NextIdService = inject(NextIdService)
    private carService: CarService = inject(CarService)
    private alertService: AlertService = inject(AlertService)
    private popupService: PopUpService = inject(PopUpService)
    //#endregion

    isHighlighted = computed(() => {
        // console.log(`Is Highlighted ${(this.highlighted() ?? 0) === this.id()} ${this.id()} ${this.highlighted()}`)
        return (this.highlighted()) == this.id()
    })


    carId = signal<number>(0)
    partresource = httpResource<PartView[]>(() => {
        if (this.carId() != 0)
            return `${environment.restAPI}/Part/GetPartsByCarId?carId=${this.carId()}`
        else 
            return undefined
    })

    $showParts = computed(() => 
        {
            console.log(`${this.partService.showParts()} ${this.id()}`)
            return this.partService.showParts() != 0 && this.partService.showParts() === this.id()
        })
    partsPerCar = computed(() => this.partresource.value())

    hasPartId(partId: number): boolean {
        const array = this.partsPerCar()?.find((part) => part.partId === partId)
        if (array && Array.length > 0)
            return true

        return false;
    }

    constructor() {
        super()
        effect(() => {
            console.log(`Parts: ${JSON.stringify(this.partsPerCar())}`)
        })
        effect(() => {
            if (this.carView()) {
                this.id.set(this.carView()!.carId!)
                this.getOnlyNumbers.set(this.carView()?.numberImages || 0)
            } else if (this.partView()) {
                this.id.set(this.partView()!.partId!)
                this.getOnlyNumbers.set(this.partView()!.numberImages || 0)
            } else if (this.rimWithTyreView()) {
                this.id.set(this.rimWithTyreView()!.id!)
                this.getOnlyNumbers.set(this.rimWithTyreView()!.numberImages || 0)
            }
        })
    }

    ngAfterViewInit(): void {
        if (this.isHighlighted()) goToPosition(this.id())
    }

    updateItem(event: number) {
        if (this.carView()) this.action.emit({ action: UpdateEnum.Update, id: event, car: true })
        else if (this.partView()) this.action.emit({ action: UpdateEnum.Update, id: event, car: false })
        else if (this.rimWithTyreView()) this.action.emit({ action: UpdateEnum.Update, id: event, car: false })
    }

    deleteItem(event: number) {
        this.confirmService.OKCancel('Съобщение', 'Моля потвърдете изтриването на обявата').subscribe((response) => {
            if (response === OKCancelOption.OK) this.action.emit({ action: UpdateEnum.Delete, id: event, car: true })
        })
    }

    displayParts(event: number) {
        if (this.partService.showParts() === event )
        {
            this.partService.showParts.set(0)
        }
        else 
            {
            this.carId.set(event)
            this.partService.showParts.set(this.id())
        }

        // if (this.$showParts())
        //     this.carId.set(event)
        // else
        //     this.carId.set(0)
    }

    label() {
        if (!this.$showParts()) return this.labels.SHOWPARTS
        else return this.labels.HIDEPARTS
    }

    //#region delete part
    deletePart(partId: number) {
        this.partService.deletePart(partId!).subscribe({
            next: (res) => {
                this.currentPartId = undefined
                if (res) {
                    this.partresource.reload()
                }
            },
            error: (error) => {
                this.popupService.openWithTimeout('Съобщение', 'Частта не може да бъде изтрита')
                this.alertService.error(error)
            },
            complete: () => {
                this.alertService.complete()
            },
        })
    }

    actionPart(event: DealerActionType) {
        this.currentPartId = event.id
        if (event.action === UpdateEnum.Delete) {
            this.deletePart(this.currentPartId!)
        } else {
            this.addPartFlag.set(true)
            //this.action.emit({ action: event.action, id: this.currentPartId, car: false })
        }
    }

    addPart(event: number) {
        console.log(`Part Id: ${event}`)
            this.addPartFlag.set(true)
//        this.action.emit({ action: UpdateEnum.New, id: event, car: false })
    }

    reload() {
        this.partresource.reload();
    }
    refreshPart(part: PartView) {
        if (part) {
            if (this.parts) {
                const index = this.parts?.findIndex((elem) => elem.partId === part.partId)
                if (index != -1) {
                    this.parts[index] = Object.assign({}, part)
                } else {
                    this.parts.splice(0, 0, part)
                }
            }
        }
        this.currentPartId = undefined
    }

    get user() {
        return this.authernticationService.currentUserValue
    }

    get modeType() {
        return this.mode
    }
}
