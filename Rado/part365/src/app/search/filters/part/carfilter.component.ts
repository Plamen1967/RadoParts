//#region import
import { AfterViewInit, Component, computed, debounced, DestroyRef, effect, HostListener, inject, input, OnInit, output, signal } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { distinctUntilChanged, Observable, Subject } from 'rxjs'
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
import { CategoriesFooterComponent } from '@components/custom-controls/categoriesFooter/categoriesfooter.component'
import { RadioGroupComponent } from '@components/custom-controls/radioGroup/radiogroup.component'
import { CategoriesComponent } from '@components/custom-controls/categories/categories.component'
import { SearchPartService } from '@services/searchPart.service'
import { SearchInputComponent } from '@components/custom-controls/searchInput/searchInput.component'
import { PopUpService } from '@app/dialog/services/popUpService.service'
import { ConfirmServiceService } from '@app/dialog/services/confirmService.service'
import { CompanyChoiseComponent } from '@app/component-main/company-choise/company-choise.component'
import { ModelChoiceComponent } from '@app/component-main/model-choice/model-choice.component'
import { ModificationChoiceComponent } from '@app/component-main/modification-choice/modification-choice.component'
import { RegionComponent } from '@components/custom-controls/region/region.component'
import { CategoryChoiseComponent } from '@app/category-main/category-choise/category-choise.component'
import { SubcategoryChoiseComponent } from '@app/category-main/subcategory-choise/subcategory-choise.component'
import { SearchBarComponent } from '@components/search-bar/search-bar.component'
import { StaticSelectionService } from '@services/staticSelection.service'
import { HomeComponent } from '@app/search/home/Home.component'
import { form, FormField, FormRoot } from '@angular/forms/signals'
import { httpResource } from '@angular/common/http'
import { environment } from '@env/environment'
import { CompanyControlConfig } from '@model/companyControlConfig'
import { toObservable, toSignal } from '@angular/core/rxjs-interop'
//#endregion

//#region interface
interface CarFilter {
    result: []
    userId: number
    bus: number
    itemType: number
    approved: number
    companyId: number
    modelsId: string
    modificationsId: string
    engineType: number
    engineModel: string
    gearboxType: number
    powerBHP: number
    regionId: number
    partNumber: string
    orderBy: number
    keyword: string
    hasImages: boolean
    categoryId: number
    subCategoryId: number
    categoriesId: string
    subCategoriesId: string
    selectedCategories: { selected: number; categoryId: number }[]
}
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
        FormField,
        FormRoot,
        RadioGroupListComponent,
    ],
})
//#endregion
export class CarFilterComponent extends HelperComponent implements OnInit, AfterViewInit {
    onSubmit() {
        this.submit()
        console.log(`Submitted`)
    }
    //#region form
    carFilterModel = signal<CarFilter>({
        bus: 0,
        userId: 0,
        result: [],
        selectedCategories: [],
        itemType: ItemType.AllCarAndPart,
        approved: 3,
        companyId: 0,
        modelsId: '',
        modificationsId: '',
        engineType: 0,
        engineModel: '',
        gearboxType: 0,
        powerBHP: 0,
        regionId: 0,
        partNumber: '',
        orderBy: 0,
        keyword: '',
        hasImages: false,
        categoryId: 0,
        subCategoryId: 0,
        categoriesId: '',
        subCategoriesId: '',
    })
    carFilterForm = form(
        this.carFilterModel
        //      {
        //   submission: {
        //     action: async (field) => {
        //       return {kind: 'serverError', message: 'Failed to submit form'};
        //     },
        //   },
        // },
    )
    //#endregion form

    //#region members
    header?: string
    companies?: Company[]
    models?: Model[]
    modifications?: Modification[]
    categories?: Category[]
    subCategories?: SubCategory[]
    engineTypes: SelectOption[] = []
    gearBoxTypes: SelectOption[] = []
    selectedModels?: string
    users: SelectOption[] = []
    extendedSearch_?: boolean = false
    dispayCategory = false

    categoryFilte = signal<FilterCategory | undefined>(undefined)
    initialState? = {}
    sortType = 0
    previuosFilter?: FilterCategory
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
    radioBus: RadioButton[] = [
        { label: 'Кола', id: 0 },
        { label: 'Бус', id: 1 },
    ]
    carRadios: RadioButton[] = [
        { label: 'Всички', id: ItemType.AllCarAndPart },
        { label: 'Коли на части', id: ItemType.OnlyCar },
        { label: 'Само части', id: ItemType.CarPart },
    ]

    busRadios: RadioButton[] = [
        { label: 'Всички', id: ItemType.AllBusAndPart },
        { label: 'Бусове на части', id: ItemType.OnlyBus },
        { label: 'Само части', id: ItemType.BusPart },
    ]
    companyId?: number
    companyIdSignal = computed(() => this.carFilterModel().companyId)
    modelId?: string
    max = true

    debouncedQuery = debounced(this.carFilterModel, 3000)

    radioTypes = computed(() => {
        if (this.carFilterForm.bus().value()) {
            return this.busRadios
        } else {
            return this.carRadios
        }
    })

    readonly submitted = signal(false)

    //#endregion

    //#region Output/Input
    userId = input<number | undefined>(undefined)
    itemType = input<ItemType | undefined>(undefined)
    query = input<number | undefined>(0)
    bus = input<number | undefined>(0)
    dropDownItems = output<Dropdown[]>()
    changes = output<object>()
    //#endregion

    //#region services
    public categoryService: CategoryService = inject(CategoryService)
    public subCategoryService: SubCategoryService = inject(SubCategoryService)
    private userService: UserService = inject(UserService)
    private homeService: HomeService = inject(HomeService)
    public modelService: ModelService = inject(ModelService)
    public popupService: PopUpService = inject(PopUpService)
    public loadingService: LoadingService = inject(LoadingService)
    public staticSelectionService: StaticSelectionService = inject(StaticSelectionService)
    private router: Router = inject(Router)
    private confirmService: ConfirmServiceService = inject(ConfirmServiceService)
    private topService: TopService = inject(TopService)
    private searchPartService: SearchPartService = inject(SearchPartService)
    public dialog: MatDialog = inject(MatDialog)
    private destroyRef: DestroyRef = inject(DestroyRef)
    public activeRoute: ActivatedRoute = inject(ActivatedRoute)
    public parent: HomeComponent = inject(HomeComponent, { optional: true }) as HomeComponent
    //#endregion services

    @HostListener('window:keydown', ['$event'])
    submitEvent(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            event.preventDefault()
            // this.submit()
        }
    }

    currentQuery = signal<number>(0)
    //#region computed
    filterModel = httpResource<Filter>(() => {
        if (this.currentQuery()) return `${environment.restAPI}/search/GetFilter?query=${this.currentQuery()}`
        else return undefined
    })

    $category = httpResource<NumberPartsPerCategory[]>(() => ({
        url: `${environment.restAPI}/category/PartsPerCategory`,
        params: {
            companyId: this.$query()!.companyId ?? 0,
            modelId: 0,
            modelsId: this.$query()!.modelsId,
            modificationId: 0,
            modificationsId: this.$query()!.modificationsId,
            userId: 0,
            bus: this.$query()!.bus,
            hasImages: this.$query()!.hasImages ? 1 : 0,
        },
    }))

    config = signal<CompanyControlConfig>({ bus: this.carFilterModel().bus, itemType: this.carFilterModel().itemType, showCount: true, all: true })

    dropDown = computed(() => {
        return this.convertResult(this.$category.value() ?? [])
    })

    itemType_ = computed(() => {
        let itemType = this.carFilterForm.itemType().value()
        const bus = this.carFilterForm.bus().value()

        if (bus) {
            if (itemType != ItemType.AllBusAndPart && itemType != ItemType.OnlyBus && itemType != ItemType.BusPart) itemType = ItemType.AllBusAndPart

            if (itemType == ItemType.BusPart) {
                this.header = 'Търси част за бус'
                this.countProperty = 'countParts'
            } else {
                this.header = 'Търси бус на части'
                this.countProperty = 'countCarBus'
            }
        } else {
            if (itemType != ItemType.AllCarAndPart && itemType != ItemType.OnlyCar && itemType != ItemType.CarPart) itemType = ItemType.AllCarAndPart

            if (itemType == ItemType.CarPart) {
                this.header = 'Търси част за кола'
                this.countProperty = 'countParts'
            } else {
                this.header = 'Търси кола на части'
                this.countProperty = 'countCarBus'
            }
        }

        if (itemType === ItemType.OnlyCar || itemType === ItemType.OnlyBus) this.showCategory = false
        else this.showCategory = true
        this.parent.setShowCategory(this.showCategory)

        return itemType
    })

    filter = computed(() => {
        console.log(`Query Value:`, this.query())
        if (this.query()) {
            this.searchPartService.getFilter(+this.query()!).subscribe((filter) => {
                this.extendedSearch_ = filter.extendedSearch
                return { ...filter }
            })
            return new Filter()
        } else {
            return new Filter()
        }
    })

    //#endregion

    query$ = toObservable(this.carFilterModel).pipe((distinctUntilChanged()))
    $query = toSignal(this.query$);

    constructor() {
        super()
        effect(() => {
            console.log(`Query: `, this.$query())
        })
        effect(() => {
            console.log(`Filter Changed`, this.carFilterModel())
        })

        effect(() => {
            console.log(`Current query: ${this.currentQuery()}`)
        })

        effect(() => {
            if (this.query()) this.currentQuery.set(this.query()!)
        })

        effect(() => {
            console.log(`Filter Model : ${this.filterModel.value()}`)
            this.carFilterModel.update((value) => ({
                ...value,
                ...this.filterModel.value(),
            }))
        })

        effect(() => {
            console.log(`Drop down`, this.dropDown())
        })

        effect(() => {
            console.log(`Filter: `, this.filter())
            this.updateForm(this.filter()!)
            this.extendedSearch_ = this.filter()!.extendedSearch ?? false
        })

        effect(() => {
            console.log(`filter model ${this.query()}`, this.filterModel.value())
        })

        effect(() => {
            this.dropDownItems.emit(this.dropDown())
        })

        effect(() => {
            this.debouncedQuery.value()
            if (this.config().itemType != this.debouncedQuery.value().itemType && this.config().bus != this.debouncedQuery.value().itemType) {
                this.config.update((value) => ({
                    ...value,
                    bus: this.debouncedQuery.value().bus,
                    itemType: this.debouncedQuery.value().itemType,
                }))
            }
        })

        effect(() => {
            const filter = this.filter()
            if (filter) {
                this.updateForm(filter)
            }
        })

        effect(() => {
            console.log(`Form`, this.carFilterForm().value())
        })

        effect(() => {
            this.categoriesIdChanged(this.carFilterForm.categoriesId().value())
        })
    }
    //#endregion
    //#region On functions

    ngOnInit() {
        this.categoryService.fetch().subscribe((res) => {
            this.categories = []
            res.forEach((item) => {
                let category = new Category()
                category = Object.assign(category, item)
                this.categories?.push(category)
                item['count'] = 0
            })
        })

        this.engineTypes = this.staticSelectionService.EngineType.map(replaceFirst)
        this.gearBoxTypes = this.staticSelectionService.GearboxType.map(replaceFirst)

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
            })
        }
    }

    ngAfterViewInit(): void {
        goTop()
    }

    updateForm(filter: Filter) {
        if (filter.categoryId) filter.categoriesId = filter.categoryId.toString()
        if (filter.subCategoryId) filter.subCategoriesId = filter.subCategoryId.toString()
    }

    //#endregion

    clear() {
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
            ...this.carFilterModel(),
            id: 0,
            searchBy: SearchBy.Filter,
            extendedSearch: this.extendedSearch_,
            categoryId: categoryId,
            subCategoryId: subCategoryId,
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

    //#endregion

    //#region Search
    submit() {
        this.submitted.set(true)
        const filter: Filter = Object.assign(
            { ...this.carFilterModel() },
            { searchBy: SearchBy.Filter },
            { adminRun: this.admin ? true : false },
            { extendedSearch: this.extendedSearch_ },
            { selectedCategories: undefined }
        )
        this.goToResult(filter)
    }

    onSearchByNumber() {
        const value = this.carFilterModel().partNumber
        if (!value || !value.length) {
            this.confirmService.OK('Съобщение', 'Моля въведете номера на частта')
            return
        }

        this.submitted.set(true)
        const filter: Filter = Object.assign(this.carFilterModel(), { SearchBy: SearchBy.PartNumber }, { extendedSearch_: this.extendedSearch_ }, { id: 0 })
        this.goToResult(filter)
    }

    categoryClick(categoryId: number) {
        const filter: Filter = Object.assign(this.carFilterModel(), { selectedCategories: [] }, { extendedSearch: this.extendedSearch_ }, { categoryId: categoryId }, { id: 0 })
        this.goToResult(filter)
    }

    goToResult(filter: Filter) {
        this.parent.goToResult(filter)
        // this.loadingService.open('Зареждане на резултатите')
        // this.searchPartService.search(filter).subscribe({
        //     next: (res) => {
        //         const dataManager = this.homeService.updateData(filter.id, filter)
        //         dataManager.updateData(res)
        //         if (dataManager.noParts()) {
        //             this.loadingService.close()
        //             this.popupService.openWithTimeout('Съобщение', 'Няма намерени обяви!', 5000)
        //         } else if (dataManager.filterData.length === 100) {
        //             this.popupService.openWithTimeout('Съобщение', 'Филтъра Ви връща повече от 100 части. Само първите 100 ще се покажат', 2000).subscribe(() => {
        //                 this.router.navigate(['/results'], { queryParams: { query: filter.id, page: 1 } })
        //             })
        //         } else {
        //             this.router.navigate(['/results'], { queryParams: { query: filter.id, page: 1 } })
        //         }
        //     },
        //     error: (error) => {
        //         console.log(error)
        //     },
        //     complete: () => {
        //         this.loadingService.close()
        //     },
        // })
    }
    //#endregion

    categoriesIdChanged(f: string) {
        this._subCategories = []
        this.categoriesId = f

        this.subCategoryService.getSubCategoriesByCategoriesId(f).subscribe((data) => {
            this._subCategories = data
            this.subCategoriesSet = this._subCategories.map((item) => {
                return { id: item.subCategoryId, description: item.subCategoryName, count: 0, groupModelId: 0, typeItem: TypeItem.ALL, countCars: 0, countParts: 0 }
            })
        })

        // if (!f) this.carFilterForm.patchValue({ subCategoriesId: '' })
    }

    selectCompany() {
        this.topService.activate.next({ component: CompanyComponent, data: this.companies })
    }

    //#endregion

    //#region get functions
    get admin() {
        return this.authenticationService.admin
    }

    get mobile() {
        return isMobile()
    }

    get dataManager() {
        return this.homeService.getDataManager(0)
    }

    // get categoriesConrol(): FormArray {
    //     return this.carFilterForm.get('selectedCategories') as FormArray
    // }

    get extendedSearch() {
        return this.extendedSearch_
    }

    set extendedSearch(value) {
        this.extendedSearch_ = value
    }

    readonly hideFilter = false

    readonly displayFilter = true

    //#endregion
    convertResult(res: NumberPartsPerCategory[]) {
        const tempDropDown: Dropdown[] = []
        const count: NumberPartsPerCategory[] = [...res]
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

        return tempDropDown
    }
}

// private model = signal({ items: [{ sku: '', qty: 1 }] });
// form = form(this.model, p => {
//   applyEach(p.items, item => {
//     required(item.sku);
//     min(item.qty, 1);
//   });
// });
// addItem() {
//   this.model.update(m => ({ ...m, items: [...m.items, { sku: '', qty: 1 }] }));
// }
// @for (item of form.items().value(); track $index; let i = $index) {
//   <input [formField]="form.items[i].sku" />
//   <input type="number" [formField]="form.items[i].qty" />
// }

// if (!this.query()) return

// const manager = this.homeService.getDataManager(this.query() ?? 0)
// const filter: Filter | undefined = manager?.displayFilter as Filter | undefined

// if (!filter) {
//     const data = {} as Partial<CarFilter>
//     this.carFilterModel.update((value) => ({ ...value, ...data }))
// }

// console.log(`Filter: ${filter}`)
// this.carFilterModel.update((value) => ({ ...value, ...(filter ?? {}) }))

//     this.categoriesSet = this.categories.map((item) => {
//         const cat = {
//             description: item.categoryName,
//             id: item.categoryId,
//             count: item.count,
//             countCars: 0,
//             countParts: 0,
//             imageName: item.imageName,
//             groupModelId: 0,
//         }
//         return cat
//     })
// })

//         updateCategory() {
//     const filter: FilterCategory = {
//         companyId: this.carFilterModel().companyId ?? 0,
//         modelId: 0,
//         modelsId: this.carFilterModel().modelsId,
//         modificationId: 0,
//         modificationsId: this.carFilterModel().modificationsId,
//         userId: 0,
//         bus: this.carFilterModel().bus,
//         hasImages: this.carFilterModel().hasImages ? 1 : 0,
//     }
//     if (this.admin) {
//         filter.userId = this.carFilterModel().userId
//     }

//     this.previuosFilter = { ...filter }
//     this.categoryService.fetchPartsPerCategory(this.previuosFilter).subscribe((res) => {
//         this.convertResult(res)
//     })
// }
