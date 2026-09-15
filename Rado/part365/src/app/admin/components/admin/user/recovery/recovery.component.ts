//#region imports
import { NgClass, NgStyle } from '@angular/common'
import { Component, inject, OnInit, signal } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { form } from '@angular/forms/signals'
import { ActivatedRoute, Router } from '@angular/router'
import { HelperComponent } from '@components/custom-controls/helper/helper.component'
import { UserService } from '@services/user.service'
//#endregion
//#region interface
interface recoveryFormInterface {
    password: '',
    confirmPassword: '',
    userName: '',
}
//#endregion
//#region component
@Component({
    selector: 'app-recovery',
    templateUrl: './recovery.component.html',
    styleUrls: ['./recovery.component.css'],
    imports: [ReactiveFormsModule, NgStyle, NgClass],
})
//#endregion
export default class RecoveryComponent extends HelperComponent implements OnInit {
    recoveryFormModel = signal<recoveryFormInterface>({
        password: '',
        confirmPassword: '',
        userName: '',
    })

    recoveryForm = form(this.recoveryFormModel)
    //#region variables and services
    submitted?: boolean
    error?: string
    id?: string
    account?: string
    message?: string
    title = 'Recovery of account'

    showFlag = false
    type = 'password'
    showFlag2 = false
    type2 = 'password'
    autocomplete = 'nope'
    //#region services
    private router: Router
    private route: ActivatedRoute
    private userService: UserService
    //#endregion
    //#endregion

    constructor() {
        super()
        //#region inject services
        this.router = inject(Router)
        this.route = inject(ActivatedRoute)
        this.userService = inject(UserService)
        //#endregion
    }

    ngOnInit() {
        this.id = this.route.snapshot.queryParamMap.get('id') ?? undefined
        if (this.id) {
            this.title = 'Въведете нова парола'
            this.userService.getAccountByActivationCode(this.id).subscribe((message) => {
                this.account = message.email
            })
        } else {
            this.router.navigate(['/'])
            return
        }

        // setTimeout(() => this.recoveryForm.patchValue({ xxx: '', xxx2: '' }), 200)
    }

    onSubmit() {
        this.onOk()
    }

    show() {
        this.showFlag = !this.showFlag
        this.type = this.showFlag ? 'text' : 'password'
    }

    show2() {
        this.showFlag2 = !this.showFlag2
        this.type2 = this.showFlag2 ? 'text' : 'password'
    }

    onOk() {
        if (!this.id) {
            this.userService.recoverUser(this.recoveryFormModel().userName).subscribe(() => {
                this.message = this.labels.RECOVERYUSER
                setTimeout(() => {
                    this.router.navigate(['/'])
                }, 4000)
            })
        } else {
            this.userService.unLockUser(this.recoveryFormModel().password, this.id).subscribe(() => {
                this.message = 'Акаунта е възстановен!'
                setTimeout(() => {
                    this.router.navigate([`/`])
                }, 2000)
            })
        }
    }

    cancel() {
        this.router.navigate([`/`])
    }
}
