//#region import

import { AfterViewInit, ChangeDetectorRef, Component, DestroyRef, ElementRef, EventEmitter, HostListener, Input, OnInit, Optional, Output, ViewChild } from '@angular/core'
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { debounceTime, distinctUntilChanged, Observable, of, Subject } from 'rxjs'
import { MatDialog } from '@angular/material/dialog'
import { CategoryService } from '@services/category-subcategory/category.service'
import { SubCategoryService } from '@services/category-subcategory/subCategory.service'
import { UserService } from '@services/user.service'
import { HomeService } from '@services/home.service'
import { ModelService } from '@services/company-model-modification/model.service'
import { LoadingService } from '@services/loading.service'
import { TopService } from '@services/top.service'
import { HelperComponent } from '@components/custom-controls/helper/helper.component'
import { Company } from '@model/company-model-modification/company'
import { Model } from '@model/company-model-modification/model'
import { Modification } from '@model/static-data/modification'
import { Category } from '@model/category-subcategory/category'
import { SubCategory } from '@model/category-subcategory/subCategory'
import { Dropdown } from '@model/dropDown'
import { FilterCategory } from '@model/filters/filterCategory'
import { Filter } from '@model/filters/filter'
import { User } from '@model/user'
import { NumberPartsPerCategory } from '@model/category-subcategory/numberPartsPerCategory'
import { ItemType } from '@model/enum/itemType.enum'
import { RadioButton } from '@model/radioButton'
import { SearchBy } from '@model/enum/searchBy.enum'
import { CategorySubcategory } from '@model/category-subcategory/categorySubCategory'
import { SelectOption } from '@model/selectOption'
import { goTop, isMobile, replaceFirst, sortUser } from '@app/functions/functions'
import { NgStyle } from '@angular/common'
import { SelectComponent } from '@components/custom-controls/select-controls/select/select.component'
import { RadioGroupListComponent } from '@components/custom-controls/radioGroupList/radiogrouplist.component'
import { InputComponent } from '@components/custom-controls/input/input.component'
import { TooltipDirective } from '@app/directive/tooltip.directive'
import { CompanyComponent } from '@components/custom-controls/select-controls/company/company.component'
import { OptionItem } from '@model/optionitem'
import { TypeItem } from '@model/enum/typeItem'
import { SortType } from '@model/enum/sortType.enum'
import { CategoriesFooterComponent } from '@components/custom-controls/categoriesFooter/categoriesfooter.component'
import { RadioGroupComponent } from '@components/custom-controls/radioGroup/radiogroup.component'
import { CategoriesComponent } from '@components/custom-controls/categories/categories.component'
import { SearchPartService } from '@services/searchPart.service'
import { SearchInputComponent } from '@components/custom-controls/searchInput/searchInput.component'
import { PopUpServiceService } from '@app/dialog/services/popUpService.service'
import { ConfirmServiceService } from '@app/dialog/services/confirmService.service'
import { HomeComponent } from '@components/search/home/Home.component'
import { CompanyChoiseComponent } from '@app/component-main/company-choise/company-choise.component'
import { ModelChoiceComponent } from '@app/component-main/model-choice/model-choice.component'
import { ModificationChoiceComponent } from '@app/component-main/modification-choice/modification-choice.component'
import { RegionComponent } from '@components/custom-controls/region/region.component'
import { CategoryChoiseComponent } from '@app/category-main/category-choise/category-choise.component'
import { SubcategoryChoiseComponent } from '@app/category-main/subcategory-choise/subcategory-choise.component'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { SearchBarComponent } from '@components/search-bar/search-bar.component'
import { StaticSelectionService } from '@services/staticSelection.service'
//#endregion
//#region @Component
@Component({
    standalone: true,
    selector: 'app-carfilter',
    templateUrl: './carfilter.component.html',
    styleUrls: ['./carfilter.component.css'],
    imports: [
        CategoriesComponent,
        RadioGroupComponent,
        SelectComponent,
        RadioGroupListComponent,
        InputComponent,
        TooltipDirective,
        NgStyle,
        CategoriesFooterComponent,
        ReactiveFormsModule,
        SearchInputComponent,
        CompanyChoiseComponent,
        ModelChoiceComponent,
        ModificationChoiceComponent,
        RegionComponent,
        CategoryChoiseComponent,
        SubcategoryChoiseComponent,
        SearchBarComponent,
    ],
})
//#endregion
export class CarFilterComponent extends HelperComponent implements OnInit, AfterViewInit {
    //#region members
    header?: string
    filterForm: FormGroup
    startState
    companies?: Company[]
    models?: Model[]
    modifications?: Modification[]
    categories?: Category[]
    subCategories?: SubCategory[]
    engineTypes?: SelectOption[]
    gearBoxTypes?: SelectOption[]
    selectedModels?: string
    users?: SelectOption[]
    extendedSearch_?: boolean = false
    dispayCategory = false

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialState?: any
    sortType = 0
    _dropDown: Dropdown[] = []
    previuosFilter?: FilterCategory
    _filter?: Filter
    selectedCategoryId?: number
    selectedSubCategoryId?: number
    itemTypes: SelectOption[] = [
        { value: ItemType.All, text: 'Всички обяви' },
        { value: ItemType.OnlyCar, text: 'Само коли' },
        { value: ItemType.CarPart, text: 'Само части' },
    ]
    approvedTypes: SelectOption[] = [
        { value: 3, text: 'Всички обяви' },
        { value: 0, text: 'Не одобрени' },
        { value: 1, text: 'Одобрени' },
        { value: 2, text: 'Блокирани' },
    ]
    $subscription?: object
    todoCategories$?: Observable<NumberPartsPerCategory[]>
    _autoCategoriesSearch$ = new Subject<Filter>()
    _debounceTime = 1000
    categoriesId = ''
    _subCategories?: SubCategory[]
    subCategoriesSet: OptionItem[] = []
    categoriesElement?: ElementRef<HTMLInputElement>
    params?: object
    _itemType: ItemType = ItemType.All
    stage = 1
    modificationStr?: string
    categoryStr?: string
    subCategoryStr?: string
    showCategory?: boolean = true
    countProperty?: string
    companiesSelect: OptionItem[] = []
    modelsSelect: OptionItem[] = []
    modificationsSelect: OptionItem[] = []
    radios: RadioButton[] = [
        { label: 'Кола', id: 0 },
        { label: 'Бус', id: 1 },
    ]
    carRadios: RadioButton[] = [
        { label: 'Всички обяви', id: ItemType.AllCarAndPart },
        { label: 'Коли на части', id: ItemType.OnlyCar },
        { label: 'Само части', id: ItemType.CarPart },
    ]

    busRadios: RadioButton[] = [
        { label: 'Всички обяви', id: ItemType.AllBusAndPart },
        { label: 'Бусове на части', id: ItemType.OnlyBus },
        { label: 'Само части', id: ItemType.BusPart },
    ]
    companyId?: number
    modelId?: string
    max = true

    categoriesSet: OptionItem[] = []
    //#endregion

    //#region Output/Input

    @Input() set filter(value: Filter) {
        this._filter = value

        this.updateForm(this._filter)
    }
    @ViewChild('categoriesElem') set categoriesRef(elRef: ElementRef<HTMLInputElement>) {
        if (elRef) {
            this.categoriesElement = elRef
        }
    }
    @Output() changes: EventEmitter<object> = new EventEmitter<object>()
    @Input() userId?: string
    @Input() itemType?: number
    @Input() query?: string
    @Input() bus?: number

    @Output() dropDownItems: EventEmitter<Dropdown[]> = new EventEmitter<Dropdown[]>()
    @HostListener('window:keydown', ['$event'])
    submitEvent(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            event.preventDefault()
            this.submit()
        }
    }
    //#endregion

    //#region constructor

    constructor(
        private formBuilder: FormBuilder,
        public categoryService: CategoryService,
        public subCategoryService: SubCategoryService,
        private userService: UserService,
        private homeService: HomeService,
        public modelService: ModelService,
        public popupService: PopUpServiceService,
        public loadingService: LoadingService,
        public staticSelectionService: StaticSelectionService,
        private router: Router,
        private confirmService: ConfirmServiceService,
        private topService: TopService,
        private changeDetector: ChangeDetectorRef,
        private searchPartService: SearchPartService,
        public dialog: MatDialog,
        private destroyRef: DestroyRef,
        public activeRoute: ActivatedRoute,
        @Optional() public parent: HomeComponent
    ) {
        super()
        this.filterForm = formBuilder.group({
            result: [],
            userId: [0],
            bus: [0],
            itemType: [ItemType.AllCarAndPart],
            approved: [3],
            companyId: [0],
            modelsId: [''],
            modificationsId: [''],
            engineType: [0],
            engineModel: [''],
            gearboxType: [0],
            powerBHP: [],
            regionId: [0],
            partNumber: [''],
            orderBy: [0],
            keyword: [''],
            hasImages: [false],
            categoriesId: [''],
            subCategoriesId: [''],
            selectedCategories: formBuilder.array([]),
        })

        this.startState = this.filterForm.value
    }
    //#endregion

    //#region On functions
    subscribeEvents() {
        this.controls['bus'].valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((f) => this.onBusChange(f))

        this.controls['itemType'].valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((f) => this.onItemType(f))

        this.controls['companyId'].valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((f) => this.onCompanyChange(f))

        this.controls['modelsId'].valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((f) => this.onModelChange(f))

        this.controls['categoriesId'].valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((f) => this.categoriesIdChanged(f))

        this.filterForm.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .pipe(distinctUntilChanged(), debounceTime(this._debounceTime))
            .subscribe((value) => {
                this.updateCategory()
                this.changes.emit(value)
            })
    }

    onBusChange(f: number): void {
        this.bus = f

        if (this.bus) {
            if (this.itemType != ItemType.AllBusAndPart && this.itemType != ItemType.OnlyBus && this.itemType != ItemType.BusPart) this.itemType = ItemType.AllBusAndPart
        } else {
            if (this.itemType != ItemType.AllCarAndPart && this.itemType != ItemType.OnlyCar && this.itemType != ItemType.CarPart) this.itemType = ItemType.AllCarAndPart
        }

        this.filterForm.patchValue({ companyId: 0, modelsId: '', modificationsId: '', itemType: this.itemType })
        this.onItemType(this.itemType)
    }

    getRadios() {
        if (this.bus) {
            return this.busRadios
        } else {
            return this.carRadios
        }
    }
    changeBusCar() {
        return
    }
    orderBy(f: number) {
        console.log(f)
    }

    onItemType(f?: number): void {
        this.itemType = f
        if (this.bus) {
            if (this.itemType == ItemType.BusPart) {
                this.header = 'Търси част за бус'
                this.countProperty = 'countParts'
            } else {
                this.header = 'Търси бус на части'
                this.countProperty = 'countCarBus'
            }
        } else {
            if (this.itemType == ItemType.CarPart) {
                this.header = 'Търси част за кола'
                this.countProperty = 'countParts'
            } else {
                this.header = 'Търси кола на части'
                this.countProperty = 'countCarBus'
            }
        }

        if (this.itemType === ItemType.OnlyCar || this.itemType === ItemType.OnlyBus) this.showCategory = false
        else this.showCategory = true
        this.parent.setShowCategory(this.showCategory)
    }

    ngOnInit() {
        this.subscribeEvents()
        this.onItemType(this.itemType)
        this.engineTypes = this.staticSelectionService.EngineType.map(replaceFirst)
        this.gearBoxTypes = this.staticSelectionService.GearboxType.map(replaceFirst)
        this.categoryService.fetch().subscribe((res) => {
            this.categories = []
            res.forEach((item) => {
                let category = new Category()
                category = Object.assign(category, item)
                this.categories?.push(category)
                item['count'] = 0
                this.categoriesConrol.push(this.createCategory(item.categoryId!))
            })

            this.categoriesSet = this.categories.map((item) => {
                const cat = {
                    description: item.categoryName,
                    id: item.categoryId,
                    count: item.count,
                    countCars: 0,
                    countParts: 0,
                    imageName: item.imageName,
                    groupModelId: 0,
                }
                return cat
            })
            this.updateCategory()
        })

        if (this.admin) {
            this.userService.getAll().subscribe((res) => {
                const user = new User()
                res.sort(sortUser)
                const users = res.map((user) => {
                    return { value: user.userId, text: `${user.userName} - ${user.email ?? ''}` }
                })
                user.userId = 0
                user.userName = 'Всички'
                users.unshift({ value: 0, text: 'Всички' })
                this.users = [...users]
                this.filterForm.controls['userId'].setValidators([Validators.required])
                if (this.userId) {
                    this.filterForm.patchValue({ userId: this.userId })
                }
            })
        }
    }

    ngAfterViewInit(): void {
        this.activeRoute.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
            if (params['query']) {
                this.query = params['query']
                if (this.query) {
                    this.searchPartService.getFilter(+this.query).subscribe((filter) => {
                        this._filter = filter
                        if (this._filter) {
                            this.filterForm.patchValue(this._filter)
                            this.extendedSearch_ = this._filter.extendedSearch
                        }
                    })
                }
            }
        })

        if (this.userId) this.filterForm.patchValue({ userId: this.userId })

        this.initialState = this.filterForm.value

        if (this._filter) {
            this.updateForm(this._filter)
            this.extendedSearch_ = this._filter.extendedSearch
        } else {
            this.filterForm.patchValue({ bus: this.bus, itemType: this.itemType })
        }

        this.changeDetector.detectChanges()
    }

    updateForm(filter: Filter) {
        if (filter.categoryId) filter.categoriesId = filter.categoryId.toString()
        if (filter.subCategoryId) filter.subCategoriesId = filter.subCategoryId.toString()
        this.filterForm.patchValue(filter)
    }
    createCategory(categoryId: number): FormGroup {
        return this.formBuilder.group({
            selected: [false],
            categoryId: [categoryId],
        })
    }
    //#endregion

    clear() {
        this.filterForm.patchValue(this.startState)
        goTop()
    }

    itemTypeChanged() {
        console.log('Item Type changed')
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    focus() {}

    clearFilter() {
        this.extendedSearch_ = false
        this.clear()
        this.stage = 1
        this.modificationStr = this.categoryStr = this.subCategoryStr = ''
        this.stage = 1
        this.modificationStr = this.categoryStr = this.subCategoryStr = ''
        this.dataManager?.clearData()
        this.router.navigate(['/'])
    }
    //#endregion

    //#region categories events
    onUnSelection() {
        this.dispayCategory = false
        console.log('mouse out')
        const element = document.getElementById(`categoriesMinElem`)
        if (!element) return
        element.style.display = 'none'
    }

    showResult(categoryId?: number, subCategoryId?: number) {
        if (!categoryId && !subCategoryId) return

        const filterCategory: Filter = {
            ...this.filterForm.value,
            ...{
                id: 0,
                searchBy: SearchBy.Filter,
                extendedSearch: this.extendedSearch_,
                categoryId: categoryId,
                subCategoryId: subCategoryId,
            },
        }
        this.goToResult(filterCategory)
    }

    onSelection(categorySubcategory: CategorySubcategory) {
        this.selectedCategoryId = categorySubcategory.categoryId
        this.selectedSubCategoryId = categorySubcategory.subcategoryId
        // if (!this.filterForm.value.companyId) {
        //     this.confirmService.OKCancel('Съобщение', 'Не сте избрали марка! Искате ли да продължите?').subscribe((result) => {
        //         if (result === OKCancelOption.OK) {
        //             this.showResult(this.selectedCategoryId, this.selectedSubCategoryId)
        //         }
        //     })
        // } else {
        this.showResult(this.selectedCategoryId, this.selectedSubCategoryId)
        //        }
    }

    updateCategory() {
        const filter: FilterCategory = {
            companyId: this.filterForm.controls['companyId'].value ?? 0,
            modelId: 0,
            modelsId: this.filterForm.controls['modelsId'].value,
            modificationId: 0,
            modificationsId: this.filterForm.controls['modificationsId'].value,
            userId: 0,
            bus: this.filterForm.controls['bus'].value,
            hasImages: this.filterForm.controls['hasImages'].value,
        }
        if (this.admin) {
            filter.userId = this.filterForm.controls['userId'].value
        }
        if (this.previuosFilter) {
            if (
                this.previuosFilter.companyId == filter.companyId &&
                this.previuosFilter.modelsId === filter.modelsId &&
                this.previuosFilter.modificationId == filter.modificationId &&
                this.previuosFilter.modificationsId == filter.modificationsId &&
                this.previuosFilter.bus == filter.bus &&
                this.previuosFilter.userId == filter.userId &&
                this.previuosFilter.hasImages == filter.hasImages
            )
                return
        }

        this.previuosFilter = { ...filter }
        this.categoryService.fetchPartsPerCategory(this.previuosFilter).subscribe((res) => {
            this.convertResult(res)
        })
    }

    convertResult(res: NumberPartsPerCategory[]) {
        const tempDropDown: Dropdown[] = []
        const count: NumberPartsPerCategory[] = res
        this.categories?.forEach((x) => {
            const index = res.findIndex((category) => category.categoryId === x.categoryId)
            if (index !== -1) {
                x.count = res[index].numberParts
                const dropDown: Dropdown = new Dropdown()
                dropDown.name = x.categoryName.charAt(0).toLocaleUpperCase() + x.categoryName?.toLocaleLowerCase().slice(1)
                dropDown.imageName = x.imageName
                dropDown.id = x.categoryId
                const category = count.find((category) => category.categoryId === x.categoryId)
                dropDown.count = category?.numberParts
                category?.subCategories.forEach((subCategory) => {
                    dropDown.children.push({ text: subCategory.subCategoryName, value: subCategory.subCategoryId, count: subCategory.count })
                })
                tempDropDown.push(dropDown)
            } else {
                x['count'] = 0
            }
        })
        this._dropDown = tempDropDown

        this.categoryService._filtercategories = of(this._dropDown)
        this.dropDownItems.emit(this._dropDown)
    }
    //#endregion

    //#region Search
    submit() {
        const filter: Filter = Object.assign(
            this.filterForm.value,
            { searchBy: SearchBy.Filter },
            { adminRun: this.admin ? true : false },
            { extendedSearch: this.extendedSearch_ },
            { selectedCategories: undefined }
        )
        this.goToResult(filter)
    }

    onSearchByNumber() {
        const value = this.filterForm.controls['partNumber'].value
        if (!value || !value.length) {
            this.confirmService.OK('Съобщение', 'Моля въведете номера на частта')
            return
        }

        const filter: Filter = Object.assign(this.filterForm.value, { SearchBy: SearchBy.PartNumber }, { extendedSearch_: this.extendedSearch_ })
        this.goToResult(filter)
    }

    categoryClick(categoryId: number) {
        const filter: Filter = Object.assign(this.filterForm.value, { selectedCategories: [] }, { extendedSearch: this.extendedSearch_ }, { categoryId: categoryId })
        this.goToResult(filter)
    }

    goToResult(filter: Filter) {
        goTop();
        this.loadingService.open('Зареждане на резултатите')
        this.searchPartService.search(filter).subscribe({
            next: (res) => {
                const dataManager = this.homeService.updateData(filter.id, filter)
                dataManager.updateData(res)
                if (dataManager.noParts()) {
                    this.loadingService.close()
                    this.popupService.openWithTimeout('Съобщение', 'Няма намерени обяви!', 5000)
                } else if (dataManager.filterData.length === 100) {
                    this.popupService.openWithTimeout('Съобщение', 'Филтъра Ви връща повече от 100 части. Само първите 100 ще се покажат', 500000).subscribe(() => {
                        this.router.navigate(['/results'], { queryParams: { query: filter.id, page: 1 } })
                    })
                } else {
                    this.router.navigate(['/results'], { queryParams: { query: filter.id, page: 1 } })
                }
            },
            error: (error) => {
                console.log(error)
            },
            complete: () => {
                this.loadingService.close()
            },
        })
    }
    //#endregion

    sortDataBy(event: SortType) {
        this.filterForm.patchValue({ orderBy: event })
    }

    onCompanyChange(companyId: number) {
        this.companyId = companyId
    }

    onModelChange(modelId: string) {
        this.modelId = modelId
    }

    categoriesIdChanged(f: string) {
        this._subCategories = []
        this.categoriesId = f

        this.subCategoryService.getSubCategoriesByCategoriesId(f).subscribe((data) => {
            this._subCategories = data
            this.subCategoriesSet = this._subCategories.map((item) => {
                return { id: item.subCategoryId, description: item.subCategoryName, count: 0, groupModelId: 0, typeItem: TypeItem.ALL, countCars: 0, countParts: 0 }
            })
        })

        if (!f) this.filterForm.patchValue({ subCategoriesId: '' })
    }

    selectCompany() {
        this.topService.activate.next({ component: CompanyComponent, data: this.companies })
    }

    //#endregion

    //#region get functions
    get controls() {
        return this.filterForm.controls
    }

    get admin() {
        return this.authenticationService.admin
    }

    get mobile() {
        return isMobile()
    }

    get dataManager() {
        return this.homeService.getDataManager(0)
    }

    get categoriesConrol(): FormArray {
        return this.filterForm.get('selectedCategories') as FormArray
    }

    get extendedSearch() {
        return this.extendedSearch_
    }

    set extendedSearch(value) {
        this.extendedSearch_ = value
    }

    readonly hideFilter = false

    readonly displayFilter = true

    get dropDown() {
        return this._dropDown
    }

    //#endregion
}
