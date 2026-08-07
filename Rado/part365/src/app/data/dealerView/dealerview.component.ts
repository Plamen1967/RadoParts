//#region imports
import { NgClass } from '@angular/common'
import { AfterViewInit, Component, inject, OnInit, input, output, effect } from '@angular/core'
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
//#endregion
//#region component
@Component({
    selector: 'app-dealerview',
    templateUrl: './dealerview.component.html',
    styleUrls: ['./dealerview.component.css'],
    imports: [NgClass, RowPartDealerComponent, ImageComponent, DealerViewCarComponent, MatBadgeModule, MatIconModule, DealerViewTyreComponent],
})
//#endregion
export class DealerViewComponent extends HelperComponent implements OnInit, AfterViewInit {
    //#region variables and services
    parts: PartView[] = []
    showParts = false
    highlighted_?: number
    mode: UpdateEnum = UpdateEnum.View
    currentPartId?: number
    _carView?: CarView
    id!: number
    getOnlyNumbers = 0
    isHighlighted = false
    carView = input<CarView>()
    partView = input<PartView | undefined>()
    allowUpdate = input<boolean>(false)
    rimWithTyreView = input<DisplayPartView | undefined>()
    mainPicture = input<string | undefined>()
    highlighted = input<number | undefined>()
    showPart = input<boolean>(false)
    action = output<DealerActionType>()
    addPartCarId = output<number>()
    private authernticationService: AuthenticationService = inject(AuthenticationService)
    private confirmService: ConfirmServiceService = inject(ConfirmServiceService)
    private router: Router = inject(Router)
    private partService: PartServiceService = inject(PartServiceService)
    private nextIdService: NextIdService = inject(NextIdService)
    private carService: CarService = inject(CarService)
    private alertService: AlertService = inject(AlertService)
    private popupService: PopUpService = inject(PopUpService)
    //#endregion

    constructor() {
        super()
        effect(() => {
        if (this.carView()) {
            this.id = this.carView()!.carId!
            this.getOnlyNumbers = this.carView()?.numberImages || 0
        } else if (this.partView()) {
            this.id = this.partView()!.partId!
            this.getOnlyNumbers = this.partView()!.numberImages || 0
        } else if (this.rimWithTyreView()) {
            this.id = this.rimWithTyreView()!.id!
            this.getOnlyNumbers = this.rimWithTyreView()!.numberImages || 0
        }
        })
    }

    ngAfterViewInit(): void {
        if (this.isHighlighted) goToPosition(this.id)
    }
    ngOnInit(): void {
        this.isHighlighted = this.highlighted_ == this.id
        // console.log('Dealer view init', this.isHighlighted, this.id, this.highlighted_)
    }
    //#endregion

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
        if (!this.showParts)
            this.carService.getPartsByCarId(event).subscribe((parts_: PartView[]) => {
                this.parts = parts_
            })
        this.showParts = !this.showParts
    }

    label() {
        if (!this.showParts) return this.labels.SHOWPARTS
        else return this.labels.HIDEPARTS
    }

    //#region delete part
    deletePart(partId: number) {
        this.partService.deletePart(partId!).subscribe({
            next: (res) => {
                this.currentPartId = undefined
                if (res) {
                    const carIndex = this.parts.findIndex((x) => x.partId === partId)
                    this.parts.splice(carIndex, 1)
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
            this.action.emit({ action: event.action, id: this.currentPartId, car: false })
        }
    }

    addPart(event: number) {
        this.action.emit({ action: UpdateEnum.New, id: event, car: false })
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
