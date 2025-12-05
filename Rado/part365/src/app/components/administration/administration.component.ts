import { Component, DestroyRef, OnInit } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { FormsModule } from '@angular/forms'
import { Router } from '@angular/router'
import { OKCancelOption } from '@app/dialog/model/confirmDialogData'
import { ConfirmServiceService } from '@app/dialog/services/confirmService.service'
import { PopUpServiceService } from '@app/dialog/services/popUpService.service'
import { UserInfoComponent } from '@app/user/userInfo/userInfo.component'
import { HelperComponent } from '@components/custom-controls/helper/helper.component'
import { User } from '@model/user'
import { AdminService } from '@services/admin.service'
import { UserService } from '@services/user.service'
import { Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'

@Component({
    standalone: true,
    selector: 'app-administration',
    templateUrl: './administration.component.html',
    styleUrls: ['./administration.component.css'],
    imports: [UserInfoComponent, FormsModule],
})
export default class AdministrationComponent extends HelperComponent implements OnInit {
    constructor(
        private userService: UserService,
        private router: Router,
        private confirmationService: ConfirmServiceService,
        private popupService: PopUpServiceService,
        private adminService: AdminService,
                private destroyRef: DestroyRef
    ) {
        super()
    }

    users?: User[]
    allUsers?: User[]
    message?: string
    deletedUserId?: number
    search = ''
    selected?: number
    searchSubject: Subject<string> = new Subject<string>()
    ngOnInit() {
        this.getUsers()
        this.searchSubject
            .pipe(debounceTime(500), distinctUntilChanged())
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((searchCriteria) => {
                this.users = this.allUsers?.filter((x) => {
                    return (
                        x.userName?.toUpperCase().includes(searchCriteria.toUpperCase()) ||
                        x.companyName?.toUpperCase().includes(searchCriteria.toUpperCase()) ||
                        x.email?.toUpperCase().includes(searchCriteria.toUpperCase())
                    )
                })
            })
    }

    getUsers() {
        this.userService.getAll()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
            next: (users) => {
                this.allUsers = users.filter((user) => user.dealer != 2)
                this.users = this.allUsers
            },
        })
    }
    //#region View ads
    deleteUser(event: number) {
        this.deletedUserId = +event
        const user = this.users?.find((user) => user.userId === this.deletedUserId)
        this.message = `Искате ли да изтриете потребител: ${user?.userName}?`
        this.confirmationService.OKCancel(this.labels.WARNING, this.message)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((result) => {
            if (result === OKCancelOption.OK) {
                this.onOk()
            }
        })
    }

    onOk() {
        this.userService.adminDeleteUser(this.deletedUserId!).subscribe({
            next: (message: string) => {
                this.message = message
                this.popupService.openWithTimeout(this.labels.MESSAGE, message)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe(() => {
                    this.getUsers()
                })
            },
            error: (error) => {
                console.log(error)

                this.message = error
                this.popupService.openWithTimeout(this.labels.ERROR, error)
                this.getUsers()
            },
            complete: () => {
                return
            },
        })
    }

    click() {
        return
    }

    filterChanged() {
        this.searchSubject.next(this.search)
    }

    selectUser($event: number) {
        this.selected = $event
    }
}
