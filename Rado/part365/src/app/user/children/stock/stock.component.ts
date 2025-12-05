import { NgStyle } from '@angular/common'
import { Component, DestroyRef, EventEmitter, OnInit, Optional, Output, ViewChild } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { FormsModule } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { DealerWebPageComponent } from '@app/user/dealerWebPage/dealerWebPage.component'
import { RadioGroupListComponent } from '@components/custom-controls/radioGroupList/radiogrouplist.component'
import { UserViewPartComponent } from '@components/parts/userViewPart/userViewPart.component'
import { ResultComponent } from '@components/result/result.component'
import { DataManager } from '@model/dataManager'
import { ItemType } from '@model/enum/itemType.enum'
import { SearchBy } from '@model/enum/searchBy.enum'
import { SortType } from '@model/enum/sortType.enum'
import { Filter } from '@model/filters/filter'
import { RadioButton } from '@model/radioButton'
import { User } from '@model/user'
import { UserCount } from '@model/userCount'
import { UserView } from '@model/userView'
import { LoggerService } from '@services/authentication/logger.service'
import { HomeService } from '@services/home.service'
import { SearchPartService } from '@services/searchPart.service'
import { UserService } from '@services/user.service'

@Component({
    standalone: true,
    selector: 'app-stock',
    templateUrl: './stock.component.html',
    styleUrls: ['./stock.component.css'],
    imports: [NgStyle, RadioGroupListComponent, FormsModule, ResultComponent, UserViewPartComponent],
})
export default class StockComponent implements OnInit {
    userId = 0
    user?: UserView

    currentId = 0
    defaultType = ItemType.All
    sortType: SortType = SortType.YearAsc
    itemType: ItemType = ItemType.All
    page = 1
    loaded = true
    userCount?: UserCount
    dataManager?: DataManager

    @ViewChild(ResultComponent) result: ResultComponent | undefined
    @Output() type = new EventEmitter<ItemType>()
    radios: RadioButton[] = [
        { label: 'Всички', id: ItemType.All, count: 0 },
        { label: 'Част Кола', id: ItemType.CarPart, count: 0 },
        { label: 'Част Бус', id: ItemType.BusPart, count: 0 },
        { label: 'Коли на части', id: ItemType.OnlyCar, count: 0 },
        { label: 'Бус на части', id: ItemType.OnlyBus, count: 0 },
        { label: 'Гуми', id: ItemType.Tyre, count: 0 },
        { label: 'Джанта', id: ItemType.Rim, count: 0 },
        { label: 'Джанта с гума', id: ItemType.RimWithTyre, count: 0 },
    ]
    id?: number
    displayRatio: RadioButton[] = []
    constructor(
        private userService: UserService,
        private activeRoute: ActivatedRoute,
        private router: Router,
        private searchPartService: SearchPartService,
        private homeService: HomeService,
        private destroyRef: DestroyRef,
        public loggerService: LoggerService,
        @Optional() public parent: DealerWebPageComponent
    ) {
      this.user = parent?.user
      this.userId = this.user?.userId ?? 0;
      if (this.homeService.getDataManager(+this.userId)) {
        this.dataManager = this.homeService.getDataManager(+this.userId);
        this.userCount = this.dataManager?.userCount 
        this.updateCount();
      }
    }

    ngOnInit() {
        this.activeRoute.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
            const itemType = params['itemType']
            if (itemType) this.itemType = +itemType

            this.userId = params['userId']

            const page = params['page']
            if (page) this.page = +page

            if (params['currentId']) this.currentId = +params['currentId']

            if (!this.homeService.getDataManager(+this.userId)) {
                const filter: Filter = { id: 0, userId: this.userId, searchBy: SearchBy.Filter, bus: -1 }
                filter.userId = this.userId
                this.searchPartService
                    .search(filter)
                    .pipe(takeUntilDestroyed(this.destroyRef))
                    .subscribe({
                        next: (res) => {
                            this.homeService.addDataManager(this.userId!, res)
                            this.dataManager = this.homeService.getDataManager(this.userId!)
                            this.userCount = this.dataManager?.userCount
                            if (res.userView) {
                                this.user = { ...res.userView }
                                this.loadUser(this.user)
                            }
                            if (res.userCount) {
                                this.userCount  = res.userCount
                                this.updateCount()
                            }
                        },
                        error: (error) => {
                            this.loggerService.logError(error)
                            return
                        },
                        complete: () => {
                            this.loaded = true
                            return
                        },
                    })
            }

            //goTop()
        })
    }

    back(id: number) {
        this.id = id
        this.currentId = 0
        // this.router.navigate(['/dealerwebpage'], { queryParams: { userId: this.userId } })
        // setTimeout(() => {
        //     const element = document.getElementById(`${this.id}`)
        //     // const yOffset = -10;
        //     // const y = element?.getBoundingClientRect().top ?? 0 + window.scrollY + yOffset
        //     if (element) {
        //         element.scrollIntoView({
        //             behavior: 'instant',
        //             block: 'start',
        //             inline: 'nearest',
        //         })
        //     }
        // }, 2000)
    }

    loadUser(user: User) {
        this.user = user
        return
    }

    viewPart(partId: number) {
        this.currentId = partId
        this.router.navigate(['/dealerwebpage/stock'], { queryParams: { userId: this.userId, currentId: this.currentId } })
    }

    changeType(event: ItemType) {
        this.itemType = event
    }

    setCountItems(value?: UserCount) {
        if (value) {
            if (value.total()) this.radios.push({ label: `Всички ${value.total()}` })
            if (value.partCarCount) this.radios.push({ label: `Част Кола ${value.partCarCount}` })
            if (value.partBusCount) this.radios.push({ label: `Част Бус ${value.partBusCount}` })
            if (value.carCount) this.radios.push({ label: `Коли на части ${value.carCount}` })
            if (value.busCount) this.radios.push({ label: `Бус на части ${value.busCount}` })
            if (value.tyreCount) this.radios.push({ label: `Гуми ${value.tyreCount}` })
            if (value.rimCount) this.radios.push({ label: `Джанта ${value.rimCount}` })
            if (value.rimWithTyreCount) this.radios.push({ label: `Джанта с гума ${value.rimWithTyreCount}` })
        }
    }
    updateCount() {
        let count = 0
        this.radios.forEach((item) => {
            switch (item.id) {
                case ItemType.CarPart:
                    item.count = this.userCount?.partCarCount
                    break
                case ItemType.BusPart:
                    item.count = this.userCount?.partBusCount
                    break
                case ItemType.OnlyCar:
                    item.count = this.userCount?.carCount
                    break
                case ItemType.OnlyBus:
                    item.count = this.userCount?.busCount
                    break
                case ItemType.Tyre:
                    item.count = this.userCount?.tyreCount
                    break
                case ItemType.Rim:
                    item.count = this.userCount?.rimCount
                    break
                case ItemType.RimWithTyre:
                    item.count = this.userCount?.rimWithTyreCount
                    break
            }
            if (item.id != ItemType.All) count += item.count ?? 0
        })
        const item = this.radios.find((item) => item.id == ItemType.All)
        if (item) item.count = count

        this.displayRatio = this.radios.filter(item => item.count);
    }

    filterChange(event: number) {
        this.type.emit(event)
        this.itemType = event
        this.router.navigate(['.'], {
            relativeTo: this.activeRoute,
            queryParams: { userId: this.userId, itemType: this.itemType },
        })
    }
    next(id: number) {
        if (this.result?.dataManager) {
            this.result.dataManager._currentId = id
            const dispalyPart = this.result?.dataManager?.next()
            if (dispalyPart) this.currentId = dispalyPart.id!
        }
        this.router.navigate(['/dealerwebpage'], { queryParams: { userId: this.userId, currentId: this.currentId } })
        return
    }
    prev(id: number) {
        if (this.result?.dataManager) {
            this.result.dataManager._currentId = id
            const dispalyPart = this.result?.dataManager?.previous()
            if (dispalyPart) this.currentId = dispalyPart.id!
        }
        return
    }
}
