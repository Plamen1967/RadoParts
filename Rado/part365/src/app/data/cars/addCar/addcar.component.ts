//#region imports
import { AfterViewInit, Component, ElementRef, HostListener, inject, OnInit, ChangeDetectionStrategy, input, effect, output, computed, signal } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
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
import { PopUpService } from '@app/dialog/services/popUpService.service'
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
import { ToastService } from '@services/dialog-api/ToastService/toast.service'
import { ItemType } from '@model/enum/itemType.enum'
import { AddCarParam } from './addCarParam'
import { form, FormField, min, minLength } from '@angular/forms/signals'
import { NextId } from '@model/nextId'
import { httpResource } from '@angular/common/http'
import { environment } from '@env/environment'
//#endregion
interface addCarFormModelInterface {
    companyId: number
    modelId: number 
    modificationId: number
    year: number
    regNumber: string
    powerkWh: number | string
    powerBHP: number | string
    millage: number | string
    vin: string
    description: string
    engineType: number
    engineModel: string
    gearboxType: number
    regionId: number
    mainImageId: number | string
}


//#region metadata
@Component({
    selector: 'app-addcar',
    templateUrl: './addcar.component.html',
    styleUrls: ['./addcar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ImageListComponent, SelectComponent, InputComponent, TextAreaComponent, ReactiveFormsModule, CompanyChoiseComponent, ModelChoiceComponent, ModificationChoiceComponent, ToolBarComponent, FormField],
})
//#endregion
export default class AddCarComponent extends HelperComponent implements OnInit, AfterViewInit {
    //#region form
    addCarFormModel = signal<addCarFormModelInterface> ({
        companyId: 0,
        modelId: 0,
        modificationId: 0,
        year: 2021,
        regNumber: '',
        powerkWh: '',
        powerBHP: '',
        millage: '',
        vin: '',
        description: '',
        engineType: 0,
        engineModel: '',
        gearboxType: 0,
        regionId: this.regionId ?? 0,
        mainImageId: '',
    })

    addCarForm = form(this.addCarFormModel, (schema) => {
        min(schema.companyId, 1, {
            error: { kind: 'not-selected', message: 'Моля изберете фирма' }
        });
        min(schema.modelId, 1, {
            error: { kind: 'not-selected', message: 'Моля изберете модел' }
        });
        min(schema.modificationId, 1, {
            when: () => !this.bus(),
            error: { kind: 'not-selected', message: 'Моля изберете модификация' }
        });
        minLength(schema.regNumber, 1, {message: 'Моля въведете регистрационен номер' });
        minLength(schema.regNumber, 3, {message: 'Password must be at least 8 characters'});        
    })
    //#region form
    //#region services
    public carService: CarService = inject(CarService)
    public modificationService: ModificationService = inject(ModificationService)
    public staticSelectionService: StaticSelectionService = inject(StaticSelectionService)
    private activatedRoute: ActivatedRoute = inject(ActivatedRoute)
    private nextIdService: NextIdService = inject(NextIdService)
    private router: Router = inject(Router)
    private confirmService: ConfirmServiceService = inject(ConfirmServiceService)
    private homeService: HomeService = inject(HomeService)
    private loggerService: LoggerService = inject(LoggerService)
    private popupService: PopUpService = inject(PopUpService)
    private userCountService: UserCountService = inject(UserCountService)
    private toastService: ToastService = inject(ToastService)
    //#endregion

    carId_? : number;
    bus_ = 0
    add_ = false
    update_ = false
    mode_: UpdateEnum = UpdateEnum.New
    displayPartView_? : DisplayPartView;
    //#region inputs and outputs
    bus = input<number | undefined>(0)
    carId = input<number | undefined>(undefined)
    add = input<boolean>(false)
    update = input<boolean>(false)
    mode = input<UpdateEnum>(UpdateEnum.New)
    ad = input<string>('')
    displayPartView = input<DisplayPartView | undefined>(undefined)

    addCarParam = input.required<AddCarParam>()

    noChange = output<number|undefined>()
    saved = output<number>()
    //#endregion

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
    label!: string
    submitElement?: ElementRef<HTMLInputElement>
        // this.addCarForm = this.formBuilder.group({
        //     companyId: [undefined, Validators.required],
        //     modelId: [undefined, Validators.required],
        //     modificationId: [undefined, Validators.required],
        //     year: [2021],
        //     regNumber: ['', Validators.required],
        //     powerkWh: [],
        //     powerBHP: [],
        //     millage: [],
        //     vin: ['', [Validators.minLength(17), Validators.maxLength(17)]],
        //     description: [''],
        //     engineType: [0],
        //     engineModel: [''],
        //     gearboxType: [0],
        //     regionId: [this.regionId],
        //     mainImageId: [''],
        // })
    car?: CarView
    yearFrom = this.labels.YEAR_START
    yearTo: number
    years?: SelectOption[]
    saving = signal(false)
    closeResult = ''
    formInitialValues: object
    submitted = signal<boolean>(false)
    firstUpdate = true
    mainImageId?: number = 0
    modelId = 0
    companyId = 0
    userId = signal(0)
    query = 0
    images: ImageData[] = []
    UpdateFlag = true
    allowBack = false
    newCarId = signal(0)    
    //#endregion
    $carId = computed(() => this.addCarParam().carId ?? this.carId())
    $mode = computed(() => this.addCarParam().mode ?? this.mode())

    time = signal(0)
    nextResource = httpResource<NextId>(() => ({
        url: `${environment.restAPI}/users/GetNextId?itemType=${ItemType.OnlyBus}&time=${this.time()}`,
    }))
    constructor() {
        super()
        effect(() => {
            console.log(`Add Car Errors: ${this.addCarForm().errors()}`)
        })
        effect(() => {
            console.log(`Add Car Bus: ${this.bus()}`)
        })
        //#region form initialization
        effect(() => {
            this.addCarFormModel().powerkWh = this.addCarForm.powerBHP().value()
        })

        effect(() => {
            console.log('Add Car Form:', this.addCarForm().errors()[0])
        })
        effect(() => {
            if (this.displayPartView()) {
                this.displayPartView_ = this.displayPartView()
                this.carId_ = this.displayPartView_!.carId
                this.bus_ = this.displayPartView_!.bus!
            }
            this.mode_ = computed(() => this.mode())()
            this.add_ = computed(() => this.add())()
        })
        effect(() => {
            this.carId_ = computed(() => this.carId())()
            this.mode_ = computed(() => this.mode())()
        })

        effect(() => {
            this.UpdateFlag = this.mode() !== UpdateEnum.View
            this.allowBack = this.mode() === UpdateEnum.Update
        })

        effect(() => {
            // if (this.bus()) {
            //     this.addCarForm.controls['modificationId'].clearValidators()
            //     this.addCarForm.controls['modificationId'].updateValueAndValidity()
            // } else {
            //     this.addCarForm.controls['modificationId'].setValidators([Validators.required])
            // }
            this.label = this.bus() ? 'Име на бус' : 'Име на кола'
            this.time.set(Date.now())
        })


        effect(() => {
            if (this.displayPartView() !== undefined) {
                this.addCarFormModel.set({
                    companyId: this.displayPartView()!.companyId ?? 0,
                    modelId: this.displayPartView()!.modelId ?? 0,
                    year: this.displayPartView()!.year ?? 0,
                    regNumber: this.displayPartView()!.partNumber ?? '',
                    powerkWh: '',
                    powerBHP: this.displayPartView()!.powerBHP ?? 0,
                    millage: this.displayPartView()!.millage ?? 0,
                    vin: this.displayPartView()!.vin ?? '',
                    description: this.displayPartView()!.description ?? '',
                    engineType: this.displayPartView()!.engineType ?? 0,
                    engineModel: this.displayPartView()!.engineModel ?? '',
                    gearboxType: this.displayPartView()!.gearboxType ?? 0,
                    regionId: this.displayPartView()!.regionId ?? 0,
                    mainImageId: this.displayPartView()!.mainImageId ?? 0,
                    modificationId: this.displayPartView()!.modificationId ?? 0,
                })
                this.mainImageId = this.displayPartView()!.mainImageId
                this.images = this.displayPartView()!.images ?? []
            }
        })

        effect(() => {
            this.onCompanyChange(this.addCarForm.companyId().value())
        })
        effect(() => {
            this.onModelChange(+this.addCarForm.modelId().value())
        })

        effect(() => {
            this.clearZeros();
            this.addCarForm().value()
        })

        //#endregion

        this.yearTo = this.currentYear
        this.setYears()

        this.formInitialValues = this.addCarForm().value()
        this.userId.set(this.loggedUser?.userId ?? 0)
    }

    ngOnInit() {
        this.activatedRoute.queryParamMap.subscribe((param) => {
            this.parseQueryParams(param)
            this.carId_ = this.queryParams.carId ? this.queryParams.carId : undefined
            if (this.queryParams.query) this.query = +this.queryParams.query
            this.loadCar()
        })
    }

    ngAfterViewInit(): void {
        this.goTop()
        return
    }
    //#endregion actions
    cancel() {
        if (this.addCarForm().touched()) {
            this.changeMessage()
        } else {
            this.noChange.emit(this.carId())
            this.goBack()
        }
    }
    onCompanyChange(companyId: number) {
        this.companyId = companyId
    }

    onModelChange(modelId: number) {
        this.modelId = modelId
    }

    defaultImageChanged(imageId: number) {
        this.addCarFormModel.set({ ...this.addCarFormModel(), mainImageId: imageId })
    }

    powerkWhChanged() {
        this.calculateBHP(+this.addCarFormModel().powerkWh)
    }

    powerBHPChanged() {
        this.calculatekWh(+this.addCarFormModel().powerBHP)
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

        if (this.addCarFormModel().powerBHP === 0) this.addCarFormModel.set({ ...this.addCarFormModel(), powerBHP: 0 })
        if (this.addCarFormModel().powerkWh === 0) this.addCarFormModel.set({ ...this.addCarFormModel(), powerkWh: 0 })
        if (this.addCarFormModel().millage === 0) this.addCarFormModel.set({ ...this.addCarFormModel(), millage: 0 })
    }

    changeMessage() {
        this.confirmService.OKCancel(CONSTANT.MESSAGE, 'Потвърдете, че искате да отмeните промените').subscribe((reuslt) => {
            if (reuslt === OKCancelOption.OK) {
                this.goBack()
            }
        })
    }

    get action() {
        if (this.mode() == UpdateEnum.Update) {
            return this.labels.UPDATE
        } else {
            return this.labels.SAVE
        }
    }


    setYears() {
        const result: SelectOption[] = []
        for (let i = this.yearFrom; i <= this.yearTo; i++) {
            result.push({
                value: i,
                text: i.toString()
            })
        }
        this.years = result
    }

    calculateBHP(value: number) {
        const newValue = Math.ceil(Number(value) * this.labels.KWH_TO_BHP)
        if (newValue != this.addCarFormModel().powerBHP) this.addCarFormModel.set({ ...this.addCarFormModel(), powerBHP: newValue })
    }

    calculatekWh(value: number) {
        const newValue = Math.floor(Number(value) / this.labels.KWH_TO_BHP)
        if (newValue != this.addCarFormModel().powerkWh) this.addCarFormModel.set({ ...this.addCarFormModel(), powerkWh: newValue })
    }

    addCar(update: UpdateEnum = UpdateEnum.New) {
        const formModel = this.addCarFormModel()
        const carUpdated: Car = Object.assign({}, formModel, {
            modelId: Number(formModel.modelId),
            modificationId: Number(formModel.modificationId),
            powerkWh: Number(formModel.powerkWh),
            powerBHP: Number(formModel.powerBHP),
            millage: Number(formModel.millage),
            mainImageId: Number(formModel.mainImageId),
            bus: this.bus(),
            carId: this.carId() ?? this.$carId() ?? this.newCarId(),
            userId: this.userId(),
        })
        this.saving.set(true)

        this.carService.addUpdateCar(carUpdated, update).subscribe({
            next: (val) => {
                this.carSaved(val)
            },
            error: (error) => {
                this.popupService.openWithTimeout('Съобщение', error.error.message, 2000)
                this.saving.set(false)
                this.loggerService.logError(error)
                console.log(error)
            },
            complete: () => {
                this.saving.set(false)
                return
            },
        })
    }

    carSaved(val: DisplayPartView) {
        this.carService.currentCarId = val.id
        this.saving.set(false)
        const type = this.bus() ? 'Буса' : 'Колата'
        const mode = this.mode() === UpdateEnum.Update ? 'записана' : 'добавена'
        const content = `${type} е успешно ${mode}`
        this.carService.currentCarId = val.carId
        this.userCountService.refresh()
        const snackBarRef = this.toastService.showToast(content, 2)
        snackBarRef.afterDismissed().subscribe(() => {
            this.homeService.updateDisplayPartView(val)
            this.submitted.set(false)
            this.saved.emit(val.id!)
            this.carService.currentCarId = val.id
            if (this.ad() != 'new') {
                if (this.bus() === 1) {
                    this.router.navigate(['/data/bus'])
                } else {
                    this.router.navigate(['/data/cars'])
                }
            } else this.goBack()
        })
    }

    showMessageNotFound() {
        this.popupService.openWithTimeout('Съобщение', 'Частта вече не е налична!').subscribe(() => this.goBack())
    }

    goBack() {
        this.noChange.emit(this.$carId())
    }

    onSubmit() {
        this.submitted.set(true)
        if (!this.addCarForm().valid()) {
            console.log('Form is company:', this.addCarForm.companyId().errors(), this.addCarForm().value())
            this.toastService.show('Моля попълнете задължителната информация')
            return
        }

        if (this.$mode() === UpdateEnum.New) {
            this.carService.checkForUniqueness(this.addCarFormModel().regNumber, this.bus() ?? 0).subscribe({
                next: (res) => {
                    if (res == false) {
                        const busCar = this.bus() ? 'Бус' : 'Кола'
                        const message = `${busCar} с това име "${this.addCarFormModel().regNumber}" вече съществува`
                        this.toastService.show(message)
                    } else {
                        this.addCar(UpdateEnum.New)
                    }
                },
            })
        } else {
            this.addCar(UpdateEnum.Update)
        }
    }
    loadCar() {
        if (this.$carId() && this.$mode() == UpdateEnum.Update) {
            this.carService.fetchCar(this.$carId()!).subscribe({
                next: (res) => {
                    this.car = { ...res }
                    this.carId_ = this.car.carId
                    this.mainImageId = this.car.mainImageId
                    this.bus_ = this.car.bus!
                    this.mode_ = UpdateEnum.Update

                    this.clearZeros()
                    this.addCarFormModel.update((value) => ({...value, ...this.car}))
                    this.inialValue = this.addCarFormModel()
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
            this.nextIdService.getNextId(this.bus() ? ItemType.OnlyBus : ItemType.OnlyCar).subscribe({
                next: (id) => {
                    if (id.nextId) {
                        this.newCarId.set(id.nextId)
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

            this.inialValue = this.addCarFormModel()
        }
    }
}
