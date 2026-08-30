//#region import
import { AfterViewInit, Component, DestroyRef, Inject, Input, OnDestroy, OnInit, DOCUMENT, inject, input, output, effect, signal } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { GoTopComponent } from '@components/custom-controls/goTop/goTop.component'
import { NavigatorComponent } from '@app/search/result/navigator/navigator.component'
import { TopBarComponent } from '@components/custom-controls/topBar/topBar.component'
import { HelperComponent } from '@components/custom-controls/helper/helper.component'
import { DisplayPartComponent } from '@app/search/result/displayPart/displayPart.component'
import { ActionType } from '@model/actionType'
import { DataManager } from '@model/dataManager'
import { DisplayPartView } from '@model/displayPartView'
import { ItemType } from '@model/enum/itemType.enum'
import { SearchBy } from '@model/enum/searchBy.enum'
import { SortType } from '@model/enum/sortType.enum'
import { UpdateEnum } from '@model/enum/update.enum'
import { Filter } from '@model/filters/filter'
import { HomeService } from '@services/home.service'
import { SearchPartService } from '@services/searchPart.service'
import { UserService } from '@services/user.service'
import { AlertService } from '@services/alert.service'
import { QueryParam } from '@model/queryParam'
import { PopUpService } from '@app/dialog/services/popUpService.service'
import { SaveSearchService } from '@services/saveSearch.service'
import { MatDialog } from '@angular/material/dialog'
import { FilterComponent } from '@components/custom-controls/filter/filter.component'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { PartServiceService } from '@services/part/partService.service'
import { LoggerService } from '@services/authentication/logger.service'
import { goTop, goToPosition } from '@app/functions/functions'
import { UpdateAddComponent } from '@components/updateAdd/updateadd.component'
//#endregion
//#region component
@Component({
    selector: 'app-result',
    templateUrl: './result.component.html',
    styleUrls: ['./result.component.scss'],
    imports: [NavigatorComponent, TopBarComponent, DisplayPartComponent, GoTopComponent, UpdateAddComponent],
})
//#endregion
export class ResultComponent extends HelperComponent implements OnInit, OnDestroy, AfterViewInit {
    //#region variables and services
    id = input<number>()
    @Input() set currentId(value: number) {
        this.highlighted = value
    }
    sortType = input<SortType>(SortType.YearAsc)
    hasSort = input<boolean>(true)
    showPhones = input<boolean>(true)
    showFavourite = input<boolean>(true)
    showDealer = input<boolean>(true)
    query = input<number | undefined>()
    userId = input<number | undefined>()
    page = input<number>(1)

    @Input() set itemType(value: ItemType) {
        this.type = value
        this.changeType(value)
    }
    viewPart = output<number>()
    pageChanged = output<number>()

    private homeService: HomeService = inject(HomeService)
    private route: ActivatedRoute = inject(ActivatedRoute)
    private userService: UserService = inject(UserService)
    private popupService: PopUpService = inject(PopUpService)
    private searchPartService: SearchPartService = inject(SearchPartService)
    private partService: PartServiceService = inject(PartServiceService)
    private router: Router = inject(Router)
    private saveSearches: SaveSearchService = inject(SaveSearchService)
    private alertService: AlertService = inject(AlertService)
    public loggerService: LoggerService = inject(LoggerService)
    public dialog: MatDialog = inject(MatDialog)
    @Inject(DOCUMENT) document: Document = inject(DOCUMENT)
    private destroyRef: DestroyRef = inject(DestroyRef)
    loading = signal(false)
    type = ItemType.AllCarAndPart
    allParts: DisplayPartView[] = []
    parts: DisplayPartView[] = []
    numberPages = signal(0)
    pageMessage?: string
    currentPage?: number
    scrollToTopFlag = false
    notPositioned?: boolean
    dataManager?: DataManager
    highlighted = 0
    updateItem?: DisplayPartView
    updateId?: number
    filters: { id: number; text: string }[] = []
    page_ = 1
    userId_?: number
    sortType_: SortType = SortType.YearAsc

    //#endregion

    constructor() {
        super()

        effect(() => {
            console.log(`ResultComponent: query() : ${this.query()}`)
            this.query()
            this.page()
            if (this.query()) {
                console.log(`Value page: ${this.page()}`)
                if (this.page()) this.updateManagerFromQuery()
                else
                    this.router.navigate(['/results'], {
                        queryParams: { page: 1 },
                        queryParamsHandling: 'merge',
                    })
            } else if (this.userId()) {
                this.results()
            }
            this.highlighted = this.id() ?? 0;
        })

        // effect(() => {
        //     this.sortType_ = this.sortType()
        //     this.updateManagerFromQuery()
        // })
    }

    ngOnInit() {
        this.notPositioned = true
        if (this.userId_) this.userService.userPageObj.next(this.userId_)
        else this.userService.userPageObj.next(0)
        this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params: QueryParam) => {
            console.log(`Params loaded : ${params}`)
            if (params.id) {
                this.highlighted = +params.id
            }

            if (params.updateId) {
                this.updateId = +params.updateId
            } else {
                this.updateId = undefined
                this.updateItem = undefined
            }

            if (params.itemType) this.itemType = +params.itemType

            if (params.id || params.currentId) {
                this.highlighted = this.currentId = params.id ?? params.currentId ?? 0
            } else {
                this.currentId = 0
                this.highlighted = 0
            }

            this.setHighlight(this.highlighted)

            // if (this.updateId) {
            //     this.searchPartService.getItem(this.updateId).subscribe({
            //         next: (part) => {
            //             this.updateItem = part
            //         },
            //         error: (error) => {
            //             this.loggerService.logError(error)
            //         },
            //     })
            // } else {
            //     this.loggerService.logError(`Something wrong in result web page ${params}`)
            //     this.router.navigate(['/'])
            // }
        })
    }

    ngOnDestroy(): void {
        this.userService.userPageObj.next(0)
    }

    ngAfterViewInit() {
        if (this.highlighted) {
            goToPosition(this.highlighted, 0)
//            this.setHighlight(0)
        } else goTop()
        return
    }

    gethighlighted() {
        return this.highlighted
    }

    setHighlight(value?: number) {
        this.highlighted = value ?? 0
        goToPosition(this.highlighted)
    }

    results() {
        this.loading.set(true)
        this.dataManager = this.homeService.getDataManager(0)
        if (this.userId()) {
            this.loadUserParts()
        } else if (this.query()) {
            this.dataManager = this.homeService.getDataManager(+this.query()!)
            if (this.dataManager) {
                this.setHighlight(this.dataManager.currentId)
                this.sortType_ = this.dataManager.searchResult?.filter?.orderBy ?? SortType.PriceAsc
                this.dataManager.currentPage = +this.page()
                this.dataManager.dataSubject.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
                    next: (parts) => {
                        this.parts = parts
                        this.setValues()
                    },
                    error: (error) => {
                        this.loggerService.logError(error)
                        this.showMessageSessionExpired()
                    },
                    complete: () => {
                        this.loading.set(false)
                    },
                })
                this.dataManager.getPageData()
                this.setHighlight(this.highlighted)
            } else {
                this.loadResults()
            }
        }
    }

    showMessageSessionExpired() {
        this.popupService
            .openWithTimeout('Съобщение', 'Сесията Ви изтече', 3000)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.router.navigate(['/'])
            })
    }

    loadResults() {
        this.searchPartService
            .getSearchResult(+this.query()!)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (result) => {
                    if (!result) {
                        this.showMessageSessionExpired()
                        return
                    }

                    this.homeService.addDataManager(+this.query()!, result)
                    this.dataManager = this.homeService.getDataManager(+this.query()!)
                    if (this.dataManager) {
                        this.dataManager.searchResult = result
                        this.sortType_ = this.dataManager.searchResult?.filter?.orderBy ?? SortType.PriceAsc
                        this.dataManager.currentPage = +this.page()
                        this.dataManager.dataSubject.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((parts) => {
                            this.parts = parts
                            this.setValues()
                        })
                        this.dataManager.getPageData()
                        goToPosition(this.highlighted)
                    }
                },
                error: (error) => {
                    this.loggerService.logError(error)
                    this.showMessageSessionExpired()
                },
                complete: () => this.loading.set(false),
            })
    }

    loadUserParts() {
        const filter: Filter = { id: 0, userId: this.userId()!, searchBy: SearchBy.Filter, bus: -1 }
        filter.userId = this.userId()!
        this.dataManager = this.homeService.getDataManager(this.userId()!)
        if (!this.dataManager) {
            this.searchPartService
                .search(filter)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe({
                    next: (res) => {
                        this.homeService.addDataManager(this.userId()!, res)
                        this.dataManager = this.homeService.getDataManager(this.userId()!)
                        this.showData()
                    },
                    error: (error) => {
                        this.loggerService.logError(error)
                        this.loggerService.logError(error)
                    },
                    complete: () => {
                        this.loading.set(false)
                    },
                })
        } else {
            this.showData()
            this.setHighlight(this.dataManager._currentId)
        }
    }

    showData() {
        if (this.dataManager) {
            this.dataManager.sortData(0)
            this.dataManager.showParts = true
            this.parts = this.dataManager.pageParts ?? []
            this.allParts = this.parts
            if (this.highlighted) this.dataManager.currentId = this.highlighted
            else if (this.dataManager.currentId) this.currentId = this.dataManager.currentId
            this.setValues()
            if (this.partService.currentPartId) {
                this.setCurrentId(this.partService.currentPartId)
            }
            this.dataManager.setFilterType(this.type)
            this.dataManager.getPageData()
            goToPosition(this.highlighted)
        }
    }
    get hasParts() {
        const has = this.parts && this.parts.length
        return has
    }
    setValues() {
        const id = this.query() ?? this.userId()
        if (!id) return
        const dataManager = this.homeService.getDataManager(+id)
        this.allParts = this.parts
        this.currentId = dataManager?.currentId ?? 0
        this.parts = dataManager?.pageParts ?? []
        this.numberPages.set(dataManager?.numberPages ?? 0)
        this.pageMessage = `${dataManager?.currentPage} от ${dataManager?.numberPages}`
        this.currentPage = dataManager?.currentPage
        this.loading.set(false)
        goTop()
    }

    sortData(event: SortType) {
        if (this.dataManager) {
            this.dataManager.sortData(event)
            this.currentPage = 1
            this.dataManager.currentPage = 1
            this.dataManager.getPageData()
            this.changeType(this.type)
        }
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
            disableClose: true,
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
        dialogRef
            .afterClosed()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((result) => {
                if (result) {
                    this.router.navigate(['/results'], { queryParams: { query: `${result}` } })
                }
                this.alertService.info(`Dialog result: ${result}`)
            })
    }

    //#region moving through pages
    click(event: number) {
        if (!this.dataManager) return

        this.dataManager.currentPage = event + 1
        this.moveToPage(this.dataManager.currentPage)
    }

    moveToPage(event: number) {
        if (this.dataManager) {
            this.dataManager.currentPage = event
            this.currentPage = this.dataManager.currentPage
            if (this.userId()) {
                this.dataManager.getPageData()
                this.parts = this.dataManager.pageParts ?? []
            } else {
                this.router.navigate(['/results'], { queryParams: { query: `${this.query()}`, page: `${event}` } })
            }
        }
        goTop()
        this.pageChanged.emit(event)
    }

    gotoNextPage() {
        if (!this.dataManager) return

        if (this.dataManager?.currentPage + 1 > this.dataManager.numberPages!) return

        this.dataManager.currentId = 0
        this.dataManager.currentPage++
        this.moveToPage(this.dataManager.currentPage)
    }

    gotoPreviousPage() {
        if (!this.dataManager) return

        if (this.dataManager?.currentPage - 1 === 0) return

        this.dataManager.currentId = 0
        this.dataManager.currentPage--
        this.moveToPage(this.dataManager.currentPage)
    }

    get countItems() {
        return this.dataManager?.countItems
    }
    //#endregion

    //#region button action
    filterByDealer(userId: number) {
        if (this.dataManager) this.dataManager.loading = true
        const filter: Filter = {
            id: userId,
        }
        this.homeService.updateData(userId, filter)
    }

    goBack() {
        this.router.navigate([`/`])
    }

    goSearch() {
        if (this.dataManager) {
            this.dataManager.submitted = false
            this.dataManager.currentId = 0
            this.homeService.setDataManager(0, this.dataManager)
        }
        if (this.query) this.router.navigate([`/`], { queryParams: { query: this.query() } })
        else {
            this.router.navigate([`/`])
        }
    }
    //#endregion

    //#region position on current element

    //#endregion

    setCurrentId(event: number) {
        this.currentId = event
    }

    backEvent(event: number) {
        this.updateItem = undefined
        this.updateId = undefined

        this.currentId = event
        this.highlighted = event
        goToPosition(event)
    }
    savedEvent(event: number) {
        this.updateItem = undefined
        this.currentId = event
        this.highlighted = event
        goToPosition(event)
        this.searchPartService.getItem(event).subscribe({
            next: (part) => {
                this.dataManager?.updateItem(part)
                const pageindex = this.parts.findIndex((item) => item.id === part.id)
                if (pageindex != -1) this.parts[pageindex] = { ...part }
            },
            error: (error) => {
                this.loggerService.logError(error)
            },
        })
    }

    //#region action
    action(actionType: ActionType) {
        switch (actionType.action) {
            case UpdateEnum.View:
                this.viewItem(actionType.dispayPartView?.id ?? 0)
                break
            case UpdateEnum.Delete:
                if (this.dataManager && actionType.dispayPartView) this.dataManager.delete(actionType.dispayPartView)
                break
            case UpdateEnum.Update:
                {
                    if (actionType.dispayPartView?.itemType) {
                        this.type = actionType.dispayPartView?.itemType
                        this.router.navigate(['/results'], {
                            queryParams: { updateId: actionType.dispayPartView?.id },
                            queryParamsHandling: 'merge',
                        })
                        this.updateId = actionType.dispayPartView.id
                        this.updateItem = actionType.dispayPartView
                    }
                }
                break
        }
    }

    viewItem(id: number) {
        if (this.userId()) {
            this.viewPart.emit(id)
        } else this.router.navigate([`/viewPart`], { queryParams: { query: `${this.query()}`, id: `${id}` } })
    }
    //#endregion

    changeType(event: ItemType) {
        if (this.dataManager) {
            this.dataManager.setFilterType(event)
            this.dataManager.getPageData()
        }
        this.numberPages.set(this.dataManager?.numberPages ?? 0)
        this.moveToPage(1)
    }
    updateManagerFromQuery() {
        this.dataManager = this.homeService.getDataManager(+this.query()!)

        if (this.page()) this.page_ = +this.page()
        else if (this.dataManager?.currentPage) this.page_ = this.dataManager.currentPage
        else this.page_ = 1
        this.results()
    }
}

//#region Not used

// @HostListener('window:keydown', ['$event'])
// submitEvent(event: KeyboardEvent) {
//     if (event.keyCode === 33) {
//         event.preventDefault()
//         this.gotoPreviousPage()
//     } else if (event.keyCode === 34) {
//         event.preventDefault()
//         this.gotoNextPage()
//     }
// }

//#endregion
