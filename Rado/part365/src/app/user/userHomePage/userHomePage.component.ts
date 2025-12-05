//#region imports
import { ViewportScroller } from '@angular/common'
import { AfterViewInit, Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core'
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { NgxGalleryImage } from '@app/ngx-gallery/models/ngx-gallery-image.model'
import { RadioGroupListComponent } from '@components/custom-controls/radioGroupList/radiogrouplist.component'
import { HelperComponent } from '@components/custom-controls/helper/helper.component'
import { ActionType } from '@model/actionType'
import { CountItems } from '@model/countItems'
import { DisplayPartView } from '@model/displayPartView'
import { ItemType } from '@model/enum/itemType.enum'
import { SortType } from '@model/enum/sortType.enum'
import { UpdateEnum } from '@model/enum/update.enum'
import { RadioButton } from '@model/radioButton'
import { UserView } from '@model/userView'
import { HomeService } from '@services/home.service'
import { LoadingService } from '@services/loading.service'
import { PathService } from '@services/path.service'
import { UserService } from '@services/user.service'
import { ImageData } from '@model/imageData'
import { ImageCarouselComponent } from '@components/custom-controls/image-carousel/image-carousel.component'
import { UserHeaderComponent } from '../userHeader/userHeader.component'
import { ImageService } from '@services/image.service'
import { SelectComponent } from '../../components/custom-controls/select-controls/select/select.component'
import { SelectOption } from '@model/selectOption'
import { convertImage, goTop, goToPosition } from '@app/functions/functions'
//#endregion

//#region component

@Component({
    standalone: true,
    selector: 'app-userhomepage',
    templateUrl: './userHomePage.component.html',
    styleUrls: ['./userHomePage.component.css'],
    imports: [ImageCarouselComponent, ReactiveFormsModule, SelectComponent, UserHeaderComponent, RadioGroupListComponent, FormsModule, UserHeaderComponent, SelectComponent],
})
//#endregion
export class UserHomePageComponent extends HelperComponent implements OnInit, AfterViewInit {
    @Input() set countItems(value: CountItems) {
        if (value) {
            if (value.Total()) this.radios.push({ label: `Всички ${value.Total()}` })
            if (value.countCar) this.radios.push({ label: `Част Кола ${value.countCar}` })
            if (value.countBus) this.radios.push({ label: `Част Бус ${value.countBus}` })
            if (value.countCar) this.radios.push({ label: `Коли на части ${value.countCar}` })
            if (value.countCar) this.radios.push({ label: `Бус на части ${value.countCar}` })
            if (value.countTyre) this.radios.push({ label: `Гуми ${value.countTyre}` })
            if (value.countRim) this.radios.push({ label: `Джанта ${value.countRim}` })
            if (value.countTyreWithRim) this.radios.push({ label: `Джанта с гума ${value.countTyreWithRim}` })
        }
    }
    _user: UserView | undefined
    @Input() userId?: number
    @Input() set user(value: UserView | undefined) {
        this._user = value;
        if (value) this.loadUser(value)
    }
    defaultType = ItemType.All

    @Output() type = new EventEmitter<ItemType>()
    radios: RadioButton[] = [
        { label: 'Всички', id: ItemType.All },
        { label: 'Част Кола', id: ItemType.CarPart },
        { label: 'Част Бус', id: ItemType.BusPart },
        { label: 'Коли на части', id: ItemType.OnlyCar },
        { label: 'Бус на части', id: ItemType.OnlyBus },
        { label: 'Гуми', id: ItemType.Tyre },
        { label: 'Джанта', id: ItemType.Rim },
        { label: 'Джанта с гума', id: ItemType.RimWithTyre },
    ]

    @HostListener('window:keydown', ['$event'])
    submitEvent(event: KeyboardEvent) {
        if (event.keyCode === 13) {
            this.goBack()
            event.preventDefault()
        }
    }

    typeForm: FormGroup
    numberParts: number | string = ''

    images?: ImageData[]

    parts: DisplayPartView[] = []
    images2: NgxGalleryImage[] = []
    selectOption: SelectOption[] = []
    constructor(
        private route: ActivatedRoute,
        private homeService: HomeService,
        private router: Router,
        private scroller: ViewportScroller,
        private pathService: PathService,
        private imageService: ImageService,
        public loadingService: LoadingService,
        private userService: UserService,
        private formBuilder: FormBuilder
    ) {
        super()
        this.typeForm = formBuilder.group({
            type: [ItemType.All],
        })

        this.typeForm.controls['type'].valueChanges.subscribe((f) => this.filterChange(f))
    }
    ngAfterViewInit(): void {
        goTop()
    }
    ngOnInit() {
        this.selectOption = this.radios.map((item) => {
            return {
                value: item.id,
                text: item.label,
                displayText: item.label,
                count: undefined,
                color: '',
            }
        })

    }

    get imasgesSrc(): string[] {
        const images: string[] | undefined = this.images?.map((image) => image.imageMinSrc!)
        return images ?? []
    }
    get dataManager() {
        if (this.user?.userId) return this.homeService.getDataManager(this.user.userId)
        return null
    }


    loadUser(user: UserView) {
        this.userId = user.userId
        this.images = user.images
        const images_: NgxGalleryImage[] = []
        this.images?.forEach((image) => {
            const convertedImage = convertImage(image)
            if (convertedImage) {
                images_.push(convertedImage)
            }
        })
        this.images2 = [...images_]
    }
    get currentPage() {
        return this.dataManager?.currentPage
    }
    setCurrentId(event: string) {
        if (this.dataManager) this.dataManager.currentId = +event
        this.positionHome(event)
    }

    filterChange(event: number) {
        this.type.emit(event)
    }
    get currentId() {
        return this.dataManager?.currentId ?? 0
    }
    highlighted(id: number) {
        if (!this.currentId) return false

        return id === this.currentId
    }

    get numberPages() {
        return this.dataManager?.numberPages
    }

    positionHome(id: string): void {
        goToPosition(id)
    }
    get showParts() {
        return this.dataManager?.showParts
    }
    moveToPage($event: number) {
        console.log(`Move to page ${$event}`)

        if (this.dataManager) {
            this.dataManager.currentPage = $event
            this.dataManager.getPageData()
        }
        this.positionHome('top')
    }

    sortDataBy(event: SortType) {
        this.dataManager?.sortData(event)
    }

    goBack() {
        const path = this.pathService.lastPage.find((elem) => elem.includes('/results'))
        if (path) {
            const query = path.substring(path.indexOf('?') + 1)
            const queryParam = query.split('&')
            const param: Record<string, string> = {}
            queryParam.forEach((elem) => {
                const elemParam = elem.split('=')
                param[`${elemParam[0]}`] = elemParam[1]
            })
            const stringify = JSON.stringify(param)
            const object = JSON.parse(stringify)
            if (object.query) {
                if (!object.page) object.page = '1'
                this.router.navigate(['/results'], { queryParams: { query: object.query, page: object.page } })
            }
        }
        // TODO: implement goBack
        // else
        //   // this.location.back();
    }

    action(actionType: ActionType) {
        if (actionType.dispayPartView?.isCar) {
            if (this.dataManager) this.dataManager.currentId = actionType.dispayPartView.id!
            if (actionType.action == UpdateEnum.Update) this.router.navigate(['/data/updateCar'], { queryParams: { userId: `${this.userId}`, carId: `${actionType.dispayPartView.id}` } })
            else if (actionType.action == UpdateEnum.Delete) {
                if (this.dataManager) this.dataManager.delete(actionType.dispayPartView)
            } else if (actionType.action == UpdateEnum.View) {
                this.viewCar(actionType.dispayPartView?.id ?? 0)
            }
        } else {
            if (this.dataManager) this.dataManager.currentId = actionType.dispayPartView?.id ?? 0
            if (actionType.action == UpdateEnum.Update) this.router.navigate(['/data/updatePart'], { queryParams: { userId: `${this.userId}`, partId: `${actionType.dispayPartView?.id}` } })
            else if (actionType.action == UpdateEnum.Delete) {
                if (this.dataManager && actionType.dispayPartView) this.dataManager.delete(actionType.dispayPartView)
            } else if (actionType.action == UpdateEnum.View && actionType.dispayPartView) {
                this.viewPart(actionType.dispayPartView.id ?? 0)
            }
        }
    }

    viewCar(id: number) {
        this.router.navigate([`/part`], { queryParams: { userId: `${this.userId}`, id: `${id}` } })
    }

    viewPart(id: number) {
        this.router.navigate([`/part`], { queryParams: { userId: `${this.userId}`, id: `${id}` } })
    }
}
