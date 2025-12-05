//#region import
import { AfterViewInit, Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { ActivatedRoute, NavigationStart, ParamMap, Router } from '@angular/router'
import { PopUpServiceService } from '@app/dialog/services/popUpService.service'
import { HelperComponent } from '@components/custom-controls/helper/helper.component'
import { CarView } from '@model/car/carView'
import { UpdateEnum } from '@model/enum/update.enum'
import { FilterCar } from '@model/filters/filterCar'
import { PartView } from '@model/part/partView'
import { SelectOption } from '@model/selectOption'
import { CarService } from '@services/car.service'
import { CategoryService } from '@services/category-subcategory/category.service'
import { DealerSubCategoryService } from '@services/category-subcategory/dealerSubCategory.service'
import { SubCategoryService } from '@services/category-subcategory/subCategory.service'
import { ModelService } from '@services/company-model-modification/model.service'
import { ModificationService } from '@services/company-model-modification/modification.service'
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
//#endregion
//#region component
@Component({
    standalone: true,
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
    NgClass
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
    // @HostListener('keydown.esc', ['$event'])
    // handleKeyDown(event: KeyboardEvent) {
    //     if (event.key === "Escape") {
    //         this.goBack();
    //       }    }
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
    //#endregion
    //#region input/output
    @Input() viewPartId?: number
    @Input() carId?: number
    @Input() partId?: number
    @Input() mode: UpdateEnum = UpdateEnum.New
    @Input() bus = 0
    @Input() set displayPartView(value: DisplayPartView) {
        this._displayPartView = value
        if (this._displayPartView) {
            this.images = value.images ?? []
            this.partId = this._displayPartView.id
            this.loadPart()
        }
    }
    @Input() add = false
    @Output() saved: EventEmitter<number> = new EventEmitter<number>()
    @Output() noChange: EventEmitter<number> = new EventEmitter<number>()
    description = ''
    //#endregion
    //#region
    constructor(
        formBuilder: FormBuilder,
        public modelService: ModelService,
        public carService: CarService,
        public categoryService: CategoryService,
        public subCategoryService: SubCategoryService,
        public partService: PartServiceService,
        public staticSelectionService: StaticSelectionService,
        private activatedRoute: ActivatedRoute,
        router: Router,
        private homeService: HomeService,
        private confirmService: ConfirmServiceService,
        private modificationService: ModificationService,
        private userService: UserService,
        private nextIdService: NextIdService,
        private dealerSubCategoryService: DealerSubCategoryService,
        private imageService: ImageService,
        private route: ActivatedRoute,
        private loggerService: LoggerService,
        public popupService: PopUpServiceService,
        private userCountService: UserCountService
        //#endregion
    ) {
        super()
        //#region fromgroup
        this.addPartForm = formBuilder.group({
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
        this.dealerSubCategories.push({ id: 0, description: 'Избери Подкатегория Дилър', count: 0, countCars: 0, countParts: 0, groupModelId: 0 })

        this.formInitialValues = this.initialState = this.addPartForm.value
        router.events.subscribe((event) => {
            if (event instanceof NavigationStart) {
                this.browserRefresh = !router.navigated
            }
        })

        this.addPartForm.patchValue({ regionId: this.regionId })
    }
    ngOnInit(): void {
        this.route.queryParamMap.subscribe((params: ParamMap) => {
            const carId = params.get('carId')
            if (carId) this.carId = +carId
            else this.carId = undefined

            this.addPartForm.patchValue({ carId: this.carId })
            this.bus = +(params.get('bus') ?? 0)
            this.populateData()
            this.addPartForm.controls['partId'].setValue(this.partId)

            this.bus = this.bus ?? 0
            this.setBus(this.bus)
            const id = this.activatedRoute.snapshot.queryParamMap.get('id')
            const partid = this.activatedRoute.snapshot.queryParamMap.get('partId')
            if (id) {
                this.partId = +id
            } else if (partid) {
                this.partId = +partid
            }

            const ad = this.activatedRoute.snapshot.queryParamMap.get('ad')
            if (ad) {
                this.add = true
                this.mode = UpdateEnum.New
            }

            this.partId = this.partId ?? this.viewPartId
            if (this.mode === UpdateEnum.View) this.updateFlag = false
            else this.updateFlag = true

            if (this.add) {
                this.addPartForm.patchValue({ regionId: this.regionId })
                if (!this.partId) {
                    this.nextIdService
                        .getNextId()
                        .pipe()
                        .subscribe({
                            next: (id) => {
                                this.partId = id
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
        return this.mode === UpdateEnum.New
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
            this.carId = undefined
        }

        this.addPartForm.controls['carId'].updateValueAndValidity()
        this.addPartForm.controls['companyId'].updateValueAndValidity()
        this.addPartForm.controls['modelId'].updateValueAndValidity()
        this.addPartForm.controls['modificationId'].updateValueAndValidity()
        this.setBus(this.bus)
        this.addPartForm.patchValue({ carId: this.carId })
    }

    get action() {
        if (this.mode == UpdateEnum.Update) {
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
    onCarChange(f: number) {
        if (f) {
            this.carService.fetchCar(f).subscribe((res) => {
                this.updateCar(res)
            })
        }
    }

    updateCar(car: CarView) {
        this.car = car
        this.carId = this.car?.carId
        if (this.car?.engineType) this.engineTypeName = this.staticSelectionService.EngineType.find((x) => x.value === this.car?.engineType)?.text
        else this.engineTypeName = ''
        this.description = `${this.car.companyName} ${this.car.modelName} `
        this.bus = car.bus!;
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
        this.bus = bus
        this.choice = this.bus ? 'бус' : 'кола'
        if (this.bus) {
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
        this.carService.fetchCarNameId(this.bus).subscribe(
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
        this.partService.fetch(this.partId!).subscribe({
            next: (res) => {
                this.carId = this.carService.currentCarId = res.carId
                this.addPartForm.patchValue({ carId: this.carId ?? 0 })
                this.partView = res
                this.dealerSubCategoryName = this.partView.dealerSubCategoryName
                this.images = []
                this.mainImageId = this.partView.mainImageId
                this.mode = UpdateEnum.Update
                this.loading = false
                this.addPartForm.patchValue(this.partView)
                this.imageService.getImages(this.partId!).subscribe((res) => (this.images = res))
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

    get changed() {
        return JSON.stringify(this.initialState) !== JSON.stringify(this.addPartForm.value)
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
            this.noChange.emit(this.partId)
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

        this.partService.addUpdatePart(part, this.mode === UpdateEnum.Update).subscribe({
            next: (part) => {
                if (part.carId) this.carService.currentCarId = part.carId
                this.partService.currentId.next(part.id!)
                this.carService.currentCarId = part.carId
                this.saving = false
                if (this.mode === UpdateEnum.Update) {
                    this.message = 'Частта е записана'
                    this.homeService.updateItem(part.id!, part)
                } else this.message = 'Частта е добавена'
                this.userCountService.fetchUserCount()
                this.popupService.openWithTimeout(CONSTANT.MESSAGE, this.message!, 2000).subscribe(() => {
                    if (this.mode === UpdateEnum.New) {
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
                        this.saved.emit(part.id)
                        this.goBack()
                        this.resetScreen()
                    } else {
                        this.saved.emit(part.id)
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
