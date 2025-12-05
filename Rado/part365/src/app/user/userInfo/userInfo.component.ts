import { NgClass} from '@angular/common'
import { Component, DestroyRef, EventEmitter, Input, Output } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { Router } from '@angular/router'
import { CONSTANT } from '@app/constant/globalLabels'
import { ConfirmServiceService } from '@app/dialog/services/confirmService.service'
import { PopUpServiceService } from '@app/dialog/services/popUpService.service'
import { ButtonMenuComponent } from '@components/custom-controls/buttonMenu/buttonMenu.component'
import { ItemType } from '@model/enum/itemType.enum'
import { Filter } from '@model/filters/filter'
import { User } from '@model/user'
import { UserTrades } from '@model/userTrades'
import { AdminService } from '@services/admin.service'
import { LoggerService } from '@services/authentication/logger.service'
import { HomeService } from '@services/home.service'
import { SearchPartService } from '@services/searchPart.service'
import { UserService } from '@services/user.service'

@Component({
    standalone: true,
    selector: 'app-userinfo',
    templateUrl: './userInfo.component.html',
    styleUrls: ['./userInfo.component.css'],
    imports: [NgClass, ButtonMenuComponent],
})
export class UserInfoComponent {
    @Input() user?: User
    @Input() selected?: number
    @Output() deleteUser: EventEmitter<number> = new EventEmitter<number>()
    @Output() selectUser: EventEmitter<number> = new EventEmitter<number>()
    message?: string
    details?: number = undefined
    userTrades?: UserTrades

    constructor(
        private userService: UserService,
        private router: Router,
        private popService: PopUpServiceService,
        private adminService: AdminService,
        private searchService: SearchPartService,
        private destroyRef: DestroyRef,
        private confirmationService: ConfirmServiceService,
        private homeService: HomeService,
        private loggerService: LoggerService

    ) {}

    showDetails() {
        this.details = !this.details ? this.user?.userId : undefined
        if (!this.userTrades && this.user) this.adminService.getUserStats(this.user.userId!).subscribe((userStats) => (this.userTrades = userStats))

        if (this.user?.userId == this.selected) this.selectUser.emit(undefined)
        else this.selectUser.emit(this.user?.userId)
    }
    view() {
        const address = `/`
        this.router.navigate([address], { queryParams: { userId: this.user?.userId, itemType: ItemType.All } })
    }

    viewPartCars() {
        this.getResults({ userId: this.user?.userId, itemType: ItemType.CarPart, id: Date.now() });
    }

    viewPartBuses() {
        this.getResults({ userId: this.user?.userId, itemType: ItemType.BusPart, bus: 1, id: Date.now() });
    }

    viewCars() {
        this.getResults({ userId: this.user?.userId, itemType: ItemType.OnlyCar, id: Date.now() });
    }

    viewBus() {
        this.getResults({ userId: this.user?.userId, itemType: ItemType.OnlyBus, bus: 1, id: Date.now() });
    }
    viewTyres() {
        this.getResults({ userId: this.user?.userId, itemType: ItemType.Tyre, id: Date.now() });
    }
    viewRims() {
        this.getResults({ userId: this.user?.userId, itemType: ItemType.Rim, id: Date.now() });
    }
    viewRimWithTyres() {
        this.getResults({ userId: this.user?.userId, itemType: ItemType.RimWithTyre, id: Date.now() });
    }

    getResults(filter: Filter) {
        this.searchService.search(filter).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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
                return;
            },
        })

    }
    suspendUser(user: User) {
        this.user = user
        this.adminService.suspendUser(user.userId!).subscribe({
            next: (res) => {
                this.user = {...res }
            },
            error: (error) => {
                this.popService.openWithTimeout(CONSTANT.MESSAGE, `Потребител ${user.userName} - ${user.email} не може да се зампази.` )
                this.loggerService.logError(error);
            },
            complete: () => { return;},
        })
    }
    unSuspendUser(user: User) {
        if (!this.user) return;

        this.adminService.unSuspendUser(user.userId!).subscribe({
            next: (res) => {
                this.user = {...res }
            },
            error: (error) => { 
                this.popService.openWithTimeout(CONSTANT.MESSAGE, `Потребител ${user.userName} - ${user.email} не може да се пусне.` )
                this.loggerService.logError(error);
            },
            complete:() => { return;}
    })
    }

    delete(event: number) {
        this.deleteUser.emit(event)
    }
    showDate(user: User) {
        const date = new Date(user.suspendedDateTime!);

        return date.toString();
    }
    //#endregion

    getModifiedTime(user: User) {
        return user.creationDate;
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
        this.userService.adminActivateUser(userId).subscribe(() => {
            this.popService.openWithTimeout('Съобщение', 'Активационият код е изпратен!', 2000)
        })
    }

    unLockUser(userId: number) {
        this.userService.adminUnLockUser(userId).subscribe(() => {
            this.popService.openWithTimeout('Съобщение', 'Отблокиращият код е изпратен!', 2000)
        })
    }
}
