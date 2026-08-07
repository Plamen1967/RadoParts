//#region imports
import { AfterViewInit, Component, effect, EventEmitter, HostListener, inject, input, OnInit, output } from '@angular/core'
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { Router } from '@angular/router'
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
import { ImageData } from '@model/imageData'
import { ImageCarouselComponent } from '@components/custom-controls/image-carousel/image-carousel.component'
import { UserHeaderComponent } from '../userHeader/userHeader.component'
import { SelectOption } from '@model/selectOption'
import { convertImage, goTop, goToPosition } from '@app/functions/functions'
import { SelectComponent } from '@components/custom-controls/select-controls/select/select.component'
//#endregion
//#region component
@Component({
    selector: 'app-userhomepage',
    templateUrl: './userHomePage.component.html',
    styleUrls: ['./userHomePage.component.css'],
    imports: [ImageCarouselComponent, ReactiveFormsModule, SelectComponent, UserHeaderComponent, RadioGroupListComponent, FormsModule, UserHeaderComponent, SelectComponent],
})
//#endregion
export class UserHomePageComponent extends HelperComponent implements OnInit, AfterViewInit {
    //#region variables and services
    countItems = input<CountItems>()
    _user: UserView | undefined
    userId = input<number>()
    user = input<UserView | undefined>()

    defaultType = ItemType.All

    type = output<EventEmitter<ItemType>>()
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
    //#region services
    private homeService: HomeService
    private router: Router
    private pathService: PathService
    public loadingService: LoadingService
    private formBuilder: FormBuilder
    //#endregion
    //#endregion

    constructor() {
        super()
        effect(() => {
            this._user = this.user()
            if (this._user) this.loadUser(this._user)

        if (this.countItems()) {
            if (this.countItems()?.Total()) this.radios.push({ label: `Всички ${this.countItems()?.Total()}` })
            if (this.countItems()?.countCar) this.radios.push({ label: `Част Кола ${this.countItems()?.countCar}` })
            if (this.countItems()?.countBus) this.radios.push({ label: `Част Бус ${this.countItems()?.countBus}` })
            if (this.countItems()?.countCar) this.radios.push({ label: `Коли на части ${this.countItems()?.countCar}` })
            if (this.countItems()?.countCar) this.radios.push({ label: `Бус на части ${this.countItems()?.countCar}` })
            if (this.countItems()?.countTyre) this.radios.push({ label: `Гуми ${this.countItems()?.countTyre}` })
            if (this.countItems()?.countRim) this.radios.push({ label: `Джанта ${this.countItems()?.countRim}` })
            if (this.countItems()?.countTyreWithRim) this.radios.push({ label: `Джанта с гума ${this.countItems()?.countTyreWithRim}` })
        }

    })  

        //#region inject services
        this.homeService = inject(HomeService)
        this.router = inject(Router)
        this.pathService = inject(PathService)
        this.loadingService = inject(LoadingService)
        this.formBuilder = inject(FormBuilder)
        //#endregion

        this.typeForm = this.formBuilder.group({
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
        const userId = this.user()?.userId
        if (userId) return this.homeService.getDataManager(userId)
        return null
    }

    loadUser(user: UserView) {
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
