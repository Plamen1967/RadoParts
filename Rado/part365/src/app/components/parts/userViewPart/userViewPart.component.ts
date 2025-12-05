import { AfterViewInit, Component, DestroyRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core'
import { ActivatedRoute, Params, Router } from '@angular/router'
import { NgxGalleryImage } from '@app/ngx-gallery/models/ngx-gallery-image.model'
import { NgxGalleryOptions } from '@app/ngx-gallery/models/ngx-gallery-options.model'
import { PathService } from '@services/path.service'
import { DisplayPartView } from '@model/displayPartView'
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'
import { ItemType } from '@model/enum/itemType.enum'
import { ImageService } from '@services/image.service'
import { LocalStorageService } from '@services/storage/localStorage.service'
import { HomeService } from '@services/home.service'
import { SearchPartService } from '@services/searchPart.service'
import { NgClass, NgIf, NgStyle } from '@angular/common'
import { TyreService } from '@services/tyre/tyre.service'
import { PartServiceService } from '@services/part/partService.service'
import { CarService } from '@services/car.service'
import { LoginComponent } from '@app/user/login/login.component'
import { ImageData } from '@model/imageData'
import { HelperComponent } from '@components/custom-controls/helper/helper.component'
import { goTop, isMobile, isPart } from '@app/functions/functions'
import { MatDialog } from '@angular/material/dialog'
import { DataRowComponent } from '@components/custom-controls/dataRow/dataRow.component'
import { RequestByEmailComponent } from '@components/custom-controls/requestByEmail/requestByEmail.component'
import { UserCardComponent } from '@components/custom-controls/userCard/userCard.component'
import { ImageCarouselComponent } from '../../custom-controls/image-carousel/image-carousel.component'
import { FavouriteComponent } from '@components/custom-controls/favourite/favourite.component'
import { PopUpServiceService } from '@app/dialog/services/popUpService.service'
import { OKCancelOption } from '@app/dialog/model/confirmDialogData'
import { ConfirmServiceService } from '@app/dialog/services/confirmService.service'
import { AlertService } from '@services/alert.service'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { Filter } from '@model/filters/filter'
import { SearchBy } from '@model/enum/searchBy.enum'
import { UpdateAddComponent } from '@components/updateAdd/updateadd.component'
import { LoggerService } from '@services/authentication/logger.service'
@Component({
    standalone: true,
    selector: 'app-userviewpart',
    templateUrl: './userViewPart.component.html',
    styleUrls: ['./userViewPart.component.css'],
    // changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgIf, DataRowComponent, FavouriteComponent, NgStyle, RequestByEmailComponent, UserCardComponent, NgClass, ImageCarouselComponent, UpdateAddComponent],
})
export class UserViewPartComponent extends HelperComponent implements OnInit, AfterViewInit {
    item?: DisplayPartView
    isSaved = false
    images: ImageData[] = []
    isCar = false
    sent?: boolean
    first?: boolean
    last?: boolean
    isMobile?: boolean
    phones?: string
    size?: number
    modifiedTime?: Date
    description?: string
    phone1?: string
    phone2?: string
    displayValue = 'block'
    message?: string
    viber?: string
    whats?: string
    nextId?: number
    nextPart?: DisplayPartView
    loadingPictures = false
    showRequest?: boolean
    scrollToTopFlag = false
    Breakpoints = Breakpoints
    currentBreakpoint = ''
    loading = false
    nextArrow: boolean | undefined = true
    previousArrow: boolean | undefined = true
    images2: NgxGalleryImage[] = []
    isPart!: boolean
    isTyre!: boolean
    showFavourite = true
    params!: Params
    canEdit = false
    userPage = false
    showNavigation = true
    updateId?: number
    updatedItem?: DisplayPartView = undefined
    galleryOptions: NgxGalleryOptions[] = [
        {
            width: '280px',
            height: '260px',
            thumbnailsColumns: 4,
        },
    ]

    @Input() id!: number
    @Input() userId!: number
    @Input() query!: number
    @Input() set currentViewId(value: number) {
        this.id = value
        this.fetchPart()
    }

    @Input() set next(value: boolean) {
        if (!value) this.nextArrow = true
        else this.nextArrow = undefined
    }

    @Input() set previous(value: boolean) {
        if (!value) this.previousArrow = true
        else this.previousArrow = undefined
    }

    @Input() hideButton = false
    @Input()
    set partView(value: DisplayPartView) {
        if (!value) return

        this.item = value
        this.id = this.item.id!
        this.isPart = isPart(this.item.itemType!)
        this.isTyre = this.item.itemType === ItemType.Tyre || this.item.itemType === ItemType.Rim || this.item.itemType === ItemType.RimWithTyre

        this.isSaved = this.localStorageService.isSaved(this.id!)
    }
    @Output() uncheck: EventEmitter<number> = new EventEmitter<number>()
    @Output() back: EventEmitter<number> = new EventEmitter<number>()
    @Output() highLight: EventEmitter<number> = new EventEmitter<number>()
    @Output() changePrev: EventEmitter<number> = new EventEmitter<number>()
    @Output() changeNext: EventEmitter<number> = new EventEmitter<number>()
    @HostListener('document:keydown', ['$event']) clickout(event: KeyboardEvent) {
        const keyCode = event.keyCode
        if (keyCode === 13) {
            this.goBack()
        } else if (keyCode === 37) {
            this.previousElem()
        } else if (keyCode === 39) {
            this.nextElem()
        }
    }

    constructor(
        private partService: PartServiceService,
        private carService: CarService,
        private imageService: ImageService,
        private localStorageService: LocalStorageService,
        private homeService: HomeService,
        private router: Router,
        private activeRoute: ActivatedRoute,
        private searchService: SearchPartService,
        public breakpointObserver: BreakpointObserver,
        private popupService: PopUpServiceService,
        private tyreService: TyreService,
        public pathService: PathService,
        private matDialog: MatDialog,
        private contirmationService: ConfirmServiceService,
        private searchPartService: SearchPartService,
        private alertService: AlertService,
        public loggerService: LoggerService,
        private destroyRef: DestroyRef
    ) {
        super()
        this.showNavigation = true
        this.userPage = this.pathService.userPage
        if (this.userPage) this.showFavourite = false
        if (pathService.userPage) this.canEdit = false
    }

    ngAfterViewInit(): void {
        goTop()
    }

    get stillLoading() {
        return this.loading || this.loadingPictures
    }

    get currency() {
        return this.labels.CURRENCY
    }
    ngOnInit(): void {
        goTop()
        this.activeRoute.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
            if (params['query']) this.query = +params['query']
            if (params['id']) this.id = +params['id']
            if (params['userId']) this.userId = +params['userId']
            if (params['currentId']) this.id = +params['currentId']
            // if (params.get('id')) {
            //     this.highlighted = +params['id']
            // }

            if (params['updateId']) {
                this.updateId = +params['updateId']
            } else {
                this.updatedItem = undefined
                this.updateId = undefined
            }

            this.sent = undefined
            if (this.updateId) {
                this.searchPartService.getItem(this.updateId).subscribe({
                    next: (part) => {
                        this.updatedItem = part
                    },
                    error: (error) => {
                        this.loggerService.logError(error)
                    },
                })
            } else if (this.query) {
                this.loading = true
                const id = this.query
                if (!this.dataManager || this.dataManager.noParts()) {
                    this.searchService
                        .getSearchResult(+id)
                        .pipe(takeUntilDestroyed(this.destroyRef))
                        .subscribe({
                            next: (result) => {
                                this.homeService.addDataManager(+this.query!, result)
                                const dataManager = this.homeService.getDataManager(+id)
                                if (dataManager) {
                                    dataManager.searchResult = result
                                    dataManager.currentId = this.id!
                                }
                                this.init()
                            },
                            error: (error) => {
                                this.query = 0
                                console.log(error)
                            },
                            complete: () => (this.loading = false),
                        })
                } else {
                    console.log('Cash')
                    this.dataManager.currentId = this.id!
                    this.init()
                }
            } else if (this.userId) {
                this.loading = true
                const id = this.userId
                const filter: Filter = { id: 0, userId: this.userId, searchBy: SearchBy.Filter, bus: -1 }
                if (!this.dataManager || this.dataManager.noParts()) {
                    this.searchService
                        .search(filter)
                        .pipe(takeUntilDestroyed(this.destroyRef))
                        .subscribe({
                            next: (result) => {
                                this.homeService.addDataManager(+this.id!, result)
                                const dataManager = this.homeService.getDataManager(+id)
                                if (dataManager) {
                                    dataManager.searchResult = result
                                    dataManager.currentId = this.id!
                                }
                                this.init()
                            },
                            error: (error) => {
                                this.query = 0
                                console.log(error)
                            },
                            complete: () => (this.loading = false),
                        })
                } else {
                    console.log('Cash')
                    this.dataManager.currentId = this.id!
                    this.init()
                }
            } else if (this.id) {
                this.showNavigation = false
                this.fetchPart()
            } else {
                this.popupService
                    .openWithTimeout('Съобщение', 'Нещо грешно')
                    .pipe(takeUntilDestroyed(this.destroyRef))
                    .subscribe(() => {
                        this.router.navigate(['/'])
                    })
            }
        })
    }

    private fetchPart() {
        if (this.id) {
            this.partService
                .fetchDisplayPartView(this.id!)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe({
                    next: (displayView) => {
                        this.partService.currentPartId = this.id
                        this.item = displayView
                        this.initPart(this.item)
                    },
                    error: (error) => {
                        console.log(error)
                    },
                    complete: () => (this.loading = false),
                })
        }
    }
    private breakpointChanged() {
        if (this.breakpointObserver.isMatched('(min-width: 1200px)')) {
            this.galleryOptions = [
                {
                    width: '360px',
                    height: '315px',
                    thumbnailsColumns: 4,
                },
            ]
            console.log('large')
        } else if (this.breakpointObserver.isMatched('(min-width: 1000px)')) {
            this.galleryOptions = [
                {
                    width: '328px',
                    height: '286px',
                    thumbnailsColumns: 4,
                },
            ]
            console.log('medium')
        } else {
            this.galleryOptions = [
                {
                    width: '282px',
                    height: '261px',
                    thumbnailsColumns: 4,
                },
            ]
        }
    }

    init() {
        this.sent = undefined
        this.images = []
        this.item = this.dataManager?.filterData.find((part) => part.id === +this.id) ?? undefined
        if (!this.item) {
            this.popupService
                .openWithTimeout(this.labels.MESSAGE, 'Частта не е намерена')
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe(() => {
                    this.router.navigate(['/'])
                })
            return
        }
        let index = this.dataManager?.filterData.findIndex((part) => part.id === +this.id)
        if (index === -1 || index === undefined) return

        if (this.dataManager?.filterData.length === 1) {
            this.nextId = -1
        } else if (index + 1 === this.dataManager?.filterData.length) {
            this.nextId = --index
            this.nextPart = this.dataManager?.filterData[this.nextId]
        } else {
            this.nextId = ++index
            this.nextPart = this.dataManager?.filterData[this.nextId]
        }
        if (!this.item) {
            this.partService
                .fetchDisplayPartView(this.id)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe(
                    (res) => {
                        this.initPart(res)
                    },
                    (error) => {
                        console.log(error)
                    },
                    () => (this.loading = false)
                )
        } else {
            this.initPart(this.item)
        }
    }

    positionTest(id: number): void {
        document.getElementById(`${id}`)?.scrollIntoView()
    }

    get price() {
        return this.item?.price?.toString()
    }
    initPart(part: DisplayPartView) {
        this.item = { ...part }
        this.item.companyName = part.companyName
        this.item.modelName = part.modelName
        this.item.modificationName = part.modificationName
        this.isSaved = this.item ? this.localStorageService.isSaved(this.item.id!) : false
        this.isMobile = isMobile()
        if (this.logged && this.authenticationService.currentUserValue?.userId === this.item?.userId) this.canEdit = true

        this.isPart = isPart(this.item.itemType!)
        this.isTyre = this.item.itemType === ItemType.Tyre || this.item.itemType === ItemType.Rim || this.item.itemType === ItemType.RimWithTyre

        this.phone1 = this.item.sellerPhone

        this.phone2 = this.item.sellerPhone2
        this.viber = this.item.sellerViber
        this.whats = this.item.sellerWhats
        this.loading = false

        this.showRequest = this.logged && this.logged.userId != this.item.userId
        if (part.ngImages) this.images2 = [...part.ngImages]
        if (this.dataManager) {
            this.dataManager._currentId = this.item.id
            console.log(`Current id ${this.dataManager?._currentId}`)
        }

        this.first = this.dataManager?.first()
        this.last = this.dataManager?.last()
        console.log(`Position: ${this.showNavigation} ${this.first} ${this.last}`)
    }

    get showRequestEmail() {
        return !this.sent
    }
    get dataManager() {
        if (this.homeService.getDataManager(+this.query!)) return this.homeService.getDataManager(+this.query!)
        else if (this.homeService.getDataManager(this.userId)) return this.homeService.getDataManager(this.userId)

        return undefined
    }

    //#region button actions
    get displayButton() {
        if (this.pathService.userPage) return false
        if (this.hideButton === true) return false
        if (this.query || this.userId || this.id) return true
        return false
    }
    //#endregion

    //#region faviorite
    save() {
        const id = this.id
        this.localStorageService.addSavedItem(id!)
        this.isSaved = this.localStorageService.isSaved(id!)
    }

    unsave() {
        const id = this.id
        this.localStorageService.removeSavedItem(id!)
        this.isSaved = this.localStorageService.isSaved(id!)
        this.uncheck.emit(id)
    }
    //#endregion

    login() {
        // TODO: move to helper
        const loginDialogRef = this.matDialog.open(LoginComponent)
        loginDialogRef
            .afterClosed()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((response) => {
                console.log(response())
            })
    }

    //#region move through list
    previousElem() {
        if (this.dataManager) {
            this.dataManager.currentId = this.id
            const datamanager = this.dataManager
            const part: DisplayPartView | undefined = datamanager?.previous()
            console.log(part)
            this.moveToPart(part!)
        }
        //        this.changePrev.emit(this.id)
    }

    nextElem() {
        if (this.dataManager) {
            this.dataManager.currentId = this.id
            const datamanager = this.dataManager
            const part: DisplayPartView | undefined = datamanager.next()
            console.log(part)
            this.moveToPart(part!)
        }
        //        this.changeNext.emit(this.id)
    }

    moveToPart(part: DisplayPartView) {
        // if (!part) {
        //     return
        // }
        const nextId = part.id

        if (this.userId) this.router.navigate([`/dealerwebpage/stock`], { queryParams: { userId: this.userId, currentId: `${nextId}` } })
        else this.router.navigate([`/viewPart`], { queryParams: { query: `${this.query}`, id: `${nextId}` } })
        // this.router.navigate(["/results"], {queryParams: { query: this.query, currentId: part.id}})
        // this.initPart(part)
        // const address = `/viewPart`
        // if (this.dataManager) this.dataManager.currentId = part.id!
        // if (part.isCar) this.router.navigate([address], { queryParams: { query: `${this.query}`, id: `${part.id}` } })
        // else this.router.navigate([address], { queryParams: { query: `${this.query}`, id: `${part.id}` } })
    }
    //#endregion

    //#region get functions

    //#endregion
    moveToTop() {
        goTop()
    }

    change() {
        this.updatedItem = this.item
        this.router.navigate(['/viewPart'], {
            queryParams: { updateId: this.updatedItem?.id },
            queryParamsHandling: 'merge',
        })

        // this.router.navigate{['/viewPart'], {queryParams: { updateId: actionType.dispayPartView?.id },
        //                     queryParamsHandling: 'merge',
        //                 )}
        // const queryParam: QueryParam = {}
        // let path = '/'
        // if (this.query) queryParam.query = this.query
        // if (this.userId) queryParam.userId = this.userId

        // if (this.item) {
        //     queryParam.viewId = this.item.id
        // }
        // if (this.query && this.item) {
        //     if (this.item.itemType === ItemType.OnlyCar) path = '/data/updateCar'
        //     else if (this.item.itemType === ItemType.OnlyBus) path = '/data/updateBus'
        //     else if (this.item.itemType === ItemType.CarPart || this.item.itemType === ItemType.BusPart) path = '/data/updatePart'
        //     else if (this.item.itemType === ItemType.Tyre || this.item.itemType === ItemType.Rim || this.item.itemType === ItemType.RimWithTyre) path = '/data/updateTyre'
        // }

        // this.router.navigate([path], { queryParams: queryParam })
    }

    onDelete() {
        if (!this.item) return

        if (this.item.itemType === ItemType.OnlyCar) this.message = `Искате ли да изтриете колата?`
        else if (this.item.itemType === ItemType.CarPart) this.message = `Искате ли да изтриете частта за колата?`
        else if (this.item.itemType === ItemType.OnlyBus) this.message = `Искате ли да изтриете буса?`
        else if (this.item.itemType === ItemType.BusPart) this.message = `Искате ли да изтриете частта за буса?`
        else if (this.item.itemType === ItemType.Tyre) this.message = `Искате ли да изтриете Гумата?`
        else if (this.item.itemType === ItemType.Rim) this.message = `Искате ли да изтриете Джантата?`
        else if (this.item.itemType === ItemType.RimWithTyre) this.message = `Искате ли да изтриете Джантата с гума?`

        this.contirmationService
            .OKCancel(this.labels.MESSAGE, this.message!)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((result) => {
                if (result === OKCancelOption.OK) {
                    this.ok()
                }
            })
    }

    ok() {
        if (!this.item) return

        if (this.item.itemType === ItemType.OnlyCar) this.deleteCar()
        else if (this.item.itemType === ItemType.OnlyBus) this.deleteCar()
        else if (this.item.itemType === ItemType.CarPart || this.item.itemType === ItemType.BusPart) this.deletePart()
        else if (this.item.itemType === ItemType.Tyre || this.item.itemType === ItemType.Rim || this.item.itemType === ItemType.RimWithTyre) this.deleteTyre()
    }

    deleteCar() {
        if (!this.item) return
        this.carService
            .deleteCar(this.item.id!)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    if (this.item) this.homeService.deleteCar(this.item.id!)
                    this.popupService
                        .openWithTimeout(this.labels.MESSAGE, 'Колата е успешно изтрита')
                        .pipe(takeUntilDestroyed(this.destroyRef))
                        .subscribe(() => {
                            this.goTo()
                        })
                },
                error: (error) => {
                    console.log(error)
                    this.message = error
                    this.popupService.openWithTimeout(this.labels.ERROR, error)
                },
                complete: () => {
                    return
                },
            })
    }

    deletePart() {
        if (!this.item) return
        this.partService
            .deletePart(this.item.id!)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    if (this.item) this.homeService.deletePart(this.item.id!)
                    this.popupService
                        .openWithTimeout(this.labels.MESSAGE, 'Частта е успешно изтрита')
                        .pipe(takeUntilDestroyed(this.destroyRef))
                        .subscribe(() => {
                            this.goTo()
                        })
                },
                error: (error) => {
                    this.popupService.openWithTimeout(this.labels.ERROR, error)
                    this.alertService.error(error)
                },
                complete: () => {
                    return
                },
            })
    }

    deleteTyre() {
        if (!this.item) return
        this.tyreService
            .deleteItem(this.item.id!)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    if (!this.item) return
                    this.homeService.deleteCar(this.item.id!)
                    this.popupService
                        .openWithTimeout(this.labels.MESSAGE, 'Гумата е успешно изтрита')
                        .pipe(takeUntilDestroyed(this.destroyRef))
                        .subscribe(() => {
                            this.goTo()
                        })
                },
                error: (error) => {
                    this.popupService.openWithTimeout(this.labels.ERROR, error)
                },
                complete: () => {
                    return
                },
            })
    }

    goTo() {
        if (this.nextPart) {
            if (this.nextPart.isCar) {
                this.router.navigate([`/viewPart`], { queryParams: { query: `${this.query}`, id: `${this.nextPart.id}` } })
            } else {
                this.router.navigate([`/viewPart`], { queryParams: { query: `${this.query}`, id: `${this.nextPart.id}` } })
            }
        } else {
            this.router.navigate([`/`])
        }
    }

    goSearch() {
        if (this.dataManager) {
            this.dataManager.submitted = false
            this.dataManager.currentId = 0
            this.homeService.setDataManager(0, this.dataManager)
        }
        if (this.query) this.router.navigate([`/`], { queryParams: { query: this.query } })
        else {
            this.router.navigate([`/`])
        }
    }

    goResult() {
        if (this.dataManager) {
            this.dataManager.currentId = this.item?.id ?? 0
            this.dataManager.displayFilter = false
        }
        this.router.navigate([`/`])
    }

    goBack() {
        if (this.dataManager) {
            this.dataManager.currentId = this.item?.id ?? 0
            this.dataManager.displayFilter = false
        }
        this.back.emit(undefined);
    }
    backEvent() {
        this.updatedItem = undefined
        this.updateId = undefined
    }

    savedEvent(event: number) {
        this.updatedItem = undefined
        this.searchPartService.getItem(event).subscribe({
            next: (part) => {
                this.dataManager?.updateItem(part)
                this.item = { ...part }
            },
            error: (error) => {
                this.loggerService.logError(error)
            },
        })
    } // const value: QueryParam = { userId: this.userId, page: this.dataManager?.currentPage, id: this.item?.id, query: this.query }
    // this.pathService.navigate(value)

    // loadImages(number: number) {
    //     this.images2 = []

    //     if (number) {
    //         this.loadingPictures = true
    //         this.imageService
    //             .getMinImages(this.id!)
    //             .pipe(takeUntilDestroyed(this.destroyRef))
    //             .subscribe(
    //                 (res) => {
    //                     this.images = res
    //                     const images_: NgxGalleryImage[] = []
    //                     this.images.forEach((image) => {
    //                         const convertedImage = convertImage(image)
    //                         if (convertedImage) {
    //                             images_.push(convertedImage)
    //                         }
    //                     })
    //                     this.images2 = [...images_]
    //                     console.log(`Images ${this.images2}`);
    //                     this.loadingPictures = false
    //                 },
    //                 () => {
    //                     return
    //                 },
    //                 () => (this.loadingPictures = false)
    //             )
    //     }
    // }
}
