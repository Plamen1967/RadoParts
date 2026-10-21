//#region import
import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild, DOCUMENT, inject, input, signal, computed, effect } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { HelperComponent } from '@components/custom-controls/helper/helper.component'
import { StaticSelectionService } from '@services/staticSelection.service'
import { CarFilterComponent } from '../filters/part/carfilter.component'
import { AppComponent } from '@components/app/app.component'
import { CheckOutService } from '@services/checkOut.service'
import { LocalStorageService } from '@services/storage/localStorage.service'
import { HomeService } from '@services/home.service'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { LoadingService } from '@services/loading.service'
import { CategoryService } from '@services/category-subcategory/category.service'
import { NgClass } from '@angular/common'
import { User } from '@model/user'
import { Dropdown } from '@model/dropDown'
import { PartServiceService } from '@services/part/partService.service'
import { ItemType } from '@model/enum/itemType.enum'
import { CategorySubcategory } from '@model/category-subcategory/categorySubCategory'
import { Filter } from '@model/filters/filter'
import { SearchBy } from '@model/enum/searchBy.enum'
import { Subscription } from 'rxjs'
import { TyreFilterComponent } from '../filters/tyre/tyrefilter.component'
import { TooltipDirective } from '@app/directive/tooltip.directive'
import { GoTopComponent } from '@components/custom-controls/goTop/goTop.component'
import { SelectOption } from '@model/selectOption'
import { goTop, isMobile } from '@app/functions/functions'
import { SearchPartService } from '@services/searchPart.service'
import { ConfirmServiceService } from '@app/dialog/services/confirmService.service'
import { MatDialog } from '@angular/material/dialog'
import { CategoriesMinComponent } from '@components/categoriesMin/categoriesMin.component'
import { FilterComponent } from '@components/custom-controls/filter/filter.component'
import { SaveSearchService } from '@services/saveSearch.service'
//#endregion
//#region component declaration
@Component({
    selector: 'app-home',
    templateUrl: './Home.component.html',
    styleUrls: ['./Home.component.css'],
    imports: [TyreFilterComponent, CarFilterComponent, NgClass, RouterLink, TooltipDirective, GoTopComponent],
})
//#endregion
export class HomeComponent extends HelperComponent implements OnInit, OnDestroy {
    //#region members
    submitElement?: ElementRef<HTMLInputElement>
    displayUser = undefined
    regions?: SelectOption[]
    bodyText = 'test'
    users?: User[]
    showFaviourite = undefined
    dropDown?: Dropdown[]
    selection = input<number>(1)
    extendedSearch_?: boolean
    subscriptions: Subscription[] = []
    currentCategory = undefined
    showCategory = signal<boolean>(true)
    filters: { id: number; text: string }[] = []
    filter: Filter = {
        id: 0,
    }
    readonly message = 'В нашият сайт може да намерите хиляди части от над 1000 дилъра и частни лица!'
    //#endregion

    //#region input/output/view
    // @ViewChild('submit') set buttonElRef(elRef: ElementRef<HTMLInputElement>) {
    //     if (elRef) {
    //         this.submitElement = elRef
    //     }
    // }

    @ViewChild('categoryButton', { static: false }) categoryButton?: ElementRef
    @ViewChild(CarFilterComponent) carFilter!: CarFilterComponent
    @ViewChild(TyreFilterComponent) tyreFilter: TyreFilterComponent | undefined
    @ViewChild(AppComponent) appComponent?: AppComponent
    itemType = input<number | undefined>(undefined)
    userId = input<number | undefined>(undefined)
    query = input<number | undefined>(undefined)
    searchType = input<number>(1)
    formBuilder: FormBuilder = inject(FormBuilder)
    public partService: PartServiceService = inject(PartServiceService)
    public staticSelectionService: StaticSelectionService = inject(StaticSelectionService)
    private checkOutService: CheckOutService = inject(CheckOutService)
    private localStorage: LocalStorageService = inject(LocalStorageService)
    private homeService: HomeService = inject(HomeService)
    private router: Router = inject(Router)
    private route: ActivatedRoute = inject(ActivatedRoute)
    public searchService: SearchPartService = inject(SearchPartService)
    public loadingService: LoadingService = inject(LoadingService)
    private categoryService: CategoryService = inject(CategoryService)
    private matDialog: MatDialog = inject(MatDialog)
    private confirmationService: ConfirmServiceService = inject(ConfirmServiceService)
    private saveSearches: SaveSearchService = inject(SaveSearchService)
    public dialog: MatDialog = inject(MatDialog)
    @Inject(DOCUMENT) private document: Document = inject(DOCUMENT)
    //#endregion

    checoutItems = computed(() => this.checkOutService.checkout());
    showParts = computed(() => {
        if (this.selection())
            return this.selection()
        else 
            return 1;
    })
    //#region constructor
    constructor() {
        super()

        effect(() => {
            console.log(`Selection ShowParts ${this.showParts()}`)
        })
    }

    ngOnDestroy(): void {
        let subscription: Subscription
        for (subscription of this.subscriptions) subscription.unsubscribe()

        this.document.body.style.overflow = ''
    }

    setShowCategory(showCategory: boolean) {
        this.showCategory.set(showCategory)
    }
    ngOnInit() {
        goTop()
        if (this.itemType()) this.setSelection(this.itemType())
    }
    //#endregion

    //this.dataManager?.searchResult?.filterPart?.itemType
    //#region search

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    clickCategory(event: MouseEvent) {
        this.matDialog
            .open(CategoriesMinComponent, {
                data: { drowdown: this.tyreFilter?.categoriesFooter },
                panelClass: 'custom-container',
                height: '100%',
                width: '100%',
            })
            .afterClosed()
            .subscribe((result) => {
                if (result.categoryId || result.subcategoryId) {
                    if (this.tyreFilter) {
                        this.tyreFilter.categoryClick(result.categoryId as ItemType)
                    } else {
                        this.carFilter.showResult(result.categoryId, result.subcategoryId)
                    }
                }
                console.log(result)
            })
        return
    }

    //#endregion

    //#region Checkout

    //#endregion

    focus() {
        //    this.submitElement?.nativeElement.focus();
    }

    //#region events
    changeDropdown(event: Dropdown[]) {
        this.categoryService.setFilterCategories(event)
        this.dropDown = event
    }

    typeClick(select: number) {
        this.router.navigate([`/`], { queryParams: { selection: select}});
        // if (this.selection === selection) return
        // if (this.query()) {
        //     this.router.navigate(['/'])
        // }
        // this.selection = selection
    }

    setSelection(itemType?: ItemType) {
        if (itemType === ItemType.OnlyCar || itemType === ItemType.CarPart || itemType === ItemType.OnlyBus || itemType === ItemType.BusPart || itemType === ItemType.AllCarAndPart) {
        this.router.navigate([`/`]);
        } else if (itemType === ItemType.Rim || itemType === ItemType.Tyre || itemType === ItemType.RimWithTyre || itemType === ItemType.AllTyre) {
        this.router.navigate([`/?selection=2`]);
        }
    }

    onSelection(categorySubcategory: CategorySubcategory) {
        if (!categorySubcategory.categoryId && !categorySubcategory.subcategoryId) return
        this.categoryService.displayCategory = false
        const filter: Filter = Object.assign({ id: 0 }, this.carFilter.carFilterForm().value())
        filter.searchBy = SearchBy.Filter
        filter.extendedSearch = this.extendedSearch_
        filter.selectedCategories = undefined
        filter.categoryId = categorySubcategory.categoryId
        filter.subCategoryId = categorySubcategory.subcategoryId
        filter.partOnly = true
        this.goToResult(filter)
    }

    //#endregion
    goToResult(filter: Filter) {
        this.loadingService.open('Зареждане на резултатите')
        filter.loaded = 0
        console.log("filter", filter)
        this.searchService.search(filter).subscribe({
            next: (res) => {
                const dataManager = this.homeService.updateData(res.filter?.id ?? 0, filter)

                dataManager.updateData(res)
                if (dataManager.noParts()) {
                    this.confirmationService.OK('Съобщение', this.labels.NORESULTS)
                } else {
                    this.router.navigate(['/results'], { queryParams: { query: res.filter!.id, page: 1 } })
                }
            },
            error: (err) => {
                console.log(err)
            },
            complete: () => {
                this.loadingService.close()
            },
        })
    }

    showFilter() {
        const filters: Filter[] = this.saveSearches.getSavedItems()
        this.filters = filters.map((item) => {
            return { id: item.id!, text: item.description! }
        })

        // if (filters && filters.length) this.popupService.openWithTimeout('Последният филтър', filters[filters.length - 1]?.description!, 3000)

        const dialogRef = this.dialog.open(FilterComponent, {
            height: '100%',
            width: '100%',
            panelClass: 'custom-container',
            data: {
                data: this.filters,
                userFilter: false,
                groupSelection: true,
                value: undefined,
                multiSelection: false,
                groupDisabled: true,
                placeHolder: 'Избери филтър',
                useFilter: false,
                useLetter: false,
                label: '',
            },
        })
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.router.navigate(['/results'], { queryParams: { query: `${result}` } })
            }
        })
    }
    //#region get
    get admin() {
        return this.authenticationService.admin
    }

    get dataManager() {
        return this.homeService.getDataManager(0)
    }

    get mobile() {
        return isMobile()
    }
    get checkout() {
        return ` ${this.localStorage.items}`
    }

    //#endregion
}
