import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core'
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { HelperComponent } from '@components/custom-controls/helper/helper.component'
import { CarView } from '@model/car/carView'
import { UpdateEnum } from '@model/enum/update.enum'
import { SelectOption } from '@model/selectOption'
import { CarService } from '@services/car.service'
import { ModelService } from '@services/company-model-modification/model.service'
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

@Component({
    standalone: true,
    selector: 'app-addcar',
    templateUrl: './addcar.component.html',
    styleUrls: ['./addcar.component.scss'],
    imports: [ImageListComponent, SelectComponent, InputComponent, TextAreaComponent, ReactiveFormsModule, CompanyChoiseComponent, ModelChoiceComponent, ModificationChoiceComponent, ToolBarComponent],
})
export default class AddCarComponent extends HelperComponent implements OnInit, AfterViewInit {
    @HostListener('window:keydown.esc')
    handleKeyDownEscape() {
        this.cancel()
    }
    @HostListener('window:keydown.enter')
    handleKeyDownEnter() {
        this.onSubmit()
    }

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
    images: ImageData[] = []
    inialValue: undefined
    _displayPartView?: DisplayPartView
    @Input() set bus(value: number | undefined) {
        this.bus_ = value ?? 0
        this.onBusChange(this.bus_)
    }

    get bus() {
        return this.bus_
    }

    @Input() carId?: number
    @Input() set displayPartView(value: DisplayPartView) {
        this._displayPartView = value
        if (this._displayPartView) {
            this.images = value.images ?? []
            this.carId = this._displayPartView.id
            this.loadCar()
        }
    }
    @Input() add = false
    @Input() update = false
    @Input() mode: UpdateEnum = UpdateEnum.New
    @Output() noChange: EventEmitter<number> = new EventEmitter<number>()
    @Output() saved: EventEmitter<number> = new EventEmitter<number>()

    constructor(
        public modelService: ModelService,
        public carService: CarService,
        public modificationService: ModificationService,
        public staticSelectionService: StaticSelectionService,
        private activatedRoute: ActivatedRoute,
        private nextIdService: NextIdService,
        formBuilder: FormBuilder,
        private confirmService: ConfirmServiceService,
        private homeService: HomeService,
        private loggerService: LoggerService,
        private popupService: PopUpServiceService,
        private userCountService: UserCountService,
        private toastService: ToastService
    ) {
        super()
        this.addCarForm = formBuilder.group({
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
            regionId: [-1],
            mainImageId: [''],
        })

        this.yearTo = this.currentYear
        this.setYears()
        this.addCarForm.controls['companyId'].valueChanges.subscribe((f) => this.onCompanyChange(f))
        this.addCarForm.controls['modelId'].valueChanges.subscribe((f) => this.onModelChange(f))
        this.addCarForm.controls['modificationId'].valueChanges.subscribe((f) => this.onModificationChange(f))
        this.formInitialValues = this.addCarForm.value
        this.userId = this.loggedUser?.userId ?? 0
        goTop()
    }

    ngAfterViewInit(): void {
        this.addCarForm.patchValue({ regionId: this.regionId })
        document.querySelector('body')?.scrollTo(0, 0)
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant',
        })
        return
    }

    focus() {
        this.submitElement?.nativeElement.focus()
    }

    onBusChange(f: number) {
        if (f) {
            this.addCarForm.controls['modificationId'].clearValidators()
            this.addCarForm.controls['modificationId'].updateValueAndValidity()
        } else {
            this.addCarForm.controls['modificationId'].setValidators([Validators.required])
        }
    }

    clearZeros() {
        if (!this.car) return

        if (this.car.powerBHP === 0) this.car.powerBHP = undefined
        if (this.car.powerkWh === 0) this.car.powerkWh = undefined
        if (this.car.millage === 0) this.car.millage = undefined
        if (this.car.price === 0) this.car.price = undefined
    }

    get label() {
        return this.bus ? 'Име на бус' : 'Име на кола'
    }

    get changed() {
        return JSON.stringify(this.inialValue) !== JSON.stringify(this.addCarForm.value)
    }

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

    changeMessage() {
        this.confirmService.OKCancel(CONSTANT.MESSAGE, 'Потвърдете, че искате да отмeните промените').subscribe((reuslt) => {
            if (reuslt === OKCancelOption.OK) {
                this.goBack()
            }
        })
    }

    ngOnInit() {
        this.activatedRoute.queryParamMap.subscribe((param) => {
            const id = param.get('id')
            const query = param.get('query')
            if (id) this.carId = +id
            if (query) this.query = +query

            this.loadCar()
        })
    }

    loadCar() {
        if (this.car) return

        if (!this.carId) {
            this.mode = UpdateEnum.New
        }
        if (this.update) {
            this.mode = UpdateEnum.Update
        }
        if (this.carId && this.mode == UpdateEnum.Update) {
            this.carService.fetchCar(this.carId).subscribe({
                next: (res) => {
                    this.car = res
                    this.mainImageId = this.car.mainImageId
                    this.clearZeros()
                    this.addCarForm.patchValue(this.car)
                    this.inialValue = this.addCarForm.value
                    this.bus = this.car.bus
                    this.mode = UpdateEnum.Update
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
            this.addCarForm.patchValue({ regionId: this.regionId })
            this.nextIdService.getNextId().subscribe({
                next: (id) => {
                    this.carId = id
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
    defaultImageChanged(imageId: number) {
        this.addCarForm.patchValue({ mainImageId: imageId })
    }

    get currentYear() {
        const currentDate = new Date()
        return currentDate.getUTCFullYear()
    }

    get action() {
        if (this.mode == UpdateEnum.Update) {
            return this.labels.UPDATE
        } else {
            return this.labels.SAVE
        }
    }

    get controls() {
        return this.addCarForm.controls
    }

    onCompanyChange(companyId: number) {
        this.companyId = companyId
    }

    onModelChange(modelId: number) {
        this.modelId = modelId
    }

    modificatioChanged(modification: Modification) {
        this.yearFrom = modification?.yearFrom ?? this.labels.YEAR_START
        this.yearTo = modification?.yearTo ?? 2025
        this.setYears()
    }

    setYears() {
        const result: SelectOption[] = []
        for (let i = this.yearFrom; i <= this.yearTo; i++) {
            result.push({ value: i, text: i.toString() })
        }
        this.years = result
    }

    powerkWhChanged() {
        this.calculateBHP(this.addCarForm.controls['powerkWh'].value)
    }

    powerBHPChanged() {
        this.calculatekWh(this.addCarForm.controls['powerBHP'].value)
    }

    calculateBHP(value: number) {
        const newValue = Math.ceil(Number(value) * this.labels.KWH_TO_BHP)
        if (newValue != this.addCarForm.controls['powerBHP'].value) this.addCarForm.controls['powerBHP'].setValue(newValue)
    }

    calculatekWh(value: number) {
        const newValue = Math.floor(Number(value) / this.labels.KWH_TO_BHP)
        if (newValue != this.addCarForm.controls['powerkWh'].value) this.addCarForm.controls['powerkWh'].setValue(newValue)
    }

    onSubmit() {
        this.submitted = true
        if (!this.addCarForm.valid) {
            this.toastService.show('Моля попълнете задължителната информация')
            //this.confirmService.OK('Съобщение', 'Моля попълнете задължителната информация', 'Ok')
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

    addCar() {
        const carUpdated: Car = Object.assign({}, this.addCarForm.value)
        carUpdated.carId = this.carId
        carUpdated.bus = this.bus
        carUpdated.userId = this.userId
        this.saving = true
        this.carService
            .addUpdateCar(carUpdated, this.mode)
            .pipe()
            .subscribe({
                next: (val) => {
                    this.carService.currentCarId = val.id
                    this.saving = false
                    const type = this.bus ? 'Буса' : 'Колата'
                    const mode = this.mode === UpdateEnum.Update ? 'записана' : 'добавена'
                    const content = `${type} е успешно ${mode}`
                    this.carService.currentCarId = val.carId
                    this.userCountService.refresh()
                    const snackBarRef = this.toastService.showToast(content, 1)
                    snackBarRef.afterDismissed().subscribe(() => {
                        Object.keys(this.addCarForm.controls).forEach((key) => {
                            this.addCarForm.controls[key].setErrors(null)
                        })
                        this.homeService.updateDisplayPartView(val)
                        this.submitted = false
                        this.saved.emit(val.id)
                        this.goBack()
                    })
                    // const title = 'Съобщение'
                    // this.popupService.openWithTimeout(title, content, 2000).subscribe(() => {
                    // })
                },
                error: (error) => {
                    this.popupService.openWithTimeout('Съобщение', error.error.message, 2000)
                    this.saving = false
                    console.log(error)
                },
                complete: () => {
                    return
                },
            })
    }

    get UpdateFlag() {
        if (this.mode === UpdateEnum.View) return false
        else return true
    }

    get allowBack() {
        return this.mode === UpdateEnum.Update
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onModificationChange(modificationId: number) {
        return
    }

    showMessageNotFound() {
        this.popupService.openWithTimeout('Съобщение', 'Частта вече не е налична!').subscribe(() => this.goBack())
    }
}
