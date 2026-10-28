//#region import
import { AfterViewInit, Component, computed, effect, HostListener, inject, input, OnDestroy, OnInit, output, signal, untracked } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { NavigationStart, Router } from '@angular/router'
import { PopUpService } from '@app/dialog/services/popUpService.service'
import { HelperComponent } from '@components/custom-controls/helper/helper.component'
import { CarView } from '@model/car/carView'
import { UpdateEnum } from '@model/enum/update.enum'
import { FilterCar } from '@model/filters/filterCar'
import { PartView } from '@model/part/partView'
import { SelectOption } from '@model/selectOption'
import { CarService } from '@services/car.service'
import { NextIdService } from '@services/nextId.service'
import { PartServiceService } from '@services/part/partService.service'
import { StaticSelectionService } from '@services/staticSelection.service'
import { UserService } from '@services/user.service'
import { ImageData } from '@model/imageData'
import { SelectComponent } from '@components/custom-controls/select-controls/select/select.component'
import { InputComponent } from '@components/custom-controls/input/input.component'
import { TextAreaComponent } from '@components/custom-controls/textArea/textArea.component'
import { ConfirmServiceService } from '@app/dialog/services/confirmService.service'
import { ImageListComponent } from '../../../components/custom-controls/imagelist/imagelist.component'
import { CONSTANT } from '@app/constant/globalLabels'
import { HomeService } from '@services/home.service'
import { Numberparts } from '@model/numberparts'
import { CompanyChoiseComponent } from '@app/component-main/company-choise/company-choise.component'
import { ModelChoiceComponent } from '@app/component-main/model-choice/model-choice.component'
import { ModificationChoiceComponent } from '@app/component-main/modification-choice/modification-choice.component'
import { Modification } from '@model/static-data/modification'
import { OptionItem } from '@model/optionitem'
import { CategoryChoiseComponent } from '@app/category-main/category-choise/category-choise.component'
import { DealersubcategoryChoiceComponent } from '@app/category-main/dealersubcategory-choice/dealersubcategory-choice.component'
import { DealerSubCategory } from '@model/category-subcategory/dealerSubCategory'
import { OKCancelOption } from '@app/dialog/model/confirmDialogData'
import { ToolBarComponent } from '@components/custom-controls/toolBar/toolBar.component'
import { goTop } from '@app/functions/functions'
import { LoggerService } from '@services/authentication/logger.service'
import { UserCountService } from '@services/userCount.service'
import { DisplayPartView } from '@model/displayPartView'
import { ToastService } from '@services/dialog-api/ToastService/toast.service'
import { ItemType } from '@model/enum/itemType.enum'
import { form, FormField, min, minLength } from '@angular/forms/signals'
import { Part } from '@model/part/part'
import { toSignal } from '@angular/core/rxjs-interop'
import { httpResource } from '@angular/common/http'
import { environment } from '@env/environment'
import { CarNameId } from '@model/carNameId'
import { AddItemParam } from '@app/data/cars/addCar/addCarParam'
import { NextId } from '@model/nextId'
import { MatTooltipModule, TooltipPosition } from '@angular/material/tooltip'
//#endregion
//#region interface
interface addPartFormInterface {
    partForCar: 'car' | 'part'
    carId: number
    newpartId: number
    companyId: number
    modelId: number
    modificationId: number
    year: number
    vin: string
    powerkWh: number | string
    powerBHP: number | string
    millage: string
    engineType: number
    engineModel: string
    gearboxType: number
    regionId: number
    categoryId: number
    dealerSubCategoryId: number
    description: string
    partNumber: string
    price: number
    leftRightPosition: number
    frontBackPosition: number
    dealerSubCategoryName: string
    mainImageId: number
    bus: number
}
//#endregion
//#region component
@Component({
    selector: 'app-addpart',
    templateUrl: './addpart.component.html',
    styleUrls: ['./addpart.component.scss'],
    imports: [
        ImageListComponent,
        ReactiveFormsModule,
        TextAreaComponent,
        SelectComponent,
        InputComponent,
        CompanyChoiseComponent,
        ModelChoiceComponent,
        ModificationChoiceComponent,
        CategoryChoiseComponent,
        DealersubcategoryChoiceComponent,
        ToolBarComponent,
        FormField,
        MatTooltipModule,
    ],
})
//#endregion
export default class AddPartComponent extends HelperComponent implements AfterViewInit, OnInit, OnDestroy {
    @HostListener('window:keydown.esc')
    handleKeyDownEscape() {
        this.cancel()
    }
    @HostListener('window:keydown.enter')
    handleKeyDownEnter() {
        this.onSubmit()
    }

    //#region members
    addPartFormModel = signal<addPartFormInterface>({
        partForCar: 'car',
        carId: 0,
        newpartId: 0,
        companyId: 0,
        modelId: 0,
        modificationId: 0,
        year: 2021,
        vin: '',
        powerkWh: '',
        powerBHP: '',
        millage: '',
        engineType: 0,
        engineModel: '',
        gearboxType: 0,
        regionId: -1,
        categoryId: 0,
        dealerSubCategoryId: 0,
        description: '',
        partNumber: '',
        price: 0,
        leftRightPosition: 0,
        frontBackPosition: 0,
        dealerSubCategoryName: '',
        mainImageId: 0,
        bus: 0,
    })
    //#endregion

    //#region validation
    addPartForm = form(this.addPartFormModel, (path) => {
        min(path.carId, 1, {
            message: 'Моля изберете бус',
            when: ({ valueOf }) => valueOf(path.partForCar) == 'car' && this.bus() == 1,
        })
        min(path.carId, 1, {
            message: 'Моля изберете кола',
            when: ({ valueOf }) => valueOf(path.partForCar) == 'car' && this.bus() == 0,
        })
        min(path.companyId, 1, {
            message: 'Моля изберете компания',
            when: ({ valueOf }) => valueOf(path.partForCar) == 'part',
        })
        min(path.modelId, 1, {
            message: 'Моля изебрете модел',
            when: ({ valueOf }) => valueOf(path.partForCar) == 'part',
        })
        min(path.modificationId, 1, {
            message: 'Моля изебрете модификация',
            when: () => {
                if (this.$mode() === UpdateEnum.Update && this.addPartForm().value().bus === 1) return false
                if (this.bus() == 1) return false
                return true
            },
        })
        min(path.categoryId, 1, {
            message: 'Моля въведете категория',
        })
        min(path.dealerSubCategoryId, 1, {
            message: 'Моля въведете дилърска категория',
        })
        minLength(path.dealerSubCategoryName, 1, {
            message: 'Моля въведете име дилърска категория',
        })
        min(path.price, 0.01, {
            message: 'Моля въведете цена.',
        })
    })
    //#endregion

    //#region #members
    $submitted = signal(false)
    cars = signal<SelectOption[]>([])
    car?: CarView
    filterCar: FilterCar = new FilterCar()
    partView?: PartView
    yearFrom = this.labels.YEAR_START
    yearTo = 2021
    years?: SelectOption[]
    browserRefresh = false
    partForCar = computed(() => this.addPartForm.partForCar().value() === 'car')
    engineTypeName?: string
    initialState?: addPartFormInterface
    dealerSubCategoryId?: number
    images: ImageData[] = []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formInitialValues?: any
    ngbModuleRef?: object
    closeResult?: string
    saving = signal<boolean>(false)
    numberOfPartsPerUser = 0
    imgURL?: string
    message?: string
    numberOfParts?: Numberparts
    loading = true
    dealerSubCategoryName?: string
    companies: SelectOption[] = []
    models: SelectOption[] = []
    modifications: SelectOption[] = []
    dealerSubCategories: OptionItem[] = []
    positionOptions: TooltipPosition[] = ['below', 'above', 'left', 'right']

    companyId = computed(() => this.addPartForm.companyId().value())
    modelId = computed(() => this.addPartForm.modelId().value())
    categoryId = computed(() => this.addPartForm.categoryId().value())
    newPart = computed(() => {
        return this.ad() === 'new' || this.add()
    })

    $error = signal<string>('')
    carIdSdiabled = false
    mainImageId?: number = 0
    updateFlag = false
    _displayPartView?: DisplayPartView
    //#endregion

    //#region input/output
    viewPartId = input<number | undefined>()
    partCarId = input<number | undefined>()
    mode = input<UpdateEnum>(UpdateEnum.New)
    partId = input<number>()
    partIdNew = input<number>()
    bus = input<number>(0)
    id = input<number>(0)
    ad = input<string>('')
    add = input<boolean>(false)
    partyId = input<number>(0)
    displayPartView = input<DisplayPartView | undefined>()
    saved = output<number>()
    noChange = output<number>()
    carId = input<number | undefined>(undefined)
    update = input<boolean>(false)
    addItemParam = input.required<AddItemParam>()
    time = signal(0)
    query = input<number>()
    description = ''
    newItemId = signal(0)

    //#endregion

    //#region
    private carService: CarService = inject(CarService)
    private partService: PartServiceService = inject(PartServiceService)
    public staticSelectionService: StaticSelectionService = inject(StaticSelectionService)
    private router: Router = inject(Router)
    private homeService: HomeService = inject(HomeService)
    private confirmService: ConfirmServiceService = inject(ConfirmServiceService)
    private userService: UserService = inject(UserService)
    private nextIdService: NextIdService = inject(NextIdService)
    private loggerService: LoggerService = inject(LoggerService)
    public popupService: PopUpService = inject(PopUpService)
    private userCountService: UserCountService = inject(UserCountService)
    private toastService: ToastService = inject(ToastService)

    $carsResource = httpResource<CarNameId[]>(() => `${environment.restAPI}/car/GetCarNameId?bus=${this.bus()}`)

    $selectedCarResource = httpResource<CarView>(() => `${environment.restAPI}/car/${this.addPartForm.carId().value()}`)

    $itemId = computed(() => {
        if (this.addItemParam()?.id && this.addItemParam()?.id != 0) return this.addItemParam()?.id
        if (this.carId() && this.carId() != 0) return this.carId()
        return this.newItemId()
    })
    $canUpdate = computed(() => {
        console.log(`Mode is ${this.$mode()} ${this.add()} ${this.addItemParam()?.add}`)
        return this.$mode() === UpdateEnum.Update || this.$mode() === UpdateEnum.New
    })

    $mode = computed(() => {
        let mode: UpdateEnum = UpdateEnum.View
        if (this.addItemParam()?.add) mode = UpdateEnum.New
        else if (this.addItemParam()?.mode) mode = this.addItemParam().mode!
        else if (this.mode()) mode = this.mode()
        else if (this.ad() == 'new') mode = UpdateEnum.New

        return mode
    })

    $contentMessage = computed(() => {
        const modeMessage = this.mode() === UpdateEnum.Update ? 'записана' : 'добавена'
        return `${this.$typeMessage()} е успешно ${modeMessage}`
    })

    $actionMessage = computed(() => {
        if (this.mode() == UpdateEnum.Update) {
            return this.labels.UPDATE
        } else {
            return this.labels.SAVE
        }
    })

    $newItemId = computed<number>(() => this.nextResource.value()?.nextId ?? 0)
    $typeMessage = computed(() => (this.bus() ? 'Буса' : 'Колата'))

    nextResource = httpResource<NextId>(
        () => {
            console.log(`Resource called ${this.$mode()} ${this.$mode() != 0} ${this.newItemId()}`)
            const mode: UpdateEnum = this.$mode()
            const check = mode === UpdateEnum.New
            if (check && this.newItemId() == 0) {
                untracked(() => this.newItemId.set(-1))
                return {
                    url: `${environment.restAPI}/users/GetNextId?itemType=${ItemType.OnlyBus}`,
                }
            } else {
                return undefined
            }
        },
        {
            parse: (rawResponse: unknown): NextId => {
                const nextId = rawResponse as NextId
                this.newItemId.set(nextId.nextId!)
                console.log(`Ne Id: ${this.newItemId()}`)
                return nextId
            },
            defaultValue: { nextId: 0, error: '' },
        }
    )

    $choice = computed(() => {
        console.log(`Is bus: ${this.bus()}`)
        return this.bus() == 1 ? 'бус' : 'кола'
    })

    $description = computed(() => {
        if (!this.$selectedCarResource.hasValue()) return ''
        if (!this.addPartForm.carId().value()) return ''

        const car = this.$selectedCarResource.value()
        return `${car.regNumber} - ${car.companyName} ${car.modelName} ${car.modificationId ? car.modificationName : ''}`
    })

    $cars = computed(() => {
        const cars = this.$carsResource.value()?.map((car) => {
            return {
                value: car.carId,
                text: car.regNumber,
            }
        })
        cars?.unshift({ value: 0, text: `Избери ${this.$choice()}` })
        console.log(`Cars: ${cars}`)
        return cars ?? []
    })

    $carId = computed(() => this.partCarId())
    $add = computed(() => this.add())
    $action = computed(() => {
        if (this.$mode() == UpdateEnum.Update) {
            return this.labels.UPDATE
        } else {
            return this.labels.SAVE
        }
    })

    // $partId = computed(() => {
    //     console.log(this.partyId(), this.id(), this.partIdNew())
    //     if (this.partyId()) return this.partyId()
    //     else if (this.partIdNew()) return +this.partIdNew()!
    //     else if (this.id()) return this.id()
    //     else if (this.displayPartView() && this.displayPartView()?.id) return this.displayPartView()?.id
    //     else return 0
    // })

    constructor() {
        //#endregion
        super()
        this.dealerSubCategories.push({ id: 0, description: 'Избери Подкатегория Дилър', count: 0, countCars: 0, countParts: 0, groupModelId: 0 })

        this.formInitialValues = this.initialState = this.addPartForm().value()
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationStart) {
                this.browserRefresh = !this.router.navigated
            }
        })

        this.addPartFormModel.update((value) => ({ ...value, regionId: this.regionId() }))
        //#region effect
        effect(() => {
            const isCar = this.addPartForm.partForCar().value() === 'car'
            if (!isCar) this.addPartFormModel.update((value) => ({ ...value, carId: 0 }))
        })

        effect(() => {
            console.log(`Part Id: ${this.$itemId()} ${this.addPartForm.categoryId().value()}}`)
        })
        effect(() => {
            console.log(`Car Id change: ${this.addPartForm.carId().value()}`)
        })
        effect(() => {
            if (this.$mode() != UpdateEnum.New && this.$itemId()) {
                untracked(() => {
                    this.loadPart()
                })
            }
        })

        const $nextId = toSignal(this.nextIdService.getNextId(this.bus() ? ItemType.BusPart : ItemType.CarPart), { initialValue: { nextId: 0, error: '' } })
        if ($nextId().error?.length) {
            untracked(() => {
                this.$error.set($nextId().error!)
            })
        }

        effect(() => {
            const mode = this.$mode()
            if (mode == UpdateEnum.New) {
                untracked(() => {
                    this.addPartFormModel.update((value) => ({ ...value, regionId: this.regionId() }))
                })
            }
        })

        effect(() => {
            if (this.$error()) {
                this.popupService.openWithTimeout('Съобщение', this.$error(), 2000).subscribe(() => {
                    this.goBack()
                })
            }
        })
        // effect(() => {
        //     this.carService.fetchCarNameId(this.bus()).subscribe((res) =>
        //         this.cars.set(
        //             res.map((car) => {
        //                 return {
        //                     value: car.carId,
        //                     text: car.regNumber,
        //                 }
        //             })
        //         )
        //     )
        // })

        effect(() => {
            const seller = this.$seller()
            untracked(() => {
                if (seller) {
                    this.onCarChange(this.addPartFormModel().carId)
                    this.onPartForCar(this.addPartFormModel().partForCar)
                } else {
                    this.addPartForm.partForCar().value.set('car')
                    this.addPartForm.carId().value.set(0)
                    this.onPartForCar('part')
                }
            })
        })
        effect(() => {
            if (this.displayPartView()) {
                this.images = this.displayPartView()!.images ?? []
                this.loadPart()
            }
        })

        effect(() => {
            console.log(`Errors : ${this.addPartForm().errors()}`)
        })

        // effect(() => {
        //     this.calculateBHP(this.addPartForm.powerkWh().value())
        // })

        // effect(() => {
        //     this.calculatekWh(this.addPartForm.powerBHP().value())
        // })
        //#endregion
    }
    ngOnInit(): void {
        this.populateData()
        this.updateNumberParts()
    }

    ngOnDestroy(): void {
        return
    }

    resetScreen() {
        this.addPartFormModel.update((value) => ({ ...value, ...this.initialState, regionId: this.regionId() }))
    }

    //#endregion

    //#region  initialisation
    ngAfterViewInit(): void {
        goTop()
    }

    //#endregion

    //#region get/set function
    //#endregion
    defaultImageChanged(imageId: number) {
        this.mainImageId = imageId
        this.addPartForm.mainImageId().value.set(imageId)
    }

    //#region single user
    updateNumberParts() {
        if (!this.$seller()) {
            this.userService.numberOfPartsPerUser().subscribe((numberOfParts) => {
                this.numberOfPartsPerUser = numberOfParts.car + numberOfParts.bus
            })
        }
    }

    get allowanceNotReached(): boolean {
        if (this.$seller()) return true

        if (this.numberOfPartsPerUser < this.staticSelectionService.maxNumberParts) return true

        return false
    }

    showError() {
        this.confirmService.OK('Грешка', 'Моля попълнете задължителните полета')
    }
    open() {
        this.popupService.openWithTimeout('Съобщение', 'Частта е добавена')
    }

    //#endregion

    //#region events
    onPartForCar(f: 'car' | 'part') {
        console.log(f)
        // if (f == 'car') this.addPartFormModel.update((value) => ({ ...value, carId: this.partCarId()! }))
        // else this.addPartFormModel.update((value) => ({ ...value, carId: 0 }))
    }

    calculateBHP(value: number) {
        const newValue = Math.ceil(Number(value) * this.labels.KWH_TO_BHP)
        if (newValue != this.addPartFormModel().powerBHP) this.addPartFormModel.set({ ...this.addPartFormModel(), powerBHP: newValue })
    }

    calculatekWh(value: number) {
        const newValue = Math.floor(Number(value) / this.labels.KWH_TO_BHP)
        if (newValue != this.addPartFormModel().powerkWh) this.addPartFormModel.set({ ...this.addPartFormModel(), powerkWh: newValue })
    }

    powerkWhChanged() {
        this.calculateBHP(+this.addPartFormModel().powerkWh)
    }

    powerBHPChanged() {
        this.calculatekWh(+this.addPartFormModel().powerBHP)
    }

    // Events
    onCarChange(f: number | undefined) {
        if (f) {
            this.carService.fetchCar(f).subscribe((res) => {
                this.updateCar(res)
            })
        }
    }

    updateCar(car: CarView) {
        this.car = car
        this.addPartFormModel.update((value) => ({ ...value, carId: this.car?.carId ?? 0 }))
        if (this.car?.engineType) this.engineTypeName = this.staticSelectionService.EngineType.find((x) => x.value === this.car?.engineType)?.text
        else this.engineTypeName = ''
        this.description = `${this.car.companyName} ${this.car.modelName} `
        if (!this.bus()) this.description = `${this.description} ${this.car.modificationName}`
        this.description = `${this.description} ${this.engineTypeName} ${this.car.engineModel} ${this.car.year}`
    }

    dealerSubCategoryIdChanged(dealerSubCategory: DealerSubCategory) {
        if (!dealerSubCategory) return
        this.dealerSubCategoryId = dealerSubCategory.dealerSubCategoryId
        const dealerSubCategoryName = dealerSubCategory?.dealerSubCategoryName

        this.addPartForm.dealerSubCategoryName().value.set(dealerSubCategoryName ?? '')
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    focus(event: any) {
        // const nextControl: any = event.srcElement.nextElementSibling
        // if (nextControl) nextControl.focus()
    }

    //#endregion
    //#region populate dialog
    populateData() {
        this.setYears()
    }

    setYears() {
        const result: SelectOption[] = []
        for (let i = this.yearFrom; i <= this.yearTo; i++) {
            result.push({ value: i, text: i.toString() })
        }
        this.years = result
    }

    modificatioChanged(modification: Modification) {
        this.yearFrom = modification.yearFrom ?? this.labels.YEAR_START
        this.yearTo = modification.yearTo ?? 2025
        this.setYears()
        this.addPartForm.year().value.set(this.yearFrom)
    }

    //#endregion

    loadPart() {
        this.partService.fetch(this.$itemId()!).subscribe({
            next: (res) => {
                this.addPartFormModel.update((value) => ({ ...value, carId: res.carId ?? 0 }))
                this.partView = { ...res }
                this.dealerSubCategoryName = this.partView.dealerSubCategoryName
                this.images = []
                this.mainImageId = this.partView.mainImageId
                this.loading = false
                this.dealerSubCategoryId = this.partView.dealerSubCategoryId
                this.addPartFormModel.update((value) => ({
                    ...value,
                    ...res,
                    millage: String(res.millage ?? ''),
                    powerkWh: String(res.powerkWh ?? ''),
                    powerBHP: String(res.powerBHP ?? ''),
                }))
                // this.imageService.getImages(this.$partId()!).subscribe((res) => (this.images = res))
                this.initialState = { ...this.addPartForm().value() }
            },
            error: (error) => {
                console.log(error)
            },
            complete: () => {
                return
            },
        })
    }

    changeMessage() {
        this.confirmService.OKCancel(CONSTANT.MESSAGE, 'Потвърдете, че искате да отмeните промените').subscribe((reuslt) => {
            if (reuslt === OKCancelOption.OK) {
                this.goBack()
            }
        })
    }

    cancel() {
        if (this.addPartForm().touched()) {
            this.changeMessage()
        } else {
            this.noChange.emit(this.$itemId()!)
            this.goBack()
        }
    }
    goBack() {
        history.back()
    }

    onSubmit() {
        this.$submitted.set(true)
        if (this.addPartForm().invalid()) {
            console.log(this.addPartForm().errors())
            console.log(this.addPartForm().errorSummary())
            this.showError()
            return
        }
        const part: Part = { ...this.addPartForm().value(), powerkWh: +this.addPartFormModel().powerkWh, powerBHP: +this.addPartFormModel().powerBHP, millage: +this.addPartFormModel().millage }
        part.partId = this.$itemId()
        part.bus = this.bus()
        this.saving.set(true)

        this.partService.addUpdatePart(part, this.$mode() === UpdateEnum.Update).subscribe({
            next: (part) => {
                if (part.carId) this.carService.currentCarId = part.carId
                this.partService.currentId.next(part.id!)
                this.carService.currentCarId = part.carId
                this.saving.set(false)
                if (this.$mode() === UpdateEnum.Update) {
                    this.message = 'Частта е записана'
                    this.homeService.updateItem(part.id!, part)
                } else this.message = 'Частта е добавена'
                this.userCountService.fetchUserCount()
                const snackBarRef = this.toastService.showToast(this.message!, 1)

                snackBarRef.afterDismissed().subscribe(() => {
                    if (this.$mode() === UpdateEnum.New) {
                        this.images = []
                        this.$submitted.set(false)
                        const partForCar = this.addPartForm.partForCar().value()
                        this.images = []
                        this.addPartForm().reset()
                        this.addPartFormModel.update((value) => ({ ...value, ...this.formInitialValues }))
                        //if (part.carId) this.addPartForm.newcarId().value.set(part.carId)
                        if (partForCar === 'car') this.addPartForm.partForCar().value.set('car')
                        else this.addPartForm.partForCar().value.set('part')
                        this.numberOfPartsPerUser++
                        this.saved.emit(part.id!)
                        this.goBack()
                        this.resetScreen()
                    } else {
                        this.saved.emit(part.id!)
                        this.goBack()
                    }
                })
            },
            error: (error) => {
                this.saving.set(false)
                this.popupService.openWithTimeout(CONSTANT.MESSAGE, 'Частта не може да бъде записана!', 2000).subscribe(() => {
                    this.loggerService.logError(error)
                })

                this.saving.set(false)
            },
            complete: () => {
                this.saving.set(false)
            },
        })
    }

    //#endregion
}
