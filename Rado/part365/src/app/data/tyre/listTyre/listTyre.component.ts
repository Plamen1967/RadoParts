import { AfterViewInit, Component, computed, effect, inject, input, OnInit, signal, untracked } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { Observable, Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators'
import { ActivatedRoute, Router } from '@angular/router'
import { AuthenticatedUser } from '@model/authenticatedUser'
import { HelperComponent } from '@components/custom-controls/helper/helper.component'
import { ItemType } from '@model/enum/itemType.enum'
import { UpdateEnum } from '@model/enum/update.enum'
import { DisplayPartView, Enrich } from '@model/displayPartView'
import { QueryParam } from '@model/queryParam'
import { RadioButton } from '@model/radioButton'
import { SelectOption } from '@model/selectOption'
import { SearchResult } from '@model/searchResult'
import { FilterRimWithTyre } from '@model/FilterRimWithTyre'
import { SearchPartService } from '@services/searchPart.service'
import { StaticSelectionService } from '@services/staticSelection.service'
import { AuthenticationService } from '@services/authentication/authentication.service'
import { HomeService } from '@services/home.service'
import { StateService } from '@services/storage/state.service'
import { TyreService } from '@services/tyre/tyre.service'
import { RadioGroupListComponent } from '@components/custom-controls/radioGroupList/radiogrouplist.component'
import { SelectComponent } from '@components/custom-controls/select-controls/select/select.component'
import { AsyncPipe, NgClass, NgStyle } from '@angular/common'
import { NavigatorComponent } from '@app/search/result/navigator/navigator.component'
import { DealerActionType } from '@model/dealerActionType'
import { Filter } from '@model/filters/filter'
import { PopUpService } from '@app/dialog/services/popUpService.service'
import { ConfirmServiceService } from '@app/dialog/services/confirmService.service'
import { OKCancelOption } from '@app/dialog/model/confirmDialogData'
import { AlertService } from '@services/alert.service'
import { DealerViewComponent } from '../../dealerView/dealerview.component'
import { CONSTANT } from '@app/constant/globalLabels'
import { GoTopComponent } from '@components/custom-controls/goTop/goTop.component'
import { CompanyChoiseComponent } from '@app/component-main/company-choise/company-choise.component'
import { ListTitleComponent } from '../../../components/custom-controls/listtitle/listtitle.component'
import { RegionComponent } from '../../../components/custom-controls/region/region.component'
import { ModelChoiceComponent } from '@app/component-main/model-choice/model-choice.component'
import { goToPosition } from '@app/functions/functions'
import { UserCountService } from '@services/userCount.service'
import { UserCount } from '@model/userCount'
import { ButtonMenuComponent } from '@components/custom-controls/buttonMenu/buttonMenu.component'
import { MenuOption } from '@model/menuOption'
import { form, FormField } from '@angular/forms/signals'
import AddTyreComponent from '../addTyre/addTyre.component'
import UpdateTyreComponent from '../updateTyre/updateTyre.component'
import { httpResource } from '@angular/common/http'
import { environment } from '@env/environment'

interface searchFormInterface {
    category: ItemType
    tyreCompanyId: number
    tyreWidth: number
    tyreHeight: number
    tyreRadius: number
    tyreType: number
    companyId: number
    modelId: number
    rimWidth: number
    rimMaterial: number
    rimOffset: number
    rimBoltCount: number
    rimBoltDistance: number
    rimCenter: number
    regionId: number
}

@Component({
    selector: 'app-listtyre',
    templateUrl: './listTyre.component.html',
    styleUrls: ['./listTyre.component.css'],
    imports: [
        AsyncPipe,
        RadioGroupListComponent,
        ModelChoiceComponent,
        NgStyle,
        RegionComponent,
        SelectComponent,
        NgClass,
        NavigatorComponent,
        ReactiveFormsModule,
        DealerViewComponent,
        GoTopComponent,
        CompanyChoiseComponent,
        ListTitleComponent,
        RegionComponent,
        ButtonMenuComponent,
        FormField,
        AddTyreComponent,
        UpdateTyreComponent,
    ],
})
export default class ListTyreComponent extends HelperComponent implements OnInit, AfterViewInit {
    searchFormModel = signal<searchFormInterface>({
        category: ItemType.AllTyre,
        tyreCompanyId: 0,
        tyreWidth: 0,
        tyreHeight: 0,
        tyreRadius: 0,
        tyreType: 0,
        companyId: 0,
        modelId: 0,
        rimWidth: 0,
        rimMaterial: 0,
        rimOffset: 0,
        rimBoltCount: 0,
        rimBoltDistance: 0,
        rimCenter: 0,
        regionId: 0,
    })
    searchForm = form(this.searchFormModel)
    user?: AuthenticatedUser
    loading = signal<boolean>(false)

    $tyreResource = httpResource<DisplayPartView>(() => {
        if (this.currentId()) 
            return `${environment.restAPI}/rimWithTyre/GetDisplayTyreView/?rimWithTyreId=${this.currentId()}`
        else return undefined
    })

    $displayPartView = computed(() => {
        this.currentId()
        this.refreshTyre(this.$tyreResource.value()!)
        return this.$tyreResource.value()
    })

    categories = [
        { value: ItemType.Tyre, text: 'Гуми' },
        { value: ItemType.Rim, text: 'Джанти' },
        { value: ItemType.RimWithTyre, text: 'Джанти с гуми' },
    ]
    models: SelectOption[] = [{ value: 0, text: CONSTANT.ALL }]
    selectedCategory = ItemType.Tyre
    mode: UpdateEnum = UpdateEnum.View
    allItems = signal<DisplayPartView[]>([])
    currentTyreId?: number
    deleteTyreId?: number
    currentPage = 0
    searched = false
    numberPages = 0
    userId = 0
    companyId?: number
    tyreCompanies: SelectOption[] = []
    boltDistances: SelectOption[] = []
    rimCenters: SelectOption[] = []
    rimBoltCount: SelectOption[] = []
    rimOffset: SelectOption[] = []
    rimMaterial: SelectOption[] = []
    rimWidth: SelectOption[] = []
    tyreWidth: SelectOption[] = []
    tyreHeight: SelectOption[] = []
    tyreRadius: SelectOption[] = []
    regions: SelectOption[] = []
    tyreTypes: SelectOption[] = []
    inialState?: object
    itemType: ItemType = ItemType.AllTyre
    params?: QueryParam
    userCount$: Observable<UserCount | undefined>
    menuOptions: MenuOption[] = [
        { menuId: 1, menu: 'Добави Гума' },
        { menuId: 2, menu: 'Добави Джанта' },
        { menuId: 3, menu: 'Добави Джанта с гума' },
    ]

    radioTypes: RadioButton[] = [
        { label: 'Всички', id: 7 },
        { label: 'Гуми', id: 3 },
        { label: 'Джанти', id: 4 },
        { label: 'Джанти с гуми', id: 5 },
    ]

    public resultMessage = ''
    public todos$!: Observable<SearchResult>
    private readonly _autoSearch$: Subject<FilterRimWithTyre>
    private readonly _debounce: number
    private readonly _destroy$: Subject<boolean>
    private searchPartService: SearchPartService
    public staticSelectionService: StaticSelectionService
    private authernticationService: AuthenticationService
    private tyreService: TyreService
    private homeService: HomeService
    private popupService: PopUpService
    private stateService: StateService
    private router: Router
    private activatedRoute: ActivatedRoute
    private confirmService: ConfirmServiceService
    private alertService: AlertService
    private userCountService: UserCountService
    $addTyreFlag = signal(false)
    $addRimFlag = signal(false)
    $addRimWithTyreFlag = signal(false)
    $updateTyreFlag = signal(false)
    $updateRimFlag = signal(false)
    $updateRimWithTyreFlag = signal(false)
    type = signal<ItemType>(ItemType.Tyre)
    addTyre = input(0)
    addRim = input(0)
    addRimWithTyre = input(0)
    updateTyre = input(0)
    updateRim = input(0)
    updateRimWithTyre = input(0)
    addCar = input(0)
    addBus = input(0)
    addPart = input(0)

    id = signal(0)
    currentId = signal(0)

    $update = computed(() => {
        if (this.$addTyreFlag() || this.$updateRimFlag()) return true
        if (this.updateTyre() || this.updateRim() || this.updateRimWithTyre() || this.addTyre() || this.addRim() || this.addRimWithTyre()) return true
        return false
    })

    $pageItems = computed(() => {
        return this.$getPageData()
    })

    $getPageData = computed(() => {
        return this.allItems().slice((this.currentPage - 1) * 10, this.currentPage * 10)
    })


    constructor() {
        super()

        effect(() => {
            console.log(`Tyre Resource: ${JSON.stringify(this.$tyreResource.value())}`)
            untracked(() => {
                this.refreshTyre(this.$tyreResource.value()!);
            })
        })
        effect(() => {
            console.log(`Set current: ${this.currentId()}`)
        })

        effect(() => {
            console.log(`Tyres: ${this.$getPageData()}`)
        })
        this.searchPartService = inject(SearchPartService)
        this.staticSelectionService = inject(StaticSelectionService)
        this.authernticationService = inject(AuthenticationService)
        this.tyreService = inject(TyreService)
        this.homeService = inject(HomeService)
        this.popupService = inject(PopUpService)
        this.stateService = inject(StateService)
        this.router = inject(Router)
        this.activatedRoute = inject(ActivatedRoute)
        this.confirmService = inject(ConfirmServiceService)
        this.alertService = inject(AlertService)
        this.userCountService = inject(UserCountService)

        this.tyreCompanies = [{ value: 0, text: 'Всички' }, ...this.staticSelectionService.TyreProducers]
        this.boltDistances = [{ value: 0, text: 'Всички' }, ...this.staticSelectionService.RimBoltDistance]
        this.rimCenters = [{ value: 0, text: 'Всички' }, ...this.staticSelectionService.RimCenter]
        this.rimBoltCount = [{ value: 0, text: 'Всички' }, ...this.staticSelectionService.RimBoltCount]
        this.rimOffset = [{ value: 0, text: 'Всички' }, ...this.staticSelectionService.RimOffset]
        this.rimMaterial = [{ value: 0, text: 'Всички' }, ...this.staticSelectionService.RimMaterial]
        this.rimWidth = [{ value: 0, text: 'Всички' }, ...this.staticSelectionService.RimWidth]
        this.tyreWidth = [{ value: 0, text: 'Всички' }, ...this.staticSelectionService.TyreWidth]
        this.tyreHeight = [{ value: 0, text: 'Всички' }, ...this.staticSelectionService.TyreHeight]
        this.tyreRadius = [{ value: 0, text: 'Всички' }, ...this.staticSelectionService.TyreRadius]
        this.regions = [{ value: 0, text: ' Всички' }, ...this.staticSelectionService.Region]
        this.tyreTypes = [{ value: 0, text: 'Всички' }, ...this.staticSelectionService.TyreType]
        this._autoSearch$ = new Subject<FilterRimWithTyre>()
        this._debounce = 3000
        this._destroy$ = new Subject<boolean>()
        this.userCount$ = this.userCountService.userCount$

        this.user = this.authernticationService.currentUserValue
        this.userId = this.user?.userId ?? 0

        // effect(() => this.categoryChanged(this.searchForm.category().value()))
        // effect(() => this.categoryChanged(this.searchForm.companyId().value()))
        effect(() => {
            this.searchForm().value()
            this.search()
        })
    }
    ngAfterViewInit(): void {
        this.inialState = this.searchForm().value()
        this.search()
    }

    ngOnInit() {
        this.currentId.set(this.stateService.currentId ?? 0)
        this.todos$ = this._autoSearch$.pipe(
            debounceTime(this._debounce),
            distinctUntilChanged(),
            switchMap(() => {
                const filter: Filter = Object.assign({}, this.searchForm().value(), { id: 0 })
                filter.itemType = this.searchFormModel().category
                filter.userId = this.userId
                this.loading.set(true)
                this.resultMessage = ''
                return this.searchPartService.search(filter)
            }),
            takeUntil(this._destroy$)
        )

        this.todos$.subscribe((res) => {
            this.updateData(res.data!)
            this.loading.set(false)
            if (res.data?.length == 0) {
                this.resultMessage = 'Няма намерени обяви'
            }
        })
    }

    focus() {
        return
    }
    onCompanyChange(companyId: number) {
        this.companyId = companyId
        // if (companyId) {
        //     this.modelService
        //         .fetchByCompanyId(companyId)
        //         .pipe(first())
        //         .subscribe((res) => {
        //             res = res.filter((model) => model.groupModelId != model.modelId)
        //             this.models = res.map((model) => {
        //                 return { value: model.modelId, text: model.modelName }
        //             })
        //             this.models.unshift(allSelectOption())
        //         })
        // } else {
        //     this.models = [allSelectOption()]
        // }
    }

    public get displayTyre(): boolean {
        const value = this.selectedCategory === ItemType.Tyre || this.selectedCategory === ItemType.RimWithTyre ? true : false
        return value
    }

    public get displayRim(): boolean {
        const value = this.selectedCategory == ItemType.Rim || this.selectedCategory === ItemType.RimWithTyre ? true : false
        return value
    }

    categoryChanged(f: number) {
        this.menuOptions = []
        this.selectedCategory = f
        if (this.selectedCategory === 3 || this.selectedCategory === 7) {
            this.menuOptions.push({ menuId: 1, menu: 'Добави Гума' })
        }
        if (this.selectedCategory === 4 || this.selectedCategory === 7) {
            this.menuOptions.push({ menuId: 2, menu: 'Добави Джанта' })
        }
        if (this.selectedCategory === 5 || this.selectedCategory === 7) {
            this.menuOptions.push({ menuId: 3, menu: 'Добави Джанта с гума' })
        }

        this.updateData([])
        this.itemType = f
    }

    search() {
        const filter: FilterRimWithTyre = Object.assign({}, this.searchFormModel())
        filter.itemType = this.itemType
        filter.userId = this.user?.userId
        this._autoSearch$.next(filter)
    }

    newTyre(itemType: ItemType) {
        this.type.set(itemType)
        this.$addTyreFlag.set(true)
        // const queryParams = { itemType: itemType, view: 'list' }
        // this.router.navigate(['/data/addTyre'], { queryParams: queryParams })
    }

    moveToPage(event: number) {
        this.currentPage = +event
        goToPosition('top')
    }

    updateData(res: DisplayPartView[]) {
        this.searched = true
        this.allItems.set(res)
        this.currentPage = 1
        if (this.currentId && this.allItems) {
            const index = this.allItems().findIndex((item) => item.id === this.currentId())
            if (index != -1) this.currentPage = Math.floor(index / 10) + 1
        }

        this.numberPages = Math.ceil(this.allItems.length / 10)
        if (this.currentId) {
            goToPosition(this.currentId())
        } else {
            this.goTop()
        }
    }

    getNumberPages() {
        return this.numberPages
    }

    getValue(userCount: UserCount) {
        return userCount.rimWithTyreCount + userCount.tyreCount + userCount.rimCount
    }

    actionItem(event: DealerActionType) {
        if (event.action === UpdateEnum.Delete) {
            this.deleteTyre(event.id!)
        } else if (event.action === UpdateEnum.Update) {
            this.updateTyreFunc(event.id!)
        }
    }

    updateTyreFunc(tyreId: number) {
        this.router.navigate(['data/updateTyre'], { queryParams: { id: tyreId, update: true } })
        this.currentTyreId = tyreId
    }

    //#region Delete Tyre

    deleteTyre(tyreId: number) {
        this.deleteTyreId = tyreId
        this.confirmService.OKCancel('Съобщение', 'Потвърдете изтриването на обявата!').subscribe((result) => {
            if (result === OKCancelOption.OK) {
                this.ok()
            }
        })
    }

    ok() {
        this.currentTyreId = undefined
        const allitems =  [...this.allItems()]
        this.tyreService.deleteItem(this.deleteTyreId!).subscribe({
            next: (res) => {
                if (res) {
                    this.userCountService.refresh()
                    this.popupService.openWithTimeout('Съобщение', 'Обявата е успешно изтрита', 2000).subscribe(() => {
                        this.homeService.deleteItem(this.deleteTyreId!)
                        const find = allitems.findIndex((x) => x.id === this.deleteTyreId)
                        if (find !== -1) {
                            this.allItems.set([...allitems.splice(find, 1)])
                        }
                    })
                }
            },
            error: (error) => {
                this.popupService.openWithTimeout('Съобщение', 'Обявата Не може да бъде изтрита', 2000)
                this.alertService.error(error)
            },
        })
    }

    get searching() {
        return !this.loading() && this.allItems && this.allItems.length === 0
    }

    get noPartsMessage() {
        return this.resultMessage
    }

    get addButtonName() {
        let buttonName = ''
        if (this.itemType === ItemType.Tyre) buttonName = 'гума'
        else if (this.itemType === ItemType.Rim) buttonName = 'джанта'
        else if (this.itemType === ItemType.RimWithTyre) buttonName = 'джанта с гума'
        else if (this.itemType === ItemType.AllTyre) return undefined

        return `Добави ${buttonName}`
    }

    clear() {
        const newvalue = { ...this.inialState, category: this.searchForm.category().value() }
        this.searchFormModel.update((value) => ({ ...value, ...newvalue }))
    }

    action($event: number) {
        switch ($event) {
            case 1:
                this.newTyre(ItemType.Tyre)
                break
            case 2:
                this.newTyre(ItemType.Rim)
                break
            case 3:
                this.newTyre(ItemType.RimWithTyre)
                break
            default:
                throw new Error('Method not implemented.')
        }
    }
    //#endregion
    saved(event: number) {
        this.$addTyreFlag.set(false)
        this.$updateTyreFlag.set(false)
        this.loadTyre(event!)
    }

    back(event: number) {
        if (this.$addTyreFlag() || this.$updateTyreFlag()) {
            this.$addTyreFlag.set(false)
            this.$updateTyreFlag.set(false)
        }
        this.router.navigate(['/data/tyres'])
        this.currentId.set(event)
        goToPosition(event)
    }

    loadTyre(id: number) {
        this.currentId.set(id)
    }

    refreshTyre(item: DisplayPartView) {
        if (!item.id) return;
        item = {...Enrich(item, this.staticSelectionService)}
        const items = [...this.allItems()]
        const index = items.findIndex((x) => x.id === item.id)
        if (index != -1) items[index] = Object.assign({}, item)
        else {
            items.unshift(item)
        }

        this.updateData(items)
        if (item.id) {
            goToPosition(item.id!.toString())
        }
    }
}
