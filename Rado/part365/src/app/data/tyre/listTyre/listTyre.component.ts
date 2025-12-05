import { AfterViewInit, Component, DestroyRef, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { Observable, Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators'
import { ActivatedRoute, Router } from '@angular/router'
import { AuthenticatedUser } from '@model/authenticatedUser'
import { HelperComponent } from '@components/custom-controls/helper/helper.component'
import { ItemType } from '@model/enum/itemType.enum'
import { UpdateEnum } from '@model/enum/update.enum'
import { DisplayPartView } from '@model/displayPartView'
import { QueryParam } from '@model/queryParam'
import { RadioButton } from '@model/radioButton'
import { SelectOption } from '@model/selectOption'
import { SearchResult } from '@model/searchResult'
import { FilterRimWithTyre } from '@model/FilterRimWithTyre'
import { SearchPartService } from '@services/searchPart.service'
import { StaticSelectionService } from '@services/staticSelection.service'
import { AuthenticationService } from '@services/authentication/authentication.service'
import { ModelService } from '@services/company-model-modification/model.service'
import { HomeService } from '@services/home.service'
import { LoadingService } from '@services/loading.service'
import { StateService } from '@services/storage/state.service'
import { TyreService } from '@services/tyre/tyre.service'
import { RadioGroupListComponent } from '@components/custom-controls/radioGroupList/radiogrouplist.component'
import { SelectComponent } from '@components/custom-controls/select-controls/select/select.component'
import { AsyncPipe, NgClass, NgStyle } from '@angular/common'
import { NavigatorComponent } from '@components/result/navigator/navigator.component'
import { DealerActionType } from '@model/dealerActionType'
import { Filter } from '@model/filters/filter'
import { PopUpServiceService } from '@app/dialog/services/popUpService.service'
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

@Component({
    standalone: true,
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
    ],
})
export default class ListTyreComponent extends HelperComponent implements OnInit, AfterViewInit {
    searchForm: FormGroup
    user?: AuthenticatedUser
    loading = false
    categories = [
        { value: ItemType.Tyre, text: 'Гуми' },
        { value: ItemType.Rim, text: 'Джанти' },
        { value: ItemType.RimWithTyre, text: 'Джанти с гуми' },
    ]
    models: SelectOption[] = [{ value: 0, text: CONSTANT.ALL }]
    selectedCategory = ItemType.Tyre
    mode: UpdateEnum = UpdateEnum.View
    allItems: DisplayPartView[] = []
    pageItems: DisplayPartView[] = []
    currentId?: number
    currentTyreId?: number
    deleteTyreId?: number
    currentPage = 0
    searched = false
    numberPages = 0
    userId = 0
    companyId?: number
    tyreCompanies: SelectOption[] = []
    boltDistances?: SelectOption[]
    rimCenters?: SelectOption[]
    rimBoltCount?: SelectOption[]
    rimOffset?: SelectOption[]
    rimMaterial?: SelectOption[]
    rimWidth?: SelectOption[]
    tyreWidth?: SelectOption[]
    tyreHeight?: SelectOption[]
    tyreRadius?: SelectOption[]
    regions?: SelectOption[]
    tyreTypes?: SelectOption[]
    inialState?: object
    itemType: ItemType = ItemType.AllTyre
    params?: QueryParam
    userCount$: Observable<UserCount | undefined>

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

    constructor(
        private formBuilder: FormBuilder,
        private searchPartService: SearchPartService,
        public staticSelectionService: StaticSelectionService,
        private authernticationService: AuthenticationService,
        private tyreService: TyreService,
        private homeService: HomeService,
        private popupService: PopUpServiceService,
        private loadingService: LoadingService,
        private modelService: ModelService,
        private stateService: StateService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private confirmService: ConfirmServiceService,
        private alertService: AlertService,
        private userCountService: UserCountService,
        private destroyRef: DestroyRef
    ) {
        super()
        this.searchForm = formBuilder.group({
            category: [ItemType.AllTyre],
            tyreCompanyId: [0],
            tyreWidth: [0],
            tyreHeight: [0],
            tyreRadius: [0],
            tyreType: [0],
            companyId: [0],
            modelId: [0],
            rimWidth: [0],
            rimMaterial: [0],
            rimOffset: [0],
            rimBoltCount: [0],
            rimBoltDistance: [0],
            rimCenter: [0],
            regionId: [0],
        })

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
    }
    ngAfterViewInit(): void {
        this.inialState = this.searchForm.value

        this.searchForm.controls['category'].valueChanges.subscribe((f) => this.categoryChanged(f))
        this.searchForm.valueChanges.subscribe(() => {
            this.search()
        })
        this.searchForm.patchValue({ category: this.itemType })

        this.search()
        this.searchForm.controls['companyId'].valueChanges.subscribe((f) => this.onCompanyChange(f))
    }

    ngOnInit() {
        this.currentId = this.stateService.currentId
        this.activatedRoute.queryParams.subscribe((params) => {
            this.params = params
            if (this.params.currentId!) {
                this.currentId = +this.params.currentId
            }
            if (this.params.itemType) {
                this.itemType = this.params.itemType
            }
        })
        this.todos$ = this._autoSearch$.pipe(
            debounceTime(this._debounce),
            distinctUntilChanged(),
            switchMap(() => {
                const filter: Filter = { ...this.searchForm.value }
                filter.itemType = this.itemType
                filter.userId = this.userId
                this.loading = true
                this.resultMessage = ''
                return this.searchPartService.search(filter)
            }),
            takeUntil(this._destroy$)
        )

        this.todos$.subscribe((res) => {
            this.updateData(res.data!)
            goToPosition('data-container')
            this.loading = false
            if (res.data?.length == 0) {
                this.resultMessage = 'Няма намерени гуми/джанти'
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
        this.selectedCategory = f
        this.updateData([])
        this.itemType = f
    }

    search() {
        const filter: FilterRimWithTyre = Object.assign({}, this.searchForm.value)
        filter.itemType = this.itemType
        filter.userId = this.user?.userId
        this._autoSearch$.next(filter)
    }

    newTyre(itemType: ItemType) {
        const queryParams = { itemType: itemType, view: 'list' }
        this.router.navigate(['/data/addTyre'], { queryParams: queryParams })
    }

    getPageData(): DisplayPartView[] {
        return this.allItems.slice((this.currentPage - 1) * 10, this.currentPage * 10)
    }

    moveToPage(event: number) {
        this.currentPage = +event
        this.pageItems = this.getPageData()
        goToPosition('top')
    }

    updateData(res: DisplayPartView[]) {
        this.searched = true
        this.allItems = res
        this.currentPage = 1
        if (this.currentId && this.allItems) {
            const index = this.allItems.findIndex((item) => item.id === this.currentId)
            if (index != -1) this.currentPage = Math.floor(index / 10) + 1
        }

        this.pageItems = this.getPageData()
        this.numberPages = Math.ceil(this.allItems.length / 10)
        if (this.currentId) {
            goToPosition(this.currentId!)
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
            this.updateTyre(event.id!)
        }
    }

    updateTyre(tyreId: number) {
        this.router.navigate(['data/updateTyre'], { queryParams: { id: tyreId } })
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
        this.tyreService.deleteItem(this.deleteTyreId!).subscribe({
            next: (res) => {
                if (res) {
                    this.userCountService.refresh()
                    this.popupService.openWithTimeout('Съобщение', 'Обявата е успешно изтрита', 2000).subscribe(() => {
                        this.homeService.deleteItem(this.deleteTyreId!)
                        const find = this.allItems.findIndex((x) => x.id === this.deleteTyreId)
                        if (find !== -1) {
                            this.allItems.splice(find, 1)
                            this.pageItems = this.getPageData()
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
        return !this.loading && this.allItems && this.allItems.length === 0
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
        const value = { ...this.inialState, category: this.searchForm.controls['category'].value }
        this.searchForm.setValue(value)
    }

    //#endregion
}
