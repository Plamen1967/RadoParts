//#region imports
import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, inject, Input, OnInit, Output } from '@angular/core'
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { HelperComponent } from '@components/custom-controls/helper/helper.component'
import { CarView } from '@model/car/carView'
import { UpdateEnum } from '@model/enum/update.enum'
import { SelectOption } from '@model/selectOption'
import { CarService } from '@services/car.service'
import { ModificationService } from '@services/company-model-modification/modification.service'
import { NextIdService } from '@services/nextId.service'
import { StaticSelectionService } from '@services/staticSelection.service'
import { ConfirmServiceService } from '@app/dialog/services/confirmService.service'
import { Car } from '@model/car/car'
import { PopUpServiceService } from '@app/dialog/services/popUpService.service'
import { HomeService } from '@services/home.service'
import { SelectComponent } from '@components/custom-controls/select-controls/select/select.component'
import { InputComponent } from '@components/custom-controls/input/input.component'
import { TextAreaComponent } from '@components/custom-controls/textArea/textArea.component'
import { ImageListComponent } from '@components/custom-controls/imagelist/imagelist.component'
import { CompanyChoiseComponent } from '@app/component-main/company-choise/company-choise.component'
import { ModelChoiceComponent } from '@app/component-main/model-choice/model-choice.component'
import { ModificationChoiceComponent } from '@app/component-main/modification-choice/modification-choice.component'
import { Modification } from '@model/static-data/modification'
import { CONSTANT } from '@app/constant/globalLabels'
import { OKCancelOption } from '@app/dialog/model/confirmDialogData'
import { ToolBarComponent } from '@components/custom-controls/toolBar/toolBar.component'
import { LoggerService } from '@services/authentication/logger.service'
import { UserCountService } from '@services/userCount.service'
import { DisplayPartView } from '@model/displayPartView'
import { ImageData } from '@model/imageData'
import { goTop } from '@app/functions/functions'
import { ToastService } from '@services/dialog-api/ToastService/toast.service'
import { ItemType } from '@model/enum/itemType.enum'
//#endregion

//#region metadata
@Component({
    selector: 'app-addcar',
    templateUrl: './addcar.component.html',
    styleUrls: ['./addcar.component.scss'],
    imports: [ImageListComponent, SelectComponent, InputComponent, TextAreaComponent, ReactiveFormsModule, CompanyChoiseComponent, ModelChoiceComponent, ModificationChoiceComponent, ToolBarComponent],
})
//#endregion
export default class AddCarComponent extends HelperComponent implements OnInit, AfterViewInit {
    label!: string
    //#region host listeners
    @HostListener('window:keydown.esc')
    handleKeyDownEscape() {
        this.cancel()
    }
    @HostListener('window:keydown.enter')
    handleKeyDownEnter() {
        this.onSubmit()
    }
    //#endregion

    //#region properties
    submitElement?: ElementRef<HTMLInputElement>
    public addCarForm: FormGroup
    car?: CarView
    yearFrom = this.labels.YEAR_START
    yearTo: number
    years?: SelectOption[]
    saving = false
    closeResult = ''
    formInitialValues: object
    submitted = false
    firstUpdate = true
    mainImageId?: number = 0
    modelId = 0
    companyId = 0
    userId = 0
    query = 0
    bus_ = 0
    ad = false
    images: ImageData[] = []
    _displayPartView?: DisplayPartView
    //#endregion

    //#region inputs and outputs
    @Input() set bus(value: number | undefined) {
        this.bus_ = value ?? 0
        this.onBusChange(this.bus_)
    }

    get bus() {
        return this.bus_
    }

    @Input() carId?: number
    @Input() add = false
    @Input() update = false
    @Input() mode: UpdateEnum = UpdateEnum.New

    @Input() set displayPartView(value: DisplayPartView) {
        this._displayPartView = value
        if (this._displayPartView) {
            this.images = value.images ?? []
            this.carId = this._displayPartView.id
            this.loadCar()
        }
    }
    @Output() noChange: EventEmitter<number> = new EventEmitter<number>()
    @Output() saved: EventEmitter<number> = new EventEmitter<number>()
    //#endregion
    public carService: CarService
    public modificationService: ModificationService
    public staticSelectionService: StaticSelectionService
    private activatedRoute: ActivatedRoute
    private nextIdService: NextIdService
    private formBuilder: FormBuilder
    private router: Router
    private confirmService: ConfirmServiceService
    private homeService: HomeService
    private loggerService: LoggerService
    private popupService: PopUpServiceService
    private userCountService: UserCountService
    private toastService: ToastService

    constructor() {
        super()
        this.carService = inject(CarService)
        this.modificationService = inject(ModificationService)
        this.staticSelectionService = inject(StaticSelectionService)
        this.activatedRoute = inject(ActivatedRoute)
        this.nextIdService = inject(NextIdService)
        this.formBuilder = inject(FormBuilder)
        this.router = inject(Router)
        this.confirmService = inject(ConfirmServiceService)
        this.homeService = inject(HomeService)
        this.loggerService = inject(LoggerService)
        this.popupService = inject(PopUpServiceService)
        this.userCountService = inject(UserCountService)
        this.toastService = inject(ToastService)

        this.addCarForm = this.formBuilder.group({
            companyId: [undefined, Validators.required],
            modelId: [undefined, Validators.required],
            modificationId: [undefined, Validators.required],
            year: [2021],
            regNumber: ['', Validators.required],
            powerkWh: [],
            powerBHP: [],
            millage: [],
            vin: ['', [Validators.minLength(17), Validators.maxLength(17)]],
            description: [''],
            engineType: [0],
            engineModel: [''],
            gearboxType: [0],
            regionId: [this.regionId],
            mainImageId: [''],
        })

        this.formGroup = this.addCarForm
        this.yearTo = this.currentYear
        this.setYears()
        this.addCarForm.controls['companyId'].valueChanges.subscribe((f) => this.onCompanyChange(f))
        this.addCarForm.controls['modelId'].valueChanges.subscribe((f) => this.onModelChange(f))
        this.addCarForm.valueChanges.subscribe(() => {
            this.clearZeros()
        })
        this.formInitialValues = this.addCarForm.value
        this.userId = this.loggedUser?.userId ?? 0
        goTop()
    }

    ngOnInit() {
        this.activatedRoute.queryParamMap.subscribe((param) => {
            this.parseQueryParams(param)
            this.carId = this.queryParams.carId ? this.queryParams.carId : undefined
            if (this.queryParams.query) this.query = +this.queryParams.query
            this.ad = this.queryParams.ad ? this.queryParams.ad : false
            this.loadCar()
        })
    }

    ngAfterViewInit(): void {
        this.goTop()
        return
    }
    //#endregion actions
    cancel() {
        if (this.changed) {
            this.changeMessage()
        } else {
            this.noChange.emit(this.carId)
            this.goBack()
        }
    }
    goBack() {
        history.back()
    }

    onSubmit() {
        this.submitted = true
        if (!this.addCarForm.valid) {
            this.toastService.show('Моля попълнете задължителната информация')
            return
        }

        if (this.mode == UpdateEnum.New) {
            this.carService.checkForUniqueness(this.addCarForm.value.regNumber, this.bus ?? 0).subscribe({
                next: (res) => {
                    if (res == false) {
                        const busCar = this.bus ? 'Бус' : 'Кола'
                        const message = `${busCar} с това име "${this.addCarForm.value.regNumber}" вече съществува`
                        this.toastService.show(message)

                        // this.popupService.openWithTimeout('Съобщение', message ).subscribe(() => {
                        //     return;
                        // })
                    } else {
                        this.addCar()
                    }
                },
            })
        } else {
            this.addCar()
        }
    }
    //#endregion

    //#endregion events
    onBusChange(f: number) {
        if (f) {
            this.addCarForm.controls['modificationId'].clearValidators()
            this.addCarForm.controls['modificationId'].updateValueAndValidity()
        } else {
            this.addCarForm.controls['modificationId'].setValidators([Validators.required])
        }
        this.label = this.bus ? 'Име на бус' : 'Име на кола'
    }

    onCompanyChange(companyId: number) {
        this.companyId = companyId
    }

    onModelChange(modelId: number) {
        this.modelId = modelId
    }

    defaultImageChanged(imageId: number) {
        this.addCarForm.patchValue({ mainImageId: imageId })
    }

    powerkWhChanged() {
        this.calculateBHP(this.addCarForm.controls['powerkWh'].value)
    }

    powerBHPChanged() {
        this.calculatekWh(this.addCarForm.controls['powerBHP'].value)
    }

    modificatioChanged(modification: Modification) {
        this.yearFrom = modification?.yearFrom ?? this.labels.YEAR_START
        this.yearTo = modification?.yearTo ?? 2025
        this.setYears()
    }
    //#endregion

    focus() {
        this.submitElement?.nativeElement.focus()
    }

    clearZeros() {
        if (!this.car) return

        if (this.car.powerBHP === 0) this.car.powerBHP = undefined
        if (this.car.powerkWh === 0) this.car.powerkWh = undefined
        if (this.car.millage === 0) this.car.millage = undefined

        if (this.addCarForm.controls['powerBHP'].value === 0) this.addCarForm.controls['powerBHP'].setValue(undefined)
        if (this.addCarForm.controls['powerkWh'].value === 0) this.addCarForm.controls['powerkWh'].setValue(undefined)
        if (this.addCarForm.controls['millage'].value === 0) this.addCarForm.controls['millage'].setValue(undefined)
    }

    changeMessage() {
        this.confirmService.OKCancel(CONSTANT.MESSAGE, 'Потвърдете, че искате да отмeните промените').subscribe((reuslt) => {
            if (reuslt === OKCancelOption.OK) {
                this.goBack()
            }
        })
    }

    loadCar() {
        if (!this.carId) {
            this.mode = UpdateEnum.New
        }
        if (this.update) {
            this.mode = UpdateEnum.Update
        }
        if (this.carId && this.mode == UpdateEnum.Update) {
            this.carService.fetchCar(this.carId).subscribe({
                next: (res) => {
                    this.car = { ...res }
                    this.carId = this.car.carId
                    this.mainImageId = this.car.mainImageId
                    this.bus = this.car.bus
                    this.mode = UpdateEnum.Update

                    this.clearZeros()
                    this.addCarForm.patchValue(this.car)
                    this.inialValue = this.addCarForm.value
                },
                error: (error) => {
                    this.loggerService.logError(error)
                    this.showMessageNotFound()
                },
                complete: () => {
                    return
                },
            })
        } else {
            this.nextIdService.getNextId(this.bus ? ItemType.OnlyBus : ItemType.OnlyCar).subscribe({
                next: (id) => {
                    if (id.nextId) {
                        this.carId = id.nextId
                    } else if (id.error) {
                        this.popupService.openWithTimeout('Съобщение', id.error, 2000).subscribe(() => {
                            this.goBack()
                        })
                    } else {
                        this.popupService.openWithTimeout('Съобщение', 'Грешка при генериране на Id за новата кола!', 2000).subscribe(() => {
                            this.goBack()
                        })
                    }
                },
                error: (error) => {
                    this.loggerService.logError(error)
                    this.popupService.openWithTimeout('Съобщение', 'Нова кола не може да бъде добавена!', 2000).subscribe(() => {
                        this.goBack()
                    })
                },
                complete: () => {
                    return
                },
            })
        }
    }
    get action() {
        if (this.mode == UpdateEnum.Update) {
            return this.labels.UPDATE
        } else {
            return this.labels.SAVE
        }
    }

    setYears() {
        const result: SelectOption[] = []
        for (let i = this.yearFrom; i <= this.yearTo; i++) {
            result.push({ value: i, text: i.toString() })
        }
        this.years = result
    }

    calculateBHP(value: number) {
        const newValue = Math.ceil(Number(value) * this.labels.KWH_TO_BHP)
        if (newValue != this.addCarForm.controls['powerBHP'].value) this.addCarForm.controls['powerBHP'].setValue(newValue)
    }

    calculatekWh(value: number) {
        const newValue = Math.floor(Number(value) / this.labels.KWH_TO_BHP)
        if (newValue != this.addCarForm.controls['powerkWh'].value) this.addCarForm.controls['powerkWh'].setValue(newValue)
    }

    addCar() {
        const carUpdated: Car = Object.assign(this.addCarForm.value, { bus: this.bus, carId: this.carId, userId: this.userId })
        this.saving = true
        this.carService.addUpdateCar(carUpdated, this.mode).subscribe({
            next: (val) => {
                this.carSaved(val)
            },
            error: (error) => {
                this.popupService.openWithTimeout('Съобщение', error.error.message, 2000)
                this.saving = false
                this.loggerService.logError(error)
                console.log(error)
            },
            complete: () => {
                return
            },
        })
    }

    carSaved(val: DisplayPartView) {
        this.carService.currentCarId = val.id
        this.saving = false
        const type = this.bus ? 'Буса' : 'Колата'
        const mode = this.mode === UpdateEnum.Update ? 'записана' : 'добавена'
        const content = `${type} е успешно ${mode}`
        this.carService.currentCarId = val.carId
        this.userCountService.refresh()
        const snackBarRef = this.toastService.showToast(content, 2)
        snackBarRef.afterDismissed().subscribe(() => {
            Object.keys(this.addCarForm.controls).forEach((key) => {
                this.addCarForm.controls[key].setErrors(null)
            })
            this.homeService.updateDisplayPartView(val)
            this.submitted = false
            this.saved.emit(val.id)
            if (this.ad) {
                this.carService.currentCarId = val.id
                if (this.bus) {
                    this.router.navigate(['/data/bus'])
                } else {
                    this.router.navigate(['/data/cars'])
                }
            } else this.goBack()
        })
        // const title = 'Съобщение'
        // this.popupService.openWithTimeout(title, content, 2000).subscribe(() => {
        // })
    }

    get UpdateFlag() {
        if (this.mode === UpdateEnum.View) return false
        else return true
    }

    get allowBack() {
        return this.mode === UpdateEnum.Update
    }

    showMessageNotFound() {
        this.popupService.openWithTimeout('Съобщение', 'Частта вече не е налична!').subscribe(() => this.goBack())
    }
}
