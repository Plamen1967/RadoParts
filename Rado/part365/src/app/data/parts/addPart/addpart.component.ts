//#region import
import { AfterViewInit, Component, computed, effect, HostListener, inject, input, OnDestroy, OnInit, output } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { ActivatedRoute, NavigationStart, ParamMap, Router } from '@angular/router'
import { PopUpService } from '@app/dialog/services/popUpService.service'
import { HelperComponent } from '@components/custom-controls/helper/helper.component'
import { CarView } from '@model/car/carView'
import { UpdateEnum } from '@model/enum/update.enum'
import { FilterCar } from '@model/filters/filterCar'
import { PartView } from '@model/part/partView'
import { SelectOption } from '@model/selectOption'
import { CarService } from '@services/car.service'
import { ImageService } from '@services/image.service'
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
import { TooltipDirective } from '@app/directive/tooltip.directive'
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
import { NgClass } from '@angular/common'
import { ToastService } from '@services/dialog-api/ToastService/toast.service'
import { ItemType } from '@model/enum/itemType.enum'
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
        TooltipDirective,
        CompanyChoiseComponent,
        ModelChoiceComponent,
        ModificationChoiceComponent,
        CategoryChoiseComponent,
        DealersubcategoryChoiceComponent,
        ToolBarComponent,
        NgClass,
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
    addPartForm: FormGroup
    cars?: SelectOption[]
    car?: CarView
    filterCar: FilterCar = new FilterCar()
    partView?: PartView
    modelId = 0
    yearFrom = this.labels.YEAR_START
    yearTo = 2021
    years?: SelectOption[]
    browserRefresh = false
    partForCar = true
    engineTypeName?: string
    initialState
    dealerSubCategoryId?: number
    images: ImageData[] = []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formInitialValues?: any
    ngbModuleRef?: object
    closeResult?: string
    saving = false
    submitted = false
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

    companyId?: number
    carIdSdiabled = false
    mainImageId?: number = 0
    updateFlag = false
    categoryId?: number
    choice?: string
    _displayPartView?: DisplayPartView
    carId_? : number;
    partId_?: number;
    bus_ = 0;
    mode_: UpdateEnum = UpdateEnum.New
    add_ = false;
    //#endregion
    //#region input/output
    viewPartId = input<number | undefined>()
    carId = input<number | undefined>()
    partId = input<number | undefined>()
    mode = input<UpdateEnum>(UpdateEnum.New)
    bus = input<number>(0)
    add = input<boolean>(false)

    displayPartView = input<DisplayPartView | undefined>()
    saved = output<number>()
    noChange = output<number>()
    description = ''
    //#endregion
    //#region
    private formBuilder: FormBuilder = inject(FormBuilder)
    private carService: CarService = inject(CarService)
    private partService: PartServiceService = inject(PartServiceService)
    public staticSelectionService: StaticSelectionService = inject(StaticSelectionService)
    private activatedRoute: ActivatedRoute = inject(ActivatedRoute)
    private router: Router= inject(Router)
    private homeService: HomeService = inject(HomeService)
    private confirmService: ConfirmServiceService = inject(ConfirmServiceService)
    private userService: UserService = inject(UserService)
    private nextIdService: NextIdService = inject(NextIdService)
    private imageService: ImageService = inject(ImageService)
    private route: ActivatedRoute = inject(ActivatedRoute)
    private loggerService: LoggerService = inject(LoggerService)
    public popupService: PopUpService = inject(PopUpService)
    private userCountService: UserCountService = inject(UserCountService)
    private toastService: ToastService = inject(ToastService)

    constructor() { //#endregion
        super()
        //#region fromgroup
        this.addPartForm = this.formBuilder.group({
            partForCar: [true],
            carId: [undefined, [Validators.required, Validators.min(1)]],
            partId: [0],
            companyId: [0, [Validators.required]],
            modelId: [0, [Validators.required]],
            modificationId: [0, [Validators.required]],
            year: [2021],
            vin: ['', [Validators.minLength(17), Validators.maxLength(17)]],
            powerkWh: [],
            powerBHP: [],
            millage: [],
            engineType: [0],
            engineModel: [''],
            gearboxType: [0],
            regionId: [-1],
            categoryId: [undefined, [Validators.required, Validators.min(1)]],
            dealerSubCategoryId: [undefined, [Validators.required, Validators.min(1)]],
            description: [''],
            partNumber: [''],
            price: [0, [Validators.required, Validators.min(1)]],
            leftRightPosition: [0],
            frontBackPosition: [0],
            dealerSubCategoryName: ['', Validators.required],
            mainImageId: [0],
        })
        //#endregion
        this.formGroup = this.addPartForm
        this.dealerSubCategories.push({ id: 0, description: 'Избери Подкатегория Дилър', count: 0, countCars: 0, countParts: 0, groupModelId: 0 })

        this.formInitialValues = this.initialState = this.addPartForm.value
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationStart) {
                this.browserRefresh = !this.router.navigated
            }
        })

        this.addPartForm.patchValue({ regionId: this.regionId })
        effect(() => {
            if (this.displayPartView()) {
                this.images = this.displayPartView()!.images ?? []
                this.partId_ = this.displayPartView()!.id
                this.loadPart()
            }

            this.carId_ = computed(() => this.carId())();
            this.bus_ = computed(() => this.bus())();
            this.add_ = computed(() => this.add())()
        })            
    }
    ngOnInit(): void {
        this.route.queryParamMap.subscribe((params: ParamMap) => {
            const carId = params.get('carId')
            if (carId) this.carId_ = +carId
            else this.carId_ = undefined

            this.addPartForm.patchValue({ carId: this.carId })
            this.bus_ = +(params.get('bus') ?? 0)
            this.populateData()
            this.addPartForm.controls['partId'].setValue(this.partId)

            this.bus = this.bus ?? 0
            this.setBus(this.bus_)
            const id = this.activatedRoute.snapshot.queryParamMap.get('id')
            const partid = this.activatedRoute.snapshot.queryParamMap.get('partId')
            if (id) {
                this.partId_ = +id
            } else if (partid) {
                this.partId_ = +partid
            }

            const ad = this.activatedRoute.snapshot.queryParamMap.get('ad')
            if (ad) {
                this.add_ = true
                this.mode_ = UpdateEnum.New
            }

            this.partId = this.partId ?? this.viewPartId
            if (this.mode_ === UpdateEnum.View) this.updateFlag = false
            else this.updateFlag = true

            if (this.add_) {
                this.addPartForm.patchValue({ regionId: this.regionId })
                if (!this.partId) {
                    this.nextIdService
                        .getNextId(this.bus_ ? ItemType.BusPart : ItemType.CarPart)
                        .pipe()
                        .subscribe({
                            next: (nextId) => {
                                if (nextId.error) {
                                    this.popupService.openWithTimeout('Съобщение', nextId.error, 2000).subscribe(() => {
                                        this.goBack()
                                    })
                                } else {
                                    this.partId_ = nextId.nextId
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
            } else {
                this.loadPart()
            }
        })

        this.addPartForm.controls['companyId'].valueChanges.subscribe((f) => {
            this.companyId = f
        })
        this.addPartForm.controls['modelId'].valueChanges.subscribe((f) => (this.modelId = f))
        this.addPartForm.controls['categoryId'].valueChanges.subscribe((f) => (this.categoryId = f))

        if (!this.seller) {
            this.addPartForm.controls['partForCar'].setValue(false)
            this.addPartForm.controls['carId'].setValue(undefined)
            this.onPartForCar(false)
        } else {
            this.addPartForm.controls['carId'].valueChanges.subscribe((f) => this.onCarChange(f))
            this.addPartForm.controls['partForCar'].valueChanges.subscribe((f) => this.onPartForCar(f))
            this.onPartForCar(true)
        }
        this.updateNumberParts()
    }

    ngOnDestroy(): void {
        return
    }

    resetScreen() {
        this.addPartForm.patchValue(this.initialState)
        this.addPartForm.patchValue({ regionId: this.regionId })
    }

    get newPart(): boolean {
        return this.mode_ === UpdateEnum.New
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
        this.addPartForm.patchValue({ mainImageId: imageId })
    }

    //#region single user
    updateNumberParts() {
        if (!this.seller) {
            this.userService.numberOfPartsPerUser().subscribe((numberOfParts) => {
                this.numberOfPartsPerUser = numberOfParts.car + numberOfParts.bus
            })
        }
    }

    get allowanceNotReached(): boolean {
        if (this.seller) return true

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
    onPartForCar(f: boolean) {
        this.partForCar = f
        if (f) {
            this.addPartForm.controls['carId'].setValidators([Validators.required])
            this.addPartForm.controls['companyId'].clearValidators()
            this.addPartForm.controls['modelId'].clearValidators()
            this.addPartForm.controls['modificationId'].clearValidators()
        } else {
            this.addPartForm.controls['carId'].setValue(undefined)
            this.addPartForm.controls['carId'].clearValidators()
            this.addPartForm.controls['companyId'].setValue(undefined)
            this.addPartForm.controls['modelId'].setValue(undefined)
            this.addPartForm.controls['modificationId'].setValue(undefined)
            this.addPartForm.controls['companyId'].setValidators([Validators.required])
            this.addPartForm.controls['modelId'].setValidators([Validators.required])
            this.addPartForm.controls['modificationId'].setValidators([Validators.required])
            this.car = undefined
            this.carId_ = undefined
        }

        this.addPartForm.controls['carId'].updateValueAndValidity()
        this.addPartForm.controls['companyId'].updateValueAndValidity()
        this.addPartForm.controls['modelId'].updateValueAndValidity()
        this.addPartForm.controls['modificationId'].updateValueAndValidity()
        this.setBus(this.bus_)
        this.addPartForm.patchValue({ carId: this.carId })
    }

    get action() {
        if (this.mode_ == UpdateEnum.Update) {
            return this.labels.UPDATE
        } else {
            return this.labels.SAVE
        }
    }

    powerkWhChanged() {
        this.calculateBHP(this.addPartForm.controls['powerkWh'].value)
    }

    powerBHPChanged() {
        this.calculatekWh(this.addPartForm.controls['powerBHP'].value)
    }

    calculateBHP(value: string) {
        const newValue = Math.ceil(Number(value) * this.labels.KWH_TO_BHP)
        if (newValue != this.addPartForm.controls['powerBHP'].value) this.addPartForm.controls['powerBHP'].setValue(newValue)
    }

    calculatekWh(value: string) {
        const newValue = Math.floor(Number(value) / this.labels.KWH_TO_BHP)
        if (newValue != this.addPartForm.controls['powerkWh'].value) this.addPartForm.controls['powerkWh'].setValue(newValue)
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
        this.carId_ = this.car?.carId
        if (this.car?.engineType) this.engineTypeName = this.staticSelectionService.EngineType.find((x) => x.value === this.car?.engineType)?.text
        else this.engineTypeName = ''
        this.description = `${this.car.companyName} ${this.car.modelName} `
        this.bus_ = car.bus!
        if (!this.bus) this.description = `${this.description} ${this.car.modificationName}`
        this.description = `${this.description} ${this.engineTypeName} ${this.car.engineModel} ${this.car.year}`
    }

    dealerSubCategoryIdChanged(dealerSubCategory: DealerSubCategory) {
        this.dealerSubCategoryId = dealerSubCategory.dealerSubCategoryId
        const dealerSubCategoryName = dealerSubCategory?.dealerSubCategoryName

        this.addPartForm.patchValue({ dealerSubCategoryName: dealerSubCategoryName })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    focus(event: any) {
        // const nextControl: any = event.srcElement.nextElementSibling
        // if (nextControl) nextControl.focus()
    }

    setBus(bus: number) {
        this.bus_ = bus
        this.choice = this.bus_ ? 'бус' : 'кола'
        if (this.bus_) {
            this.addPartForm.controls['modificationId'].clearValidators()
            this.addPartForm.patchValue({ modificationId: undefined })
        } else {
            this.addPartForm.controls['modificationId'].setValidators([Validators.required])
            this.addPartForm.controls['modificationId'].updateValueAndValidity()
        }
    }

    //#endregion
    //#region populate dialog
    populateData() {
        this.setYears()
        this.populateCars()
    }

    setYears() {
        const result: SelectOption[] = []
        for (let i = this.yearFrom; i <= this.yearTo; i++) {
            result.push({ value: i, text: i.toString() })
        }
        this.years = result
    }

    populateCars() {
        this.carService.fetchCarNameId(this.bus_).subscribe(
            (res) =>
                (this.cars = res.map((car) => {
                    return {
                        value: car.carId,
                        text: car.regNumber,
                    }
                }))
        )
    }

    modificatioChanged(modification: Modification) {
        this.yearFrom = modification.yearFrom ?? this.labels.YEAR_START
        this.yearTo = modification.yearTo ?? 2025
        this.setYears()
        this.addPartForm.patchValue({ year: this.yearFrom })
    }

    //#endregion

    loadPart() {
        this.partService.fetch(this.partId_!).subscribe({
            next: (res) => {
                this.carId_ = this.carService.currentCarId = res.carId
                this.addPartForm.patchValue({ carId: this.carId ?? 0 })
                this.partView = { ...res }
                this.dealerSubCategoryName = this.partView.dealerSubCategoryName
                this.images = []
                this.mainImageId = this.partView.mainImageId
                this.mode_ = UpdateEnum.Update
                this.loading = false
                this.dealerSubCategoryId = this.partView.dealerSubCategoryId
                this.addPartForm.patchValue(this.partView)
                this.imageService.getImages(this.partId_!).subscribe((res) => (this.images = res))
                this.initialState = { ...this.addPartForm.value }
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
        if (this.changed) {
            this.changeMessage()
        } else {
            this.noChange.emit(this.partId_!)
            this.goBack()
        }
    }
    goBack() {
        history.back()
    }

    onSubmit() {
        this.submitted = true
        if (!this.addPartForm.valid) {
            this.showError()
            return
        }
        const part = Object.assign({}, this.addPartForm.value)
        part.partId = this.partId
        this.saving = true
        part.bus = this.bus

        this.partService.addUpdatePart(part, this.mode() === UpdateEnum.Update).subscribe({
            next: (part) => {
                if (part.carId) this.carService.currentCarId = part.carId
                this.partService.currentId.next(part.id!)
                this.carService.currentCarId = part.carId
                this.saving = false
                if (this.mode() === UpdateEnum.Update) {
                    this.message = 'Частта е записана'
                    this.homeService.updateItem(part.id!, part)
                } else this.message = 'Частта е добавена'
                this.userCountService.fetchUserCount()
                const snackBarRef = this.toastService.showToast(this.message!, 1)

                snackBarRef.afterDismissed().subscribe(() => {
                    if (this.mode() === UpdateEnum.New) {
                        this.images = []
                        this.submitted = false
                        const partForCar = this.addPartForm.controls['partForCar'].value
                        this.images = []
                        this.addPartForm.reset()
                        this.addPartForm.patchValue(this.formInitialValues)
                        if (part.carId) this.addPartForm.controls['carId'].setValue(part.carId)
                        this.initialState.carId = part.carId
                        this.initialState.regionId = this.regionId
                        if (partForCar === false) this.addPartForm.patchValue({ partForCar: false })
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
                this.saving = false
                this.popupService.openWithTimeout(CONSTANT.MESSAGE, 'Частта не може да бъде записана!', 2000).subscribe(() => {
                    this.loggerService.logError(error)
                })

                this.saving = false
            },
            complete: () => {
                this.saving = false
            },
        })
    }

    //#endregion
}
