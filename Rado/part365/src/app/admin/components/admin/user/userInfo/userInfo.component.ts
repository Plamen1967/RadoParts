//#region imports
import { NgClass } from '@angular/common'
import { Component, DestroyRef, inject, input, output, effect, computed } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { Router } from '@angular/router'
import { CONSTANT } from '@app/constant/globalLabels'
import { ConfirmServiceService } from '@app/dialog/services/confirmService.service'
import { PopUpService } from '@app/dialog/services/popUpService.service'
import { ButtonMenuComponent } from '@components/custom-controls/buttonMenu/buttonMenu.component'
import { ItemType } from '@model/enum/itemType.enum'
import { Filter } from '@model/filters/filter'
import { User } from '@model/user'
import { UserTrades } from '@model/userTrades'
import { AdminService } from '@app/admin/services/admin.service'
import { LoggerService } from '@services/authentication/logger.service'
import { HomeService } from '@services/home.service'
import { SearchPartService } from '@services/searchPart.service'
import { UserService } from '@services/user.service'
//#endregion
//#region component
@Component({
    standalone: true,
    selector: 'app-userinfo',
    templateUrl: './userInfo.component.html',
    styleUrls: ['./userInfo.component.css'],
    imports: [NgClass, ButtonMenuComponent],
})
//#endregion
export class UserInfoComponent {
    //#region services and variables
    message?: string
    details?: number = undefined
    userTrades?: UserTrades

    user = input<User>()
    selected = input<number>()
    deleteUser = output<number>()
    selectUser = output<number | undefined>()

    user_?: User 
    //#region services
    private userService: UserService
    private router: Router
    private popService: PopUpService
    private adminService: AdminService
    private searchService: SearchPartService
    private destroyRef: DestroyRef
    private confirmationService: ConfirmServiceService
    private homeService: HomeService
    private loggerService: LoggerService
    //#endregion
    //#endregion

    constructor() {
        //#region inject services
        this.userService = inject(UserService)
        this.router = inject(Router)
        this.popService = inject(PopUpService)
        this.adminService = inject(AdminService)
        this.searchService = inject(SearchPartService)
        this.destroyRef = inject(DestroyRef)
        this.confirmationService = inject(ConfirmServiceService)
        this.homeService = inject(HomeService)
        this.loggerService = inject(LoggerService)

        effect(() => {
            this.user_ = computed(() => this.user())()
        })
        //#endregion
    }

    showDetails() {
        const userId = this.user_?.userId ?? undefined;
        this.details = !this.details ? userId : undefined
        if (!this.userTrades && this.user_) this.adminService.getUserStats(userId!).subscribe((userStats) => (this.userTrades = userStats))

        if (userId == this.selected()) this.selectUser.emit(undefined)
        else this.selectUser.emit(userId!)
    }
    view() {
        const address = `/`
        this.router.navigate([address], { queryParams: { userId: this.user_?.userId, itemType: ItemType.All } })
    }

    viewPartCars() {
        this.getResults({ userId: this.user_?.userId, itemType: ItemType.CarPart, id: Date.now() })
    }

    viewPartBuses() {
        this.getResults({ userId: this.user_?.userId, itemType: ItemType.BusPart, bus: 1, id: Date.now() })
    }

    viewCars() {
        this.getResults({ userId: this.user_?.userId, itemType: ItemType.OnlyCar, id: Date.now() })
    }

    viewBus() {
        this.getResults({ userId: this.user_?.userId, itemType: ItemType.OnlyBus, bus: 1, id: Date.now() })
    }
    viewTyres() {
        this.getResults({ userId: this.user_?.userId, itemType: ItemType.Tyre, id: Date.now() })
    }
    viewRims() {
        this.getResults({ userId: this.user_?.userId, itemType: ItemType.Rim, id: Date.now() })
    }
    viewRimWithTyres() {
        this.getResults({ userId: this.user_?.userId, itemType: ItemType.RimWithTyre, id: Date.now() })
    }

    getResults(filter: Filter) {
        this.searchService
            .search(filter)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res) => {
                    const dataManager = this.homeService.updateData(filter.id, filter)

                    dataManager.updateData(res)
                    if (dataManager.noParts()) {
                        this.confirmationService.OK('Съобщение', CONSTANT.NORESULTS)
                    } else {
                        this.router.navigate(['/results'], { queryParams: { query: filter.id, page: 1 } })
                    }
                },
                error: (err) => {
                    console.log(err)
                },
                complete: () => {
                    return
                },
            })
    }
    suspendUser(user: User) {
        this.user_ = {...user}
        this.adminService.suspendUser(user.userId!).subscribe({
            next: (res) => {
                this.user_ = { ...res }
            },
            error: (error) => {
                this.popService.openWithTimeout(CONSTANT.MESSAGE, `Потребител ${user.userName} - ${user.email} не може да се зампази.`)
                this.loggerService.logError(error)
            },
            complete: () => {
                return
            },
        })
    }
    unSuspendUser(user: User) {
        if (!this.user) return

        this.adminService.unSuspendUser(user.userId!).subscribe({
            next: (res) => {
                this.user_ = { ...res }
            },
            error: (error) => {
                this.popService.openWithTimeout(CONSTANT.MESSAGE, `Потребител ${user.userName} - ${user.email} не може да се пусне.`)
                this.loggerService.logError(error)
            },
            complete: () => {
                return
            },
        })
    }

    delete(event: number) {
        this.deleteUser.emit(event)
    }
    showDate(user: User) {
        const date = new Date(user.suspendedDateTime!)

        return date.toString()
    }
    //#endregion

    getModifiedTime(user: User) {
        return user.creationDate
    }

    dealer(dealer: boolean) {
        return dealer ? 'Дилър' : 'Частно лице'
    }
    activated(activated: boolean) {
        return activated ? 'Активиран' : 'Не активиран'
    }

    blocked(blocked: boolean) {
        return blocked ? 'Блокиран' : ''
    }
    activateUser(userId: number) {
        this.adminService.adminActivateUser(userId).subscribe(() => {
            this.popService.openWithTimeout('Съобщение', 'Активационият код е изпратен!', 2000)
        })
    }

    unLockUser(userId: number) {
        this.adminService.adminUnLockUser(userId).subscribe(() => {
            this.popService.openWithTimeout('Съобщение', 'Отблокиращият код е изпратен!', 2000)
        })
    }
}
