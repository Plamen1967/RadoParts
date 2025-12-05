import { NgClass } from '@angular/common'
import { AfterViewInit, Component, HostListener, Input, OnInit, Optional } from '@angular/core'
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { TooltipDirective } from '@app/directive/tooltip.directive'
import { isMobile, sortUser } from '@app/functions/functions'
import { CategoriesFooterComponent } from '@components/custom-controls/categoriesFooter/categoriesfooter.component'
import { RadioGroupListComponent } from '@components/custom-controls/radioGroupList/radiogrouplist.component'
import { SelectComponent } from '@components/custom-controls/select-controls/select/select.component'
import { CustomSelectComponent } from '@components/custom-controls/x-custom-select/customSelect.component'
import { HelperComponent } from '@components/custom-controls/helper/helper.component'
import { HomeComponent } from '@components/search/home/Home.component'
import { getModelAll } from '@model/company-model-modification/model'
import { CountTyres } from '@model/countTyres'
import { ItemType } from '@model/enum/itemType.enum'
import { SearchBy } from '@model/enum/searchBy.enum'
import { Filter } from '@model/filters/filter'
import { RadioButton } from '@model/radioButton'
import { SelectOption } from '@model/selectOption'
import { User } from '@model/user'
import { ModelService } from '@services/company-model-modification/model.service'
import { HomeService } from '@services/home.service'
import { LoadingService } from '@services/loading.service'
import { SearchPartService } from '@services/searchPart.service'
import { StaticSelectionService } from '@services/staticSelection.service'
import { TyreService } from '@services/tyre/tyre.service'
import { UserService } from '@services/user.service'
import { ConfirmServiceService } from '@app/dialog/services/confirmService.service'
import { OptionItem } from '@model/optionitem'
import { CompanyChoiseComponent } from '@app/component-main/company-choise/company-choise.component'
import { SearchBarComponent } from '@components/search-bar/search-bar.component'
import { CategoriesComponent } from '@components/custom-controls/categories/categories.component'
import { Dropdown } from '@model/dropDown'
import { CategorySubcategory } from '@model/category-subcategory/categorySubCategory'

@Component({
    standalone: true,
    selector: 'app-tyrefilter',
    templateUrl: './tyrefilter.component.html',
    styleUrls: ['./tyrefilter.component.css'],
    imports: [
        CustomSelectComponent,
        NgClass,
        FormsModule,
        ReactiveFormsModule,
        SelectComponent,
        TooltipDirective,
        CategoriesFooterComponent,
        RadioGroupListComponent,
        CompanyChoiseComponent,
        SearchBarComponent,
        CategoriesComponent,
    ],
})
export class TyreFilterComponent extends HelperComponent implements OnInit, AfterViewInit {
    categories = [
        { value: 1, text: 'Гуми' },
        { value: 2, text: 'Джанти' },
        { value: 3, text: 'Джанти с гуми' },
    ]
    filterForm: FormGroup
    models: SelectOption[] = []
    selectedCategory: ItemType = ItemType.AllTyre
    hideFilter = false
    initialState
    displayTyre = true
    displayRim = false
    _dropDown: Dropdown[] = []
    showCategory?: boolean = true
    approvedTypes: SelectOption[] = [
        { value: 3, text: 'Всички обяви' },
        { value: 0, text: 'Не одобрени' },
        { value: 1, text: 'Одобрени' },
        { value: 2, text: 'Блокирани' },
    ]
    users?: SelectOption[]
    _filter?: Filter
    itemType: ItemType = ItemType.AllTyre
    tyreWidth?: SelectOption[]
    tyreHeight?: SelectOption[]
    tyreRadius?: SelectOption[]
    tyreTypes?: SelectOption[]
    tyreProducers: OptionItem[] = []

    rimBoltDistances?: SelectOption[]
    rimCenters?: SelectOption[]
    rimBoltCount?: SelectOption[]
    rimOffset?: SelectOption[]
    rimMaterial?: SelectOption[]
    rimWidth?: SelectOption[]
    regions?: SelectOption[]

    countTyres?: CountTyres
    categoriesFooter: Dropdown[] = [
        { id: 3, name: 'Гуми', imageName: '../../../images/png/tyre.png', count: 0, children: [] },
        { id: 4, name: 'Джанти', imageName: '../../../images/png/rim.png', count: 0, children: [] },
        { id: 5, name: 'Джанти с гуми', imageName: '../../../images/png/rimwithtyre.png', count: 0, children: [] },
    ]

    radioTypes: RadioButton[] = [
        { label: 'Всички', id: 7 },
        { label: 'Гуми', id: 3 },
        { label: 'Джанти', id: 4 },
        { label: 'Джанти с гуми', id: 5 },
    ]

    @Input() set filter(value: Filter) {
        this.setFilter(value)
    }

    @Input() userId?: number
    @Input() query?: number
    @Input() searchType = SearchBy.Filter
    @HostListener('window:keydown', ['$event'])
    submitEvent(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            event.preventDefault()
            this.submit()
        }
    }
    constructor(
        private formBuilder: FormBuilder,
        private modelService: ModelService,
        private homeService: HomeService,
        private userService: UserService,
        public loadingService: LoadingService,
        public searchPartService: SearchPartService,
        private router: Router,
        private route: ActivatedRoute,
        private tyreService: TyreService,
        public staticSelectionService: StaticSelectionService,
        private confirmService: ConfirmServiceService,
        @Optional() public home?: HomeComponent
    ) {
        super()
        this.filterForm = formBuilder.group({
            itemType: [ItemType.AllTyre],
            userId: [0],
            approved: [3],
            tyreCompanyId: [0],
            tyreWidth: [0],
            tyreHeight: [0],
            tyreRadius: [0],
            tyreType: [0],
            regionId: [0],
            companyId: [0],
            modelId: [0],
            rimWidth: [0],
            rimMaterial: [0],
            rimOffset: [0],
            rimBoltCount: [0],
            rimBoltDistance: [0],
            rimCenter: [0],
            orderBy: [0],
            hasImages: [false],
        })
        this.initialState = this.filterForm.value
        delete this.initialState.itemType
    }
    ngAfterViewInit(): void {
        this.filterForm.controls['itemType'].valueChanges.subscribe((f) => this.itemTypeChanged(f))

        if (this.itemType) {
            this.filterForm.patchValue({ itemType: ItemType.AllTyre })
            this.itemTypeChanged(ItemType.AllTyre)
        }
        if (this.userId) this.filterForm.patchValue({ userId: this.userId })

        this.itemTypeChanged(this.filterForm.controls['itemType'].value)
        if (this.home?.filter) {
            this.setFilter(this.home.filter)
        }
        this.home?.setShowCategory(true)
    }

    setFilter(filter: Filter) {
        this._filter = filter
        this.filterForm.patchValue(this._filter)
    }

    focus() {
        return
    }

    ngOnInit() {
        this.tyreWidth = [{ value: 0, text: 'Всички' }, ...this.staticSelectionService.TyreWidth]
        this.tyreHeight = [{ value: 0, text: 'Всички' }, ...this.staticSelectionService.TyreHeight]
        this.tyreRadius = [{ value: 0, text: 'Всички' }, ...this.staticSelectionService.TyreRadius]
        this.tyreTypes = [{ value: 0, text: 'Всички' }, ...this.staticSelectionService.TyreType]
        this.tyreProducers = [{ value: 0, text: 'Всички' }, ...this.staticSelectionService.TyreProducers].map((item) => {
            return { id: item.value, description: item.text, count: 0, countCars: 0, countParts: 0 }
        })

        this.rimBoltDistances = [{ value: 0, text: 'Всички' }, ...this.staticSelectionService.RimBoltDistance]
        this.rimCenters = [{ value: 0, text: 'Всички' }, ...this.staticSelectionService.RimCenter]
        this.rimBoltCount = [{ value: 0, text: 'Всички' }, ...this.staticSelectionService.RimBoltCount]
        this.rimOffset = [{ value: 0, text: 'Всички' }, ...this.staticSelectionService.RimOffset]
        this.rimMaterial = [{ value: 0, text: 'Всички' }, ...this.staticSelectionService.RimMaterial]
        this.rimWidth = [{ value: 0, text: 'Всички' }, ...this.staticSelectionService.RimWidth]
        this.regions = [{ value: 0, text: ' Всички' }, ...this.staticSelectionService.Region]

        this.tyreService.getCount().subscribe((item) => {
            this.countTyres = item
            this.categoriesFooter[0].count = this.countTyres.countTyres ?? 0
            this.categoriesFooter[1].count = this.countTyres.countRims ?? 0
            this.categoriesFooter[2].count = this.countTyres.countTyreWithRims ?? 0
        })

        if (!this.query) {
            this.filterForm.patchValue(this.initialState)
        }

        if (this.admin) {
            this.userService.getAll().subscribe((res) => {
                const user = new User()
                user.userId = 0
                user.userName = 'Всички'
                res.sort(sortUser)
                res.unshift(user)
                this.users = res.map((user) => {
                    return { value: user.userId, text: user.userName }
                })
                this.filterForm.controls['userId'].setValidators([Validators.required])
                if (this.userId) {
                    this.filterForm.patchValue({ userId: this.userId })
                }
            })
        }
    }

    clearFilter() {
        this.filterForm.patchValue(this.initialState)
    }

    //#region Search
    submit() {
        const filter: Filter = Object.assign({}, this.filterForm.value)
        filter.adminRun = false
        if (this.admin) {
            filter.adminRun = true
        }
        this.goToResult(filter)
    }

    goToResult(filter: Filter) {
        const dataManager = this.homeService.updateData(filter.id, filter)
        this.loadingService.open('Зареждане на резултатите')
        this.searchPartService.search(filter).subscribe({
            next: (res) => {
                this.loadingService.close()
                dataManager.updateData(res)
                if (dataManager.noParts()) {
                    this.confirmService.OK('Съобщение', this.labels.NORESULTS)
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

    //#region Events
    itemTypeChanged(itemType: ItemType) {
        this.selectedCategory = itemType
        this.displayTyre = this.selectedCategory === ItemType.Tyre || this.selectedCategory === ItemType.RimWithTyre
        this.displayRim = this.selectedCategory == ItemType.Rim || this.selectedCategory == ItemType.RimWithTyre
    }

    onCompanyChange(companyId: number) {
        this.modelService.fetchByCompanyId(companyId).subscribe((res) => {
            res.unshift(getModelAll())
            this.models = res.map((model) => {
                return { value: model.modelId!, text: model.modelName }
            })
        })
    }
    onSelection(event: CategorySubcategory) {
        console.log(`${event.categoryId}`)
        this.categoryClick(event.categoryId as ItemType)
        return
    }
    categoryClick(event: ItemType) {
        const filter: Filter = Object.assign({}, { id: 0, itemType: event })
        filter.adminRun = false
        if (this.admin) {
            filter.adminRun = true
        }
        this.goToResult(filter)
    }
    //#endregion

    //#region get function
    get admin() {
        return this.authenticationService.admin
    }

    get mobile() {
        return isMobile()
    }

    get displayAll(): boolean {
        const returnValue = this.selectedCategory === ItemType.AllTyre
        return returnValue
    }
    //#endregion
}
