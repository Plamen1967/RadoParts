//#region import
import { AfterViewInit, Component, ElementRef, Inject, Input, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { AsyncPipe, DOCUMENT, ViewportScroller } from '@angular/common'
import { HelperComponent } from '@components/custom-controls/helper/helper.component'
import { SelectOption } from '@model/selectOption'
import { UpdateEnum } from '@model/enum/update.enum'
import { CarView } from '@model/car/carView'
import { debounceTime, distinctUntilChanged, Observable, Subject, switchMap, takeUntil, tap } from 'rxjs'
import { ModelService } from '@services/company-model-modification/model.service'
import { NextIdService } from '@services/nextId.service'
import { ModificationService } from '@services/company-model-modification/modification.service'
import { CarService } from '@services/car.service'
import { SelectComponent } from '@components/custom-controls/select-controls/select/select.component'
import { Filter } from '@model/filters/filter'
import { DealerActionType } from '@model/dealerActionType'
import { CONSTANT } from '@app/constant/globalLabels'
import { ConfirmServiceService } from '@app/dialog/services/confirmService.service'
import { NavigatorComponent } from '@components/result/navigator/navigator.component'
import { AlertService } from '@services/alert.service'
import { PopUpServiceService } from '@app/dialog/services/popUpService.service'
import { ActivatedRoute, ParamMap, Router } from '@angular/router'
import { DealerViewComponent } from '@app/data/dealerView/dealerview.component'
import { ModalService } from '@services/dialog-api/modal.service'
import { CompanyChoiseComponent } from '@app/component-main/company-choise/company-choise.component'
import { ModelChoiceComponent } from '@app/component-main/model-choice/model-choice.component'
import { ModificationChoiceComponent } from '@app/component-main/modification-choice/modification-choice.component'
import { ItemType } from '@model/enum/itemType.enum'
import AddCarComponent from '../addCar/addcar.component'
import { GoTopComponent } from '@components/custom-controls/goTop/goTop.component'
import AddPartComponent from '@app/data/parts/addPart/addpart.component'
import { YearComponent } from '@components/custom-controls/year/year.component'
import { Modification } from '@model/static-data/modification'
import { ListTitleComponent } from '@components/custom-controls/listtitle/listtitle.component'
import { goTop, goToPosition } from '@app/functions/functions'
import { LoggerService } from '@services/authentication/logger.service'
import UpdateCarComponent from '../updateCar/updateCar.component'
import UpdatePartComponent from '@app/data/parts/updatepart/updatepart.component'
import { UserCountService } from '@services/userCount.service'
import { UserCount } from '@model/userCount'
//#endregion
//#region component
@Component({
    standalone: true,
    selector: 'app-listcars',
    templateUrl: './listcars.component.html',
    styleUrls: ['./listCars.component.css'],
    imports: [
        SelectComponent,
        DealerViewComponent,
        ReactiveFormsModule,
        NavigatorComponent,
        CompanyChoiseComponent,
        ModelChoiceComponent,
        ModificationChoiceComponent,
        AddCarComponent,
        GoTopComponent,
        AddPartComponent,
        YearComponent,
        ListTitleComponent,
        UpdateCarComponent,
        UpdatePartComponent,
        AsyncPipe
    ],
})

// interface ListCarParam {
//     addCar?: boolean;
//     addBus?: boolean;
//     addPart?: boolean;
//     updateCar?: boolean;
//     updatePart?: boolean;
// };

//#endregion
export default class ListCarsComponent extends HelperComponent implements OnInit, AfterViewInit, OnDestroy {
    //#region members
    submitElement?: ElementRef<HTMLInputElement>
    display = 'none'
    deleteCarId?: number
    adCarFlag?: boolean
    models: SelectOption[] = [{ value: 0, text: CONSTANT.ALL }]
    modifications: SelectOption[] = [{ value: 0, text: CONSTANT.ALL }]
    yearFrom = this.labels.YEAR_START
    yearTo = 0
    currentCarId?: number = undefined
    mode: UpdateEnum = UpdateEnum.View
    addPartId?: number
    cars: CarView[] = []
    allCars: CarView[] = []
    carsList: SelectOption[] = []
    addPartCarId?: number
    listForm: FormGroup
    currentPartId?: number
    updateCars?: boolean = true
    numberPages = 0
    currentPage = 0
    loading?: boolean
    searched = true
    title = ''
    companyId = 0
    modelId = 0
    modificationId = 0
    itemType = ItemType.OnlyCar
    userId?: number
    id?: number
    label = 'Избери кола'
    addCarFlag = false
    addPartFlag = false
    addBusFlag = false
    carId?: number
    partId?: number
    updateCarFlag = false
    updatePartFlag = false
    updateBusFlag = false
    showParts = false;
    public todos$?: Observable<CarView[]>
    private readonly _autoSearch$: Subject<Filter>
    private readonly _debounce: number
    private readonly _destroy$: Subject<boolean>
    userCount$: Observable<UserCount | undefined>

    @Input() bus = 0
    //#endregion

    //#region c'tor
    constructor(
        private formBuilder: FormBuilder,
        private modelService: ModelService,
        public modificationService: ModificationService,
        private nextIdService: NextIdService,
        private carService: CarService,
        private scroller: ViewportScroller,
        private confirmService: ConfirmServiceService,
        private alertService: AlertService,
        private popupService: PopUpServiceService,
        private router: Router,
        private route: ActivatedRoute,
        @Inject(DOCUMENT) private document: Document,
        private modalService: ModalService,
        private loggerService: LoggerService,
        private userCountService: UserCountService
    ) {
        super()

        this.userCount$ = this.userCountService.userCount$
        this._autoSearch$ = new Subject<Filter>()
        this._debounce = 1500
        this._destroy$ = new Subject<boolean>()
        this.userId = this.authenticationService.user?.userId
        this.listForm = this.formBuilder.group({
            carId: [0],
            companyId: [0],
            modelId: [0],
            modificationId: [0],
            year: [0],
            bus: [0],
        })
    }
    //#endregion

    ngOnDestroy(): void {
        this._destroy$.next(true)
    }

    ngAfterViewInit(): void {
        this.search(this.listForm.value)
    }

    highlighted(carId?: number): boolean {
        console.log(`highlighted: ${this.currentCarId === carId} ${carId} ${this.currentCarId}`)
        return this.currentCarId === carId
    }
    ngOnInit() {
        this.bus = this.bus ?? 0
        this.loading = true
        this.setAutoSearch()
        this.yearTo = new Date().getUTCFullYear()
        this.listForm.controls['companyId'].valueChanges.subscribe((f) => this.onCompanyChange(f))
        this.listForm.controls['modelId'].valueChanges.subscribe((f) => this.onModelChange(f))
        this.listForm.patchValue({ bus: this.bus ?? 0 })
        this.listForm.valueChanges.subscribe((f) => this.search(f))

        this.route.queryParamMap.subscribe((params: ParamMap) => {
            goTop()
            this.addCarFlag = params.get('addCar') ? true : false
            this.addBusFlag = params.get('addBus') ? true : false
            this.addPartFlag = params.get('addPart') ? true : false
            this.updateCarFlag = params.get('updateCar') ? true : false
            this.updateBusFlag = params.get('updateBus') ? true : false
            this.updatePartFlag = params.get('updatePart') ? true : false
            this.title = this.bus ? 'Бусове' : 'Коли'
            if (this.bus) this.itemType = ItemType.OnlyBus
            else this.itemType = ItemType.OnlyCar
            this.label = this.bus ? 'Избери бус' : 'Избери кола'

            if (this.addCarFlag || this.addPartFlag || this.addBusFlag) {
                this.nextIdService.getNextId().subscribe({
                    next: (id) => {
                        this.id = id
                    },
                    error: (error) => {
                        this.loggerService.logError(error)
                    },
                    complete: () => {
                        return
                    },
                })
            } else if (this.updateCarFlag || this.updateBusFlag || this.updatePartFlag) {
                this.mode = UpdateEnum.Update

                if (params.get('carId') !== null) {
                    const id = params.get('carId')
                    if (id) this.id = this.carId = +id
                }
                if (params.get('partId') !== null) {
                    const id = params.get('partId')
                    if (id) this.id = this.partId = +id
                }
            } else {
                this.id = undefined
            }

            if (this.carService.currentCarId) this.currentCarId = this.carService.currentCarId

            this.carService.fetchCarNameId(this.bus).subscribe((res) => {
                this.carsList = res.map((item) => {
                    return { value: item.carId, text: item.regNumber }
                })
                this.carsList.unshift({ value: 0, text: 'Всички' })
            })
        })
    }

    submit(event: KeyboardEvent) {
        if (event.keyCode === 13) {
            event.preventDefault()
            this.search(this.listForm.value)
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    search(f: any) {
        const filter: Filter = f ?? this.listForm.value
        this._autoSearch$?.next(filter)
    }

    //#region events
    onCompanyChange(companyId: number) {
        this.companyId = companyId
        this.listForm.patchValue({ carid: 0 })
    }

    onModelChange(modelId: number) {
        this.modelId = modelId
        this.listForm.patchValue({ carid: 0 })
    }

    modificatioChanged(modification: Modification) {
        this.yearFrom = modification?.yearFrom ?? this.labels.YEAR_START
        this.yearTo = modification?.yearTo ?? 2025
        this.listForm.patchValue({ year: 0 })
    }

    clearForm() {
        this.listForm.patchValue({ carId: 0, companyId: 0, modelId: 0, modificationId: 0, year: 0 })
    }

    //#endregion

    actionCar(action: DealerActionType) {
        this.mode = action.action!

        if (this.mode === UpdateEnum.New) {
            if (action.car) this.addCar()
            else {
                this.currentPartId = action.id
                this.newPart(action.id!)
            }
        } else if (this.mode === UpdateEnum.Update) {
            if (action.car) this.updateCar(action.id!)
            else if (!action.car) this.updatePart(0, action.id!)
            else this.currentPartId = action.id
        } else if (action.car && this.mode === UpdateEnum.Delete) {
            this.deleteCar(action.id!)
        }
    }

    backUpdatePart() {
        this.currentPartId = undefined
    }
    updateCar(carId: number) {
        if (this.bus) this.router.navigate(['/data/bus'], { queryParams: { updateBus: true, carId: carId } })
        else this.router.navigate(['/data/cars'], { queryParams: { updateCar: true, carId: carId } })
    }

    updatePart(carId: number, partId: number) {
        if (this.bus) this.router.navigate(['/data/bus'], { queryParams: { updatePart: true, partId: partId } })
        else this.router.navigate(['/data/cars'], { queryParams: { updatePart: true, partId: partId } })
    }
    get modeType() {
        return this.mode
    }

    addPart(event: number) {
        this.nextIdService.getNextId().subscribe({
            next: (id) => {
                this.addPartCarId = id
                this.currentCarId = event
                this.mode = UpdateEnum.New
            },
            error: (error) => {
                this.loggerService.logError(error)
                this.popupService.openWithTimeout('Съобщение', 'Нова джанта/гума не може да бъде добавена!', 2000).subscribe(() => {
                    return
                })
            },
            complete: () => {
                return
            },
        })
    }

    //#region delete car

    deleteCar(carId: number) {
        this.currentCarId = undefined
        this.carService.deleteCar(carId!).subscribe({
            next: (res) => {
                if (res) {
                    this.popupService.openWithTimeout('Съобщение', 'Колата е успешно изтрита!')
                    this.userCountService.refresh()
                    const find = this.cars.findIndex((x) => x.carId === carId)
                    if (find !== -1) {
                        this.allCars.splice(find, 1)
                        this.cars = this.getPageData()
                    }
                }
            },
            error: (error) => {
                this.confirmService.OK('Съобщение', 'Колата не може да бъде изтрита!')
                this.alertService.error(error)
            },
            complete: () => {
                return
            },
        })
    }

    //#region rage management
    moveToPage(page: number) {
        this.currentPage = page
        this.cars = this.getPageData()
        goToPosition('top')
    }

    getPageData(): CarView[] {
        return this.allCars.slice((this.currentPage - 1) * 10, this.currentPage * 10)
    }

    nextPage() {
        if (this.currentPage + 1 > this.numberPages) return

        this.currentPage++
        this.cars = this.getPageData()
        goToPosition('top')
    }
    previousPage() {
        if (this.currentPage - 1 === 0) return

        this.currentPage--
        this.cars = this.getPageData()
        goToPosition('top')
    }

    get pageMessage() {
        const message = `${this.currentPage} от ${this.numberPages}`
        return message
    }

    getValue(userCount: UserCount) {
        if (this.bus) return userCount.busCount

        return userCount.carCount
    }
    focus() {
        this.submitElement?.nativeElement.focus()
    }

    addBus() {
        this.router.navigate(['/data/bus'], { queryParams: { addBus: true } })
    }

    newPart(carId: number) {
        this.currentCarId = carId;
        if (this.bus)
            this.router.navigate(['/data/bus'], { queryParams: { addPart: true, carId: carId, bus: this.bus } })
        else
            this.router.navigate(['/data/cars'], { queryParams: { addPart: true, carId: carId } })
    }

    addCar() {
        this.router.navigate(['/data/cars'], { queryParams: { addCar: true } })
    }

    //#endregion
    savedPart(pratId: number) {
        console.log(`Part id : ${pratId}`)
        return
    }

    setAutoSearch() {
        this._autoSearch$
            .pipe(
                debounceTime(this._debounce),
                distinctUntilChanged(),
                switchMap((Filter) => {
                    this.loading = true
                    this.cars = []
                    Filter.userId = this.userId
                    return this.carService.fetchCars(Filter).pipe(tap(() => (this.loading = true)))
                }),
                takeUntil(this._destroy$)
            )
            .subscribe({
                next: (res) => {
                    this.updateData(res)

                    this.currentCarId = this.carService.currentCarId
                    if (this.currentCarId) goToPosition(this.currentCarId)
                    this.updateCars = true
                    this.loading = false
                },
                error: (error) => {
                    this.loggerService.logError(error)
                    this.popupService.openWithTimeout('Съобщение', 'Данните не могат да бъдат заредени').subscribe(() => {
                        this.loading = false
                        this.router.navigate(['/'])
                    })
                },
                complete: () => {
                    this.loading = false
                },
            })
    }
    //#region  save Car
    loadCar(id: number) {
        this.carService.fetchCar(id).subscribe((car) => {
            this.refreshCar(car)
        })
    }

    refreshCar(car: CarView) {
        this.currentCarId = car.carId
        const updatedCar = { ...car }
        if (car) {
            const index = this.cars.findIndex((x) => x.carId === updatedCar.carId)
            if (index != -1) this.allCars[index] = Object.assign({}, updatedCar)
            else {
                this.allCars.unshift(updatedCar)
            }

            this.updateData(this.allCars)
            if (updatedCar.carId) {
                goToPosition(updatedCar.carId!.toString())
            }
        }
        this.id = undefined
    }

    updateData(res: CarView[]) {
        this.searched = true
        this.allCars = [...res]
        this.numberPages = Math.ceil(this.allCars.length / 10)
        if (this.carService.currentCarId) {
            const index = this.allCars.findIndex((item) => item.carId === this.carService.currentCarId)
            this.currentPage = this.numberPages = Math.ceil(index / 10) + 1
        } else {
            this.currentPage = 1
        }
        this.cars = [...this.getPageData()]
        goToPosition(this.carService.currentCarId)
    }

    //#endregion
    //#region save / noChange
    saved(event: number) {
        this.loadCar(event!)
    }

    back(event: number) {
        if (this.addCarFlag || this.addBusFlag || this.updateCarFlag || this.updateBusFlag) this.id = undefined
        this.currentCarId = event
    }
    //#endregion
}
