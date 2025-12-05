//#region import
import { DOCUMENT, NgClass, NgStyle } from '@angular/common'
import { AfterViewInit, Component, inject, Inject, OnInit, Renderer2 } from '@angular/core'
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { CONSTANT } from '@app/constant/globalLabels'
import { HelperComponent } from '@components/custom-controls/helper/helper.component'
import { AlertService } from '@services/alert.service'
import { CheckOutService } from '@services/checkOut.service'
import { UserService } from '@services/user.service'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { InputPasswordComponent } from '@components/custom-controls/inputPassword/inputpassword.component'
import { UserComponent } from '@components/custom-controls/user/user.component'
import { PopUpServiceService } from '@app/dialog/services/popUpService.service'
import { ConfirmServiceService } from '@app/dialog/services/confirmService.service'
//#endregion

@Component({
    standalone: true,
    imports: [UserComponent, FormsModule, ReactiveFormsModule, NgClass, RouterLink, NgStyle, InputPasswordComponent],
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
})
export class LoginComponent extends HelperComponent implements OnInit, AfterViewInit {
    showLoginFlag = false
    showLoginType2 = 'password'
    showFlag = false
    type = 'password'
    showFlag2 = false
    type2 = 'password'
    loginFlag = true
    loginForm: FormGroup
    loading = false
    submitted = false
    returnUrl?: string
    message?: string
    display = false
    error: string | undefined = undefined
    autocomplete = 'on'
    phonePattern = /[0-9+\- ()]/
    phoneMin = 10
    phoneMax = 20
    webLogin = false;
    dialogRef?: MatDialogRef<LoginComponent>;

    showLogin() {
        this.showLoginFlag = !this.showLoginFlag
        this.showLoginType2 = this.showLoginFlag ? 'text' : 'password'
        this.renderer.selectRootElement('.passwordLogin').focus()
    }

    click(event: KeyboardEvent) {
        if (event.keyCode === 13) {
            event.stopPropagation()
            event.preventDefault()
            this.onSubmit()
        }
    }
    show() {
        this.showFlag = !this.showFlag
        this.type = this.showFlag ? 'text' : 'password'
        const elem = this.renderer.selectRootElement('.password21')
        elem.focus()
        console.log('#password')
    }

    show2() {
        this.showFlag2 = !this.showFlag2
        this.type2 = this.showFlag2 ? 'text' : 'password'
        const elem = this.renderer.selectRootElement('.password22')
        elem.focus()
    }

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private alertService: AlertService,
        public checkoutService: CheckOutService,
        public userService: UserService,
        private renderer: Renderer2,
        private matDialog: MatDialog,
        private popupService: PopUpServiceService,
        private confirmationService: ConfirmServiceService,
        @Inject(DOCUMENT) private document: Document
    ) {
        super()
        this.loginForm = this.formBuilder.group({
            userName: ['', Validators.required],
            email: ['', Validators.required],
            phone: ['', [Validators.required, Validators.pattern(this.phonePattern), Validators.minLength(this.phoneMin), Validators.maxLength(this.phoneMax)]],
            password: ['', Validators.required],
            confirmPassword: ['', Validators.required],
            dealer: [undefined, Validators.required],
            contract: [false, Validators.requiredTrue],
        })

        if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/'])
        }
        if (this.router.url.includes('/login') || this.router.url.includes('/registration')) {
            this.webLogin = true;
        } else {
            this.dialogRef = inject(MatDialogRef<LoginComponent>);
        }
    }
    keyPress(event: KeyboardEvent) {
        const pattern = this.phonePattern
        const inputChar = String.fromCharCode(+event.key)
        if (event.key != '8' && !pattern.test(inputChar)) {
            event.preventDefault()
        }
    }

    cancel() {
        if (this.webLogin) {
            this.router.navigate(['/'])
        } 
        else this.dialogRef?.close(false);
    }

    ngOnInit() {
        this.controls['userName'].valueChanges.subscribe(() => this.loginForm?.patchValue({ password: '', confirmPassword: '' }))
    }

    ngAfterViewInit() {
        if (this.loginFlag) {
            this.login()
        } else {
            this.register()
        }

        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/'
        this.loginForm.controls['userName'].valueChanges.subscribe((text) => console.log(`User: ${text}`))
        setTimeout(() => {
            const elem = this.document.getElementById('user')
            elem?.focus()
        }, 1000)
    }

    get controls() {
        return this.loginForm.controls
    }

    onUserNameChange() {
        this.controls['password'].setValue('')
    }

    login() {
        this.loginFlag = true
        this.submitted = false
        this.autocomplete = 'on'
        this.controls['email'].clearValidators()
        this.controls['phone'].clearValidators()
        this.controls['confirmPassword'].clearValidators()
        this.controls['dealer'].clearValidators()
        this.controls['contract'].clearValidators()
        for (const key in this.controls) {
            this.loginForm?.controls[key].updateValueAndValidity()
        }
    }

    register() {
        this.loginFlag = false
        this.submitted = false
        this.autocomplete = 'off'
        this.loginForm.reset()
        this.controls['userName'].clearValidators()
        this.controls['email'].setValidators([Validators.required])
        this.controls['phone'].setValidators([Validators.required, Validators.pattern(this.phonePattern), Validators.minLength(this.phoneMin), Validators.maxLength(this.phoneMax)])
        this.controls['password'].setValidators([Validators.required])
        this.controls['confirmPassword'].setValidators([Validators.required])
        this.controls['dealer'].setValidators([Validators.required])
        this.controls['contract'].setValidators([Validators.requiredTrue])
        for (const key in this.controls) {
            this.loginForm?.controls[key].updateValueAndValidity()
        }
    }

    forgottenPassword() {
        this.router.navigate(['/user/recovery'])
    }

    //#region user notActivated

    openErrorUserNotActivateDialog() {
        this.confirmationService.OK(CONSTANT.WARNING, CONSTANT.USERNOTACTIVATED)
    }

    //#endregion

    //#region blocked User
    onBlocked() {
        this.confirmationService.OK(CONSTANT.WARNING, CONSTANT.USERBLOCKED)
    }

    onBlockedUserOk() {
        this.userService.recoverUser(this.controls['userName'].value).subscribe(() => {
            this.message = 'Е-майл е изпратен на Вашият акаунт за отблокиране!'
            this.popupService.openWithTimeout(CONSTANT.MESSAGE, this.message)
        })
    }
    //#endregion

    //#region activate user

    openActivateUser() {
        this.confirmationService.OK(CONSTANT.WARNING, CONSTANT.ACTIVATEUSER)
    }

    //#endregion

    onOk() {
        this.onSubmit()
    }

    onSubmit() {
        this.submitted = true
        this.error = undefined
        // reset alerts on submit
        this.alertService.clear()

        // stop here if form is invalid
        if (this.loginForm?.invalid) {
            return
        }

        this.loading = true
        if (this.loginFlag) {
            this.authenticationService.login(this.controls['userName'].value, this.controls['password'].value).subscribe({
                next: () => {
                    this.checkoutService.getItems()
                    this.loading = false
                    
                    console.log(`Web login: ${this.webLogin}`)
                    if (this.webLogin) {
                        this.router.navigate(['/'])
                    } this.dialogRef?.close(true);
                },
                error: (err) => {
                    this.loading = false
                    this.error = err.error.message
                    console.log(err)
                },
                complete: () => {
                    this.loading = false
                    console.log('message')
                },
            })
        } else {
            this.registerUser()
        }
    }

    registerUser() {
        if (this.controls['contract'].errors) {
            this.error = 'Моля съгласете се с условията!'
        }

        this.error = ''
        this.userService.registerUser(this.loginForm?.value).subscribe({
            next: (message) => {
                this.submitted = false
                this.returnUrl = message.url
                let popumessage = `Регистрацията Ви е успешна! \r\nМоля проверете е-майла си за да активирате акауnта си!`
                if (this.controls['dealer'].value) {
                    popumessage = 'Вие ще бъдете пренасочени да попълните Вашите фирмени детайли!'
                }
                this.popupService.openWithTimeout(CONSTANT.MESSAGE, popumessage).subscribe(() => {
                    if (this.controls['dealer'].value) this.router.navigateByUrl(this.returnUrl!)
                    else {
                        if (this.webLogin) {
                            this.router.navigate(['/'])
                        } else this.matDialog.closeAll()
                    }
                })
            },
            error: (error: string) => {
                this.alertService.error(error)
                if (error == CONSTANT.USERFOUND) {
                    this.error = CONSTANT.USERALREADYEXIST
                } else {
                    this.error = error
                }
                this.loading = false
            },
            complete: () => {
                this.loading = false
                console.log('Complete')
            },
        })
    }
    get buttonName() {
        if (this.loginFlag == true) return 'Login'

        return 'Register'
    }

    get passwordRandom() {
        return 'password' + Date.now()
    }
    get password2Random() {
        return 'password2' + Date.now()
    }
    get userNameRandom() {
        return 'userName' + Date.now()
    }
    get emailRandom() {
        return 'email' + Date.now()
    }
    get phoneRandom() {
        return 'phone' + Date.now()
    }
}
