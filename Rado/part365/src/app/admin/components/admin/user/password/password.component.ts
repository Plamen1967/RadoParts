//#region imports
import { NgClass, NgStyle } from '@angular/common'
import { Component, ElementRef, inject, Input, OnInit, Renderer2 } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { HelperComponent } from '@components/custom-controls/helper/helper.component'
import { ModalService } from '@services/dialog-api/modal.service'
//#endregion
//#region component
@Component({
    selector: 'app-password',
    templateUrl: './password.component.html',
    styleUrls: ['./password.component.css'],
    imports: [NgClass, ReactiveFormsModule, NgStyle],
})
//#endregion
export default class PasswordComponent extends HelperComponent implements OnInit {
    //#region variables and services
    @Input() id?: string
    passwordForm: FormGroup
    submitted = false
    message = 'Паролата успешно е променена!'
    error = ''
    public guid: string | undefined
    autocomplete = 'off'
    showOldPasswordFlag = false
    typeOldPassword = 'password'
    showFlag = false
    type = 'password'
    type2 = 'password'
    showFlag2 = false

    private activatedRoute = inject(ActivatedRoute)
    public router = inject(Router)
    public modalService = inject(ModalService)
    private el = inject(ElementRef)
    private renderer = inject(Renderer2)

    constructor() {
        super()
        const formBuilder = inject(FormBuilder)
        this.passwordForm = formBuilder.group({
            oldPassword: [''],
            password: ['', Validators.required],
            password2: ['', Validators.required],
        })
    }

    ngOnInit() {
        if (!this.id) {
            console.error('modal must have id')
            return
        }

        this.activatedRoute.queryParams.subscribe((params) => {
            this.guid = params['id']
        })
    }

    reset() {
        this.showOldPasswordFlag = false
        this.typeOldPassword = 'password'
        this.showFlag = false
        this.type = 'password'
        this.type2 = 'password'
        this.showFlag2 = false

        this.passwordForm.patchValue({ oldPassword: '', password: '', password2: '' })
        this.submitted = false
        this.error = ''
    }
    open(): void {
        this.reset()
        //document.body.classList.add('jw-modal-open');
    }

    close(): void {
        //document.body.classList.remove('jw-modal-open');
    }

    onOk() {
        this.submitted = true
        if (this.passwordForm.invalid) {
            return
        }

        if (this.passwordForm.controls['password'].value != this.passwordForm.controls['password2'].value) {
            this.error = this.labels.PASSWОRDNOTSAME
        }

        this.authenticationService.updatePassword(this.passwordForm.controls['oldPassword'].value, this.passwordForm.controls['password'].value).subscribe({
            next: () => {
                return
            },
            error: (error) => {
                this.error = error
            },
        })
    }
    cancel() {
        return
    }

    goBack() {
        this.router.navigate(['/'])
    }

    get passwordRandom() {
        return 'password' + Date.now()
    }
    get password2Random() {
        return 'password2' + Date.now()
    }

    get f() {
        return this.passwordForm.controls
    }

    show() {
        this.showFlag = !this.showFlag
        this.type = this.showFlag ? 'text' : 'password'
        this.renderer.selectRootElement('#passwordInput21').focus()
    }

    show2() {
        this.showFlag2 = !this.showFlag2
        this.type2 = this.showFlag2 ? 'text' : 'password'
        this.renderer.selectRootElement('#passwordInput22').focus()
    }

    showOldPassword() {
        this.showOldPasswordFlag = !this.showOldPasswordFlag
        this.typeOldPassword = this.showOldPasswordFlag ? 'text' : 'password'
        this.renderer.selectRootElement('#passwordOldPasswordInput').focus()
    }
}
