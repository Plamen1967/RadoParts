//#region imports
import { NgStyle } from '@angular/common'
import { AfterViewInit, Component, inject } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { HelperComponent } from '@components/custom-controls/helper/helper.component'
import { InputComponent } from '@components/custom-controls/input/input.component'
import { SelectComponent } from '@components/custom-controls/select-controls/select/select.component'
import { UserType } from '@model/enum/userType.enum'
import { SelectOption } from '@model/selectOption'
import { User } from '@model/user'
import { AdminService } from '@services/admin.service'
import { AlertService } from '@services/alert.service'
import { StaticSelectionService } from '@services/staticSelection.service'
import { UserService } from '@services/user.service'
//#endregion
//#region component
@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css'],
    imports: [InputComponent, ReactiveFormsModule, NgStyle, SelectComponent],
})
//#endregion

export default class UserComponent extends HelperComponent implements AfterViewInit {
    //#region services and variables
    users?: User[]
    userForm: FormGroup
    public user?: User
    submitted = false
    regions?: SelectOption[] = []
    //#region services
    private userService: UserService
    private alerService: AlertService
    public staticSelectionService: StaticSelectionService
    public adminService: AdminService
    formBuilder: FormBuilder
    private router: Router
    //#endregion
    //#endregion
    constructor() {
        super()
        //#region inject services 
        this.userService = inject(UserService)
        this.alerService = inject(AlertService)
        this.staticSelectionService = inject(StaticSelectionService)
        this.adminService = inject(AdminService)
        this.formBuilder = inject(FormBuilder)
        this.router = inject(Router)
        // #endregion

        this.regions = [...this.staticSelectionService.Region]
        this.userService.getAll().subscribe((users) => (this.users = users))

        this.userForm = this.formBuilder.group({
            users: [''],
            userName: ['', [Validators.maxLength(50), Validators.required]],
            companyName: ['', [Validators.maxLength(50)]],
            firstName: ['', [Validators.maxLength(50)]],
            fatherName: ['', [Validators.maxLength(50)]],
            lastName: ['', [Validators.maxLength(50)]],
            street: ['', Validators.required],
            streetNumber: [''],
            floor: ['', Validators.pattern('^[0-9]*$')],
            appartment: [''],
            city: ['', [Validators.maxLength(50)]],
            regionId: ['', [Validators.maxLength(50)]],
            phone: ['', Validators.required],
            phone2: [''],
            email: ['', [Validators.required]],
            webPage: [''],
        })

        this.formGroup = this.userForm
    }

    ngAfterViewInit(): void {
        this.controls['users'].valueChanges.subscribe((userId) => {
            this.user = this.users?.find((user) => (user.userId = userId))
            this.userForm.patchValue(this.user!)
        })
    }

    dealer() {
        return this.user?.dealer === UserType.Dealer
    }

    update() {
        this.submitted = true

        this.alerService.clear()

        if (this.userForm.invalid) {
            return
        }

        this.userService.updateUser(this.userForm.value).subscribe({
            next: (data) => {
                this.alerService.success('Registration sucessful', { result: data })
            },
            error: (error) => {
                this.alerService.error(error)
            },
            complete: () => {
                console.log('Complete')
            },
        })
    }

    recoveryPassword() {
        if (!this.user) return
        this.adminService.recoverPassword(this.user.userId!).subscribe({
            next: (data) => {
                this.alerService.success('Registration sucessful', { result: data })
                this.router.navigate(['/user/updatepassword', { id: data }])
            },
            error: (error) => {
                this.alerService.error(error)
            },
            complete: () => {
                console.log('Complete')
            },
        })
    }
}
