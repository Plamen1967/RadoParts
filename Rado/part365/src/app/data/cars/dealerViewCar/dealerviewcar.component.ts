//#region import
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { HelperComponent } from '@components/custom-controls/helper/helper.component'
import { CarView } from '@model/car/carView'
import { DealerActionType } from '@model/dealerActionType'
import { UpdateEnum } from '@model/enum/update.enum'
import { PartView } from '@model/part/partView'
import { AuthenticationService } from '@services/authentication/authentication.service'
import { NextIdService } from '@services/nextId.service'
import { CarService } from '@services/car.service'
import { ConfirmServiceService } from '@app/dialog/services/confirmService.service'
import { AlertService } from '@services/alert.service'
import { PopUpServiceService } from '@app/dialog/services/popUpService.service'
import { Router } from '@angular/router'
import { RowComponent } from '@components/custom-controls/partRow/row.component'
import { StaticSelectionService } from '@services/staticSelection.service'
import { InfoLine } from '@model/infoLine'
import { PartServiceService } from '@services/part/partService.service'
import { LoggerService } from '@services/authentication/logger.service'
//#endregion
//#region component
@Component({
    standalone: true,
    selector: 'app-dealerviewcar',
    templateUrl: './dealerviewcar.component.html',
    styleUrls: ['./dealerviewcar.component.css'],
    imports: [RowComponent],
})
//#endregion
export class DealerViewCarComponent extends HelperComponent implements OnInit {
    //#region c'tor
    parts: PartView[] = []
    mode: UpdateEnum = UpdateEnum.View
    currentPartId?: number
    countParts?: number
    description = ''
    isHighlighted?: boolean;
    lines: InfoLine[] = []
    _carView?: CarView;

    @Input() set carView(value: CarView) { this._carView = value; this.refreshView();}
    get carView() { return this._carView!};

    @Output() action: EventEmitter<DealerActionType> = new EventEmitter<DealerActionType>()
    @Output() addPartCarId: EventEmitter<number> = new EventEmitter<number>()
    @Input() showParts = false
    @Input() highlighted?: number;

    constructor(
        private authernticationService: AuthenticationService,
        private confirmService: ConfirmServiceService,
        private router: Router,
        private partService: PartServiceService,
        private nextIdService: NextIdService,
        private carService: CarService,
        private alertService: AlertService,
        private popupService: PopUpServiceService,
        private staticService: StaticSelectionService,
        private loggerService: LoggerService
    ) {
        super()
    }
    ngOnInit(): void {
        this.refreshView();
    }
    //#endregion

    refreshView() {
        this.lines = [];
        this.countParts = this.carView.countParts
        if (!this.carView.bus)
        this.description = `${this.carView.companyName} - ${this.carView.modelName} - ${this.carView.modificationName}`
        else 
        this.description = `${this.carView.companyName} - ${this.carView.modelName}`

        if (this.description) 
            this.lines.push({ label: 'Модел', value: this.description, price: false })
        if (this.carView.regNumber)
            this.lines.push({ label: 'Име на кола', value: this.carView.regNumber, price: false })
        if (this.carView.powerBHP)
            this.lines.push({ label: this.labels.POWERBHP, value: this.carView.powerBHP.toString()+ " hp", price: false })
        if (this.carView.description) 
            this.lines.push({ label: this.labels.DESCRIPTION_CAR, value: this.carView.description, price: false })
        if (this.carView.countParts) 
            this.lines.push({ label: this.labels.PARTCOUNTS, value: this.carView.countParts, price: false })
        if (this.carView.numberImages)
            this.lines.push({ label: 'Брой снимки', value: this.carView.numberImages, price: false })
        if (this.carView.year)
            this.lines.push({ label: 'Година', value: this.carView.year, price: false })
        if (this.carView.vin)
            this.lines.push({ label: 'VIN', value: this.carView.vin, price: false })
        if (this.carView.engineType)
            this.lines.push({ label: 'Двигател', value: this.staticService.EngineType[this.carView.engineType].text!, price: false })
        if (this.carView.engineModel)
            this.lines.push({ label: 'Двигател модел', value: this.carView.engineModel, price: false })
        if (this.carView.millage)
            this.lines.push({ label: 'Километри', value: this.carView.millage, price: false })
        if (this.carView.gearboxType)
            this.lines.push({ label: 'Скоростна кутия', value: this.staticService.GearboxType[this.carView.gearboxType].text!, price: false })
        if (this.carView.regionId)
            this.lines.push({ label: 'Регион', value: this.staticService.Region.find((x) => x.value === this.carView.regionId!)!.text!, price: false })

        this.isHighlighted = this.highlighted == this.carView.carId

    }
    updateCar(event: number) {
        this.action.emit({ action: UpdateEnum.Update, id: event, car: true })
    }

    deleteCar() {
        this.action.emit({ action: UpdateEnum.Delete, id: this.carView.carId, car: true })
    }

    displayCars(event: number) {
        if (!this.showParts) this.carService.getPartsByCarId(event).subscribe((parts_: PartView[]) => (this.parts = parts_))
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
        if (this.seller) {
            this.nextIdService.getNextId().subscribe( {
                next: (id) => {
                    this.router.navigate(['/data/addPart'], { queryParams: { carId: event, add: true, partId: id } })
                },
                error: (error) => {
                            this.loggerService.logError(error)
                            this.popupService.openWithTimeout('Съобщение', 'Нова джанта/гума не може да бъде добавена!', 2000).subscribe(() => {
                                return;
                            })

                },
                complete: () => {
                    return;
                }
            })
        }
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
        this.addPartCarId.emit(undefined)
    }

    get user() {
        return this.authernticationService.currentUserValue
    }

    get modeType() {
        return this.mode
    }
}
