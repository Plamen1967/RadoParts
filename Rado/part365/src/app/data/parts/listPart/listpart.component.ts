//#region import
import { AsyncPipe, NgStyle, ViewportScroller } from '@angular/common'
import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { goToPosition, sortPartView } from '@app/functions/functions'
import { HelperComponent } from '@components/custom-controls/helper/helper.component'
import { NavigatorComponent } from '@components/result/navigator/navigator.component'
import { AuthenticatedUser } from '@model/authenticatedUser'
import { CarView } from '@model/car/carView'
import { CarItem } from '@model/carItem'
import { Company } from '@model/company-model-modification/company'
import { DealerActionType } from '@model/dealerActionType'
import { UpdateEnum } from '@model/enum/update.enum'
import { Filter } from '@model/filters/filter'
import { PartView } from '@model/part/partView'
import { SelectOption } from '@model/selectOption'
import { AuthenticationService } from '@services/authentication/authentication.service'
import { CarService } from '@services/car.service'
import { CategoryService } from '@services/category-subcategory/category.service'
import { SubCategoryService } from '@services/category-subcategory/subCategory.service'
import { ModelService } from '@services/company-model-modification/model.service'
import { ModificationService } from '@services/company-model-modification/modification.service'
import { NextIdService } from '@services/nextId.service'
import { PartServiceService } from '@services/part/partService.service'
import { SearchPartService } from '@services/searchPart.service'
import { StaticSelectionService } from '@services/staticSelection.service'
import { UserService } from '@services/user.service'
import { debounceTime, distinctUntilChanged, Observable, Subject, switchMap, takeUntil } from 'rxjs'
import { SelectComponent } from '@components/custom-controls/select-controls/select/select.component'
import { InputComponent } from '@components/custom-controls/input/input.component'
import { ConfirmServiceService } from '@app/dialog/services/confirmService.service'
import { PopUpServiceService } from '@app/dialog/services/popUpService.service'
import { ActivatedRoute, ParamMap, Router } from '@angular/router'
import { DealerViewComponent } from '@app/data/dealerView/dealerview.component'
import { Numberparts } from '@model/numberparts'
import { ModelChoiceComponent } from '@app/component-main/model-choice/model-choice.component'
import { CompanyChoiseComponent } from '@app/component-main/company-choise/company-choise.component'
import { ModificationChoiceComponent } from '@app/component-main/modification-choice/modification-choice.component'
import { ItemType } from '@model/enum/itemType.enum'
import AddPartComponent from '../addPart/addpart.component'
import { Modification } from '@model/static-data/modification'
import { GoTopComponent } from '../../../components/custom-controls/goTop/goTop.component'
import { TooltipDirective } from '@app/directive/tooltip.directive'
import { OptionItem } from '@model/optionitem'
import { SubcategoryChoiseComponent } from '../../../category-main/subcategory-choise/subcategory-choise.component'
import { CategoryChoiseComponent } from '@app/category-main/category-choise/category-choise.component'
import { ListTitleComponent } from '@components/custom-controls/listtitle/listtitle.component'
import { UserCountService } from '@services/userCount.service'
import { LoggerService } from '@services/authentication/logger.service'
import { UserCount } from '@model/userCount'

@Component({
    standalone: true,
    selector: 'app-listpart',
    templateUrl: './listpart.component.html',
    styleUrls: ['./listpart.component.scss'],
    imports: [
        NavigatorComponent,
        DealerViewComponent,
        DealerViewComponent,
        SelectComponent,
        InputComponent,
        NgStyle,
        ReactiveFormsModule,
        CompanyChoiseComponent,
        ModelChoiceComponent,
        ModificationChoiceComponent,
        AddPartComponent,
        GoTopComponent,
        CategoryChoiseComponent,
        TooltipDirective,
        SubcategoryChoiseComponent,
        ListTitleComponent,
        AsyncPipe
    ],
})

//#endregion
export default class ListPartComponent extends HelperComponent implements OnInit, OnDestroy, AfterViewInit {
    submitElement?: ElementRef<HTMLInputElement>
    sortType = 0
    companies: SelectOption[] = []
    models: SelectOption[] = [{ value: 0, text: 'Всички модели' }]
    modifications: SelectOption[] = [{ value: 0, text: 'Всички модификации' }]
    categories: OptionItem[] = []
    subCategories: OptionItem[] = []
    currentId?: number = undefined
    allParts?: PartView[]
    parts?: PartView[]
    currentPage = 0
    searched = false
    deletedPartId?: number
    numberPages?: number
    loading = false
    selectedCompany?: Company
    searchForm: FormGroup
    yearFrom = this.labels.YEAR_START
    yearTo = 2021
    years?: SelectOption[]
    mode: UpdateEnum = UpdateEnum.View
    currentPartId?: number
    ngbModuleRef?: object
    numberOfPartsPerUser = 0
    carsList: SelectOption[] = []
    user?: AuthenticatedUser
    maxNumberParts?: number
    allowanceMessage = ''
    companyId = 0
    modelId = 0
    modificationId = 0
    bus = 0
    numberOfParts?: Numberparts
    itemType = ItemType.CarPart
    userId?: number
    addPartFlag = false
    categoriesId!: string
    @Input() id?: number
    public todos$?: Observable<CarView[]>
    public todosPart$?: Observable<PartView[]>
    private readonly _autoSearch$: Subject<Filter>
    private readonly _autoPartSearch$: Subject<Filter>
    private readonly _debounce: number
    private readonly _debounceParts: number
    private readonly _destroy$: Subject<boolean>
    userCount$: Observable<UserCount | undefined>;
    

    //#region members

    //#endregion

    //#region c'tor
    constructor(
        public modelService: ModelService,
        public categoryService: CategoryService,
        public subCategoryService: SubCategoryService,
        public searchPartService: SearchPartService,
        private authernticationService: AuthenticationService,
        formBuilder: FormBuilder,
        private partService: PartServiceService,
        public staticSelectionService: StaticSelectionService,
        private userService: UserService,
        private modificationService: ModificationService,
        private nextIdService: NextIdService,
        private scroller: ViewportScroller,
        private confirmService: ConfirmServiceService,
        private popupMessage: PopUpServiceService,
        private router: Router,
        private route: ActivatedRoute,
        private carService: CarService,
        private userCountService: UserCountService,
        private loggerService: LoggerService
    ) {
        super()

        this._autoSearch$ = new Subject<Filter>()
        this._autoPartSearch$ = new Subject<Filter>()
        this._debounce = 0
        this._debounceParts = 1500
        this._destroy$ = new Subject<boolean>()
        this.userId = this.authenticationService.user?.userId
        this.userCount$ = this.userCountService.userCount$;
        this.searchForm = formBuilder.group({
            bus: [0],
            companyId: [0],
            modelId: [0],
            modificationId: [0],
            year: [0],
            categoryId: [0],
            subCategoryId: [0],
            partNumber: [''],
            sortOrder: [0],
        })
    }
    ngAfterViewInit(): void {
        this.onSubmit()
    }

    ngOnDestroy(): void {
        this._destroy$.next(true)
    }
    //#endregion

    getValue(userCount: UserCount) {
        return userCount.partCarCount + userCount.partBusCount
    }
    //#region Init
    ngOnInit() {
        this.maxNumberParts = this.staticSelectionService.maxNumberParts
        this.user = this.authernticationService.currentUserValue
        this.setYears()
        this.route.queryParamMap.subscribe((params: ParamMap) => {
            const bus = params.get('bus') ?? undefined
            if (bus) {
                this.bus = +bus
            }
        })

        this.todos$ = this._autoSearch$.pipe(
            debounceTime(this._debounce),
            distinctUntilChanged(),
            switchMap((filter) => {
                this.searchForm.patchValue({ carId: 0 })
                filter.userId = this.userId
                return this.carService.fetchCars(filter)
            }),
            takeUntil(this._destroy$)
        )

        this.todos$.subscribe((res) => {
            const carItems: CarItem[] = []
            carItems.push({ carId: 0, reference: this.labels.ALL })
            res?.forEach((car) => carItems.push({ reference: car.regNumber, carId: car.carId }))
            this.carsList = carItems.map((car) => {
                return {
                    value: car.carId,
                    text: car.reference,
                }
            })
        })

        this.todosPart$ = this._autoPartSearch$.pipe(
            debounceTime(this._debounceParts),
            distinctUntilChanged(),
            switchMap((Filter) => {
                this.loading = true
                return this.partService.getPartViews(Filter)
            }),
            takeUntil(this._destroy$)
        )

        this.todosPart$?.subscribe((res) => {
            this.updateData(res)
            this.partService.currentId.subscribe((value) => (this.currentId = value))
            if (this.currentId) goToPosition(this.currentId)

            this.loading = false
        })

        this.searchForm.controls['bus'].valueChanges.subscribe((f) => this.onBusChange(f))
        this.searchForm.controls['companyId'].valueChanges.subscribe((f) => this.onCompanyChange(f))
        this.searchForm.controls['modelId'].valueChanges.subscribe((f) => this.onModelChange(f))
        this.searchForm.controls['categoryId'].valueChanges.subscribe((f) => this.onCategoryChange(f))
        this.searchForm.controls['sortOrder'].valueChanges.subscribe((value) => {
            console.log(value)
        })
        this.searchForm.valueChanges.subscribe((value) => this.onSubmit(value))

        this.updateNumberParts()
        this.route.queryParamMap.subscribe((params: ParamMap) => {
            this.addPartFlag = params.get('add') ? true : false
            if (this.addPartFlag) this.newPart()
        })
        // this.route.params.subscribe((params) => {
        //     if (params['add'] ) {
        //         this.newPart()
        //     }
        // })
    }

    //#endregion

    //#region submit

    submit(event: KeyboardEvent) {
        event.preventDefault()
        if (event.keyCode === 13) this.onSubmit()
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSubmit(value?: any) {
        const filter: Filter = value ?? Object.assign({}, this.searchForm.value)
        filter.partOnly = true
        this._autoPartSearch$.next(filter)
    }
    //#endregion  submit

    //#region on events
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
        this.searchForm.patchValue({ year: 0 })
    }

    compareCar(car: CarView) {
        if (car.companyId != this.searchForm.value.companyId) return false
        if (car.modelId != this.searchForm.value.modelId) return false
        if (car.modificationId != this.searchForm.value.modificationId) return false
        if (car.year != this.searchForm.value.year) return false

        return true
    }
    //#endregion

    //#region get functions
    get modeType(): UpdateEnum {
        return this.mode
    }

    clear() {
        this.searchForm.patchValue({
            companyId: 0,
            modelId: 0,
            modificationId: 0,
            year: 0,
            categoryId: 0,
            subCategoryId: 0,
            partNumber: '',
            sortOrder: 0,
        })
    }
    //#endregion

    //#region actions
    actionPart(action: DealerActionType) {
        this.mode = action.action!
        if (this.mode === UpdateEnum.New) {
            this.router.navigate(['/data/parts'], { queryParams: { id: action.id } })
        } else if (this.mode === UpdateEnum.Update) {
            this.router.navigate(['/data/parts'], { queryParams: { update: true, id: action.id } })
        } else if (this.mode === UpdateEnum.Delete) {
            this.removePart(action.id!)
        } else if (this.mode === UpdateEnum.View) {
            this.currentPartId = action.id
        }
    }

    viewPart(id: number) {
        this.router.navigate(['/data/parts'], { queryParams: { update: true, id: id } })
    }
    addPart() {
        if (!this.seller) {
            this.userService.numberOfPartsPerUser().subscribe((numberOfParts) => {
                this.numberOfParts = numberOfParts

                this.numberOfPartsPerUser = numberOfParts.bus + numberOfParts.car
                if (this.numberOfPartsPerUser < this.maxNumberParts!) {
                    this.router.navigate(['/data/parts'], { queryParams: { add: true } })
                } else {
                    this.confirmService.OK('Съобщение', this.allowanceMessage)
                }
            })
        } else {
            this.router.navigate(['/data/parts'], { queryParams: { add: true } })
        }
    }

    newPart() {
        this.nextIdService.getNextId().subscribe({
            next: (id) => {
                this.id = id
            },
        })
    }

    loadPart(id: number) {
        console.log(`Load part ${id}`)
        this.partService.fetch(id).subscribe((part) => {
            this.refreshPart(part)
        })
    }

    refreshPart(part: PartView) {
        if (part) {
            const index = this.parts?.findIndex((elem) => elem.partId === part.partId)
            if (!this.parts) return

            if (index != -1) {
                this.parts[index!] = Object.assign({}, part)
            } else {
                this.numberOfPartsPerUser++
                this.parts.unshift(part)
            }
            goToPosition(part.partId!.toString())
        } else {
            this.updateNumberParts()
        }
    }
    //#endregion

    getPageData(): PartView[] {
        return this.allParts?.slice((this.currentPage - 1) * 10, this.currentPage * 10) ?? []
    }

    updateNumberParts() {
        this.userService.numberOfPartsPerUser().subscribe((numberOfParts) => {
            this.numberOfParts = numberOfParts
        })
    }

    setYears() {
        const result: SelectOption[] = []
        for (let i = this.yearTo; i >= this.yearFrom; i--) {
            result.push({ value: i, text: i.toString() })
        }
        result.unshift({ value: 0, text: this.labels.ALL })
        this.years = result
    }

    getNumberPages(): number {
        return this.numberPages ?? 0
    }

    updateData(res: PartView[]) {
        this.searched = true
        this.loading = false
        this.allParts = res
        this.allParts.sort((a, b) => sortPartView(this.sortType, a, b))
        this.currentPage = 1
        this.parts = this.getPageData()
        this.numberPages = Math.ceil(res.length / 10)
    }

    //#region delete part
    removePart(partId: number) {
        this.partService.deletePart(partId).subscribe({
            next: (res) => {
                this.userCountService.refresh()
                this.popupMessage.openWithTimeout('Съобщение', 'Честта е успешно изтрита')
                const index = this.parts?.findIndex((elem) => elem.partId === partId)
                if (index != -1) {
                    this.numberOfPartsPerUser--
                    this.parts?.splice(index!, 1)
                }
                this.currentPartId = undefined
                // TODO
                console.log(res)
            },
            error: (error => {
                this.loggerService.logError(error)
            }),
            complete: () => {
                return
            },
        })
    }
    //#endregion

    click(event: number) {
        this.currentPage = event + 1
        this.parts = this.getPageData()
        goToPosition('top')
    }

    moveToPage(event: number) {
        this.currentPage = +event
        this.parts = this.getPageData()
        goToPosition('top')
    }

    focus() {
        this.submitElement?.nativeElement.focus()
    }

    onCategoryChange(categoryId: string) {
        this.categoriesId = categoryId.toString()
    }

    onBusChange(f: number) {
        this.bus = f
        this.router.navigate(['/data/parts'], { queryParams: { bus: this.bus } })

        if (this.bus) this.itemType = ItemType.BusPart
        else this.itemType = ItemType.CarPart
    }
    //#endregion

    saved(event: number) {
        this.id = undefined
        this.loadPart(event)
        this.currentId = event

        goToPosition(event)
    }

    back(id: number) {
        this.currentId = id
        this.partService.currentId.next(id)
        this.id = undefined
        
        goToPosition(id)
    }

    isHighLigted(id: number) {
        return this.currentId === id
    }
}
