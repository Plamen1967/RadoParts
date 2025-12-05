//#region import
import { AfterViewInit, Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { NgxGalleryImage } from '@app/ngx-gallery/models/ngx-gallery-image.model'
import { NgxGalleryOptions } from '@app/ngx-gallery/models/ngx-gallery-options.model'
import { BreakpointObserver } from '@angular/cdk/layout'
import { LoadingService } from '@services/loading.service'
import { HelperComponent } from '@components/custom-controls/helper/helper.component'
import { DisplayPartView } from '@model/displayPartView'
import { UserView } from '@model/userView'
import { ItemType } from '@model/enum/itemType.enum'
import { goTop, goToPosition, isMobile, isPart, viberCallRef, viberChatRef } from '@app/functions/functions'
import { ActionType } from '@model/actionType'
import { PartServiceService } from '@services/part/partService.service'
import { CarService } from '@services/car.service'
import { CheckOutService } from '@services/checkOut.service'
import { AuthenticationService } from '@services/authentication/authentication.service'
import { LocalStorageService } from '@services/storage/localStorage.service'
import { HomeService } from '@services/home.service'
import { StaticSelectionService } from '@services/staticSelection.service'
import { TyreService } from '@services/tyre/tyre.service'
import { SearchPartService } from '@services/searchPart.service'
import { UpdateEnum } from '@model/enum/update.enum'
import { NgClass, NgStyle } from '@angular/common'
import { ViberComponent } from '@components/custom-controls/viber/viber.component'
import { PriceComponent } from '@components/custom-controls/price/price.component'
import { TyreViewComponent } from '@components/result/displayPart/tyreView/tyreView.component'
import { ImageComponent } from '@components/custom-controls/image/image.component'
import { AdminPanelComponent } from '@components/custom-controls/admin/adminPanel/adminPanel.component'
import { WhatsComponent } from '@components/custom-controls/whats/whats.component'
import { FavouriteComponent } from '@components/custom-controls/favourite/favourite.component'
import { DealerComponent } from '@components/custom-controls/dealer/dealer.component'
import { PhoneComponent } from '@components/custom-controls/phone/phone.component'
import { Filter } from '@model/filters/filter'
import { PartViewComponent } from './partView/partView.component'
import { ConfirmServiceService } from '@app/dialog/services/confirmService.service'
import { PopUpServiceService } from '@app/dialog/services/popUpService.service'
import { OKCancelOption } from '@app/dialog/model/confirmDialogData'
import { AlertService } from '@services/alert.service'
import { PathService } from '@services/path.service'
//#endregion
//#region component
@Component({
    standalone: true,
    selector: 'app-displaypart',
    templateUrl: './displayPart.component.html',
    styleUrls: ['./displayPart.component.scss'],
    imports: [
    PhoneComponent,
    DealerComponent,
    FavouriteComponent,
    WhatsComponent,
    NgClass,
    AdminPanelComponent,
    ImageComponent,
    ViberComponent,
    PriceComponent,
    PartViewComponent,
    TyreViewComponent,
    NgStyle
],
})

  
//#endregion
export class DisplayPartComponent extends HelperComponent implements OnInit, OnDestroy, AfterViewInit {
    //#region members
    item!: DisplayPartView
    images: NgxGalleryImage[] = []
    isSaved = false
    phone2?: string
    refPhone2?: string
    phone1?: string
    refPhone1?: string
    viber?: string
    whats?: string
    refViberCall?: string
    refViberChat?: string
    phones?: string
    sellerNamePhones?: string
    sellerName?: string
    region?: string
    isMobile?: boolean
    description?: string
    dealer?: boolean
    currency?: string
    user?: UserView
    isAlreadyShown = false
    mobile = false
    closeResult = ''

    nextArrow: boolean | undefined = undefined
    previousArrow: boolean | undefined = undefined
    numberImages?: number
    approvedStatus?: number
    isPart?: boolean
    isTyre?: boolean
    notLoaded = true
    dealerWebPage = false;
    updateId?: number;
    highlighted_?: number;

    @HostListener('click',)
    onclick() {
        // this.view();
    }

    galleryOptions: NgxGalleryOptions[] = [
        {
            width: '300px',
            height: '300px',
            thumbnailsColumns: 4,
        },
    ]
    //#endregion
    //#region Input/Output
    @Input() showPhones = true;
    @Input() checkoutId?: number
    @Input() allowUpdate = true
    @Input() allowBuy = true
    @Input() allowView = true
    @Input() set highlighted(value) {
        this.highlighted_ = value;
    }

    get highlighted() {
        return this.highlighted_
    }
    @Input() set next(value: boolean) {
        if (!value) this.nextArrow = true
        else this.nextArrow = undefined
    }
    @Input() userId?: number
    @Input() query?: number
    @Input() showFavourite = true;
    public show() {
        // console.log(`Party is visible ${this.part.companyName} ${this.part.modelName} ${this.part.modificationName} ${this.part.price}`)
    }


    @Input() set previous(value: boolean) {
        if (!value) this.previousArrow = true
        else this.previousArrow = undefined
    }

    @Input({required: true}) showDealer?: boolean = true;
    @Output() filterByDealer = new EventEmitter<number>()
    @Output() action = new EventEmitter<ActionType>()
    @Output() checkoutUpdated = new EventEmitter()

    @Output() dealerClick: EventEmitter<number> = new EventEmitter<number>()
    @Input() set part(value: DisplayPartView) {
        this.item = value
        this.approvedStatus = this.item.approved
        this.numberImages = this.item.numberImages
        this.isSaved = this.localStorageService.isSaved(this.item.id!)

        this.description = this.item.description
        this.user = this.authernticationService.currentUserValue
        this.currency = this.labels.CURRENCY
        this.dealer = this.item.dealer === 1; // TODO this.item.dealer === 1
        if (this.item.itemType)
            this.isPart = isPart(this.item.itemType);
        this.isTyre = this.item.itemType === ItemType.Tyre || this.item.itemType === ItemType.Rim || this.item.itemType === ItemType.RimWithTyre
        this.isMobile = isMobile()
        this.region = this.getRegion()
        this.phone1 = this.item.sellerPhone
        this.phone2 = this.item.sellerPhone2
        this.viber = this.item.sellerViber
        this.whats = this.item.sellerWhats
        this.refPhone1 = `tel:${this.phone1}`
        this.refPhone2 = `tel:${this.phone2}`
        this.refViberCall = viberCallRef(this.viber ?? '')
        this.refViberChat = viberChatRef(this.viber ?? '')
        this.sellerName = this.item.sellerName
        this.region = this.getRegion()
        this.isMobile = isMobile()
        this.sellerNamePhones = `${this.sellerName} ${this.phones}`
    }
    get part() {
        return this.item;
    }

    get isHeighligthed() {
        return this.highlighted === this.part.id; 
    }
    //#endregion
    //#region ctor
    constructor(
        private authernticationService: AuthenticationService,
        public partService: PartServiceService,
        private carService: CarService,
        private checkoutService: CheckOutService,
        private popupService: PopUpServiceService,
        private localStorageService: LocalStorageService,
        private homeService: HomeService,
        public breakpointObserver: BreakpointObserver,
        private router: Router,
        private staticService: StaticSelectionService,
        private tyreService: TyreService,
        public loadingService: LoadingService,
        public searchPartService: SearchPartService,
        private confirmationService: ConfirmServiceService,
        private alertService: AlertService,
        private pathService: PathService,
        private route: ActivatedRoute
    ) {
        super()
        this.dealerWebPage = this.pathService.userPage;
    }
    ngAfterViewInit(): void {
        if (this.isHeighligthed) goToPosition(this.highlighted )

        return;
    }

    ngOnDestroy(): void {
        this.breakpointObserver.ngOnDestroy()
    }

    ngOnInit() {
        return;
        // this.route.queryParams.pipe().subscribe((params) => {
        // })
        // this.breakpointObserver.observe(['(min-width: 560px)']).subscribe((state: BreakpointState) => {
        //     if (state.matches) {
        //         this.mobile = false
        //     } else {
        //         this.mobile = true
        //     }
        // })
    }
    //#endregion
    //#region Actions
    mainImage($event: NgxGalleryImage) {
        if (this.item) this.item.mainImage = $event
    }

    updateImages($event: NgxGalleryImage[]) {
        this.notLoaded = false
        if (this.item)
        {
            this.item.ngImages = $event
            this.numberImages = this.item.numberImages
        }
    }

    get getNumberImages() {
        if (this.numberImages) {
            if (this.numberImages === 1) return `и ${this.numberImages} снимка`

            return `и ${this.numberImages} снимки`
        }

        return ''
    }
    view() {
        const manager = this.homeService.getDataManager(this.query!)
        if (manager) manager.currentId = this.part.id!
        this.viewItem()
    }

    removeFromCheckOut(event: number) {
        this.checkoutService.updateItems(event)
        // this.checkoutService.removeFromCheckout(this.checkoutId!).subscribe((x) => {
        // })
        this.checkoutUpdated.emit()
    }

    clickedFavourite(event: boolean) {
        const id = this.part.id
        if (event) this.localStorageService.addSavedItem(id!)
        else this.localStorageService.removeSavedItem(id!)
        this.isSaved = this.localStorageService.isSaved(id!)
    }

    //#endregion
    //#region Approved Status
    //#endregion
    //#region get function

    get approved() {
        if (this.authernticationService.admin) return this.part.approved
        if (this.highlighted) return undefined
        return -1
    }

    get sellerWebPage() {
        if (this.item.dealer) {
            const sellerWebPage = this.part.sellerWebPage ? `${this.part.sellerWebPage}` : `/dealerwebpage?userId=${this.item?.userId}`;
            return sellerWebPage;
            }
        return "";
    }
    dealerClicked() {
        const filter: Filter = Object.assign({}, { id: 0, userId: this.item?.userId })
        this.loadingService.open('Зареждане на резултатите')
        this.searchPartService.search(filter).subscribe(
            (res) => {
                this.loadingService.close()
                const dataManager = this.homeService.updateData(res.filter?.id ?? 0, filter)
                dataManager.updateData(res)
                if (dataManager.noParts()) {
                    this.confirmationService.OKCancel('Съобщение', this.labels.NORESULTS);
                } else {
                    if (res.filter?.id) this.router.navigate(['/dealerwebpage'], { queryParams: { query: res.filter.id, userId: this.item?.userId } })
                    else this.router.navigate(['/dealerwebpage'], { queryParams: { userId: this.item?.userId } })
                }
            },
            (error) => {
                this.loadingService.close()
                console.log(error)
            },
            () => {
              return
            }
        )
        // event.stopPropagation();
        // this.filterByDealer.emit(this.part.userId)
    }

    // get engineTypeDesc() {
    //   return this.staticService.engineTypeDescription(this.part?.engineType);
    // }

    // get gearboxDesc() {
    //   return this.staticService.GearboxType.filter(x => x.value === this.part.gearboxType)[0]?.text;
    // }

    getRegion() {
        const region = this.part.partTagsMap?.get("Регион");

        if (region)  
            return region
        return ''
    }

    //#endregion
    //#region dialog
    //#endregion

    filterDealer(event: number) {
        this.filterByDealer.emit(event)
    }

    get canEdit() {
        if (this.allowUpdate == false) return false;
        if (this.pathService.userPage) return false;
        return this.logged && this.authernticationService.currentUserValue?.userId === this.part.userId && !this.userId
    }

    viewItem() {
        goTop()
        this.action.emit({ action: UpdateEnum.View, dispayPartView: this.item })
    }

    updateItem() {
        this.action.emit({ action: UpdateEnum.Update, dispayPartView: this.item })
    }

    change() {
        this.updateItem()
    }

    message?: string = ''

    public get messageM() {
        return this.message
    }
    onDelete(part: DisplayPartView) {
        if (part.itemType === ItemType.OnlyCar) this.message = `Искате ли да изтриете колата?`
        else if (part.itemType === ItemType.CarPart) this.message = `Искате ли да изтриете частта за колата?`
        else if (part.itemType === ItemType.OnlyBus) this.message = `Искате ли да изтриете буса?`
        else if (part.itemType === ItemType.BusPart) this.message = `Искате ли да изтриете частта за буса?`
        else if (part.itemType === ItemType.Tyre) this.message = `Искате ли да изтриете Гумата?`
        else if (part.itemType === ItemType.Rim) this.message = `Искате ли да изтриете Джантата?`
        else if (part.itemType === ItemType.RimWithTyre) this.message = `Искате ли да изтриете Джантата с гума?`

        this.message = `Искате ли да изтриете обявата?`
        this.confirmationService.OKCancel(this.labels.MESSAGE, this.message).subscribe(result => {
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
        this.carService.deleteCar(this.part.id!).subscribe({
            next: () => {
                this.homeService.deleteCar(this.part.id!)
                this.popupService.openWithTimeout(this.labels.MESSAGE, 'Колата е успешно изтрита', 4000)
                this.action.emit({ action: UpdateEnum.Delete, dispayPartView: this.item })
            },
            error: (error) => {
                this.popupService.openWithTimeout(error, this.labels.ERROR)
                this.alertService.error(error)
            },
            complete: () => {
                return
            },
        })
    }

    deletePart() {
        this.partService.deletePart(this.part.id!).subscribe({
            next: () => {
                this.homeService.deletePart(this.part.id!)
                this.popupService.openWithTimeout(this.labels.MESSAGE, 'Частта е успешно изтрита', 4000)
            },
            error: (error) => {
                this.popupService.openWithTimeout(error, this.labels.ERROR)
                this.alertService.error(error)
            },
            complete: () => {
              return
            },
        })
    }

    deleteTyre() {
        if (this.item?.id === undefined) return
        const id = this.item?.id;

        this.tyreService.deleteItem(id).subscribe({
            next: () => {
                this.homeService.deleteCar(id)
                this.popupService.openWithTimeout(this.labels.MESSAGE, 'Гумата е успешно изтрита', 4000)
            },
            error: (error) => {
                this.popupService.openWithTimeout(error, this.labels.ERROR)
                this.alertService.error(error)
            },
            complete: () => {
              return
            },
        })
    }

    updateStatus(event: number) {
        this.part.approved = event
    }

    get admin() {
        return this.authernticationService.admin
    }
}

// @HostListener('document:scroll', ['$event'])
// public onViewportScroll() {
//     // ⤵️ Captures / defines current window height when called
//     const windowHeight = window.innerHeight
//     // ⤵️ Captures bounding rectangle of 5th element
//     const boundingRect = this.elementRef.nativeElement.getBoundingClientRect()
//     // ⤵️ Captures bounding rectangle of 8th element

//     // ⤵️ IF the top of the element is greater or = to 0 (it's not ABOVE the viewport)
//     // AND IF the bottom of the element is less than or = to viewport height
//     // show the corresponding icon after half a second
//     // else hide all icons
//     if (boundingRect.top >= 0 && boundingRect.top <= windowHeight && !this.isAlreadyShown) {
//         this.show()
//         // console.log(`${boundingRect.top}  ${boundingRect.bottom} ${windowHeight}` )

//         this.isAlreadyShown = true
//     }
// }
