import { AfterViewInit, Component, DestroyRef, Input, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { Location, NgStyle } from '@angular/common'
import { UserType } from '@model/enum/userType.enum'
import { User } from '@model/user'
import { HelperComponent } from '@components/custom-controls/helper/helper.component'
import { StaticSelectionService } from '@services/staticSelection.service'
import { UserService } from '@services/user.service'
import { AlertService } from '@services/alert.service'
import { ImageService } from '@services/image.service'
import { ModalService } from '@services/dialog-api/modal.service'
import { first } from 'rxjs'
import { SelectOption } from '@model/selectOption'
import { ImageData } from '@model/imageData'
import { InputComponent } from '@components/custom-controls/input/input.component'
import { SelectComponent } from '@components/custom-controls/select-controls/select/select.component'
import { TextAreaComponent } from '@components/custom-controls/textArea/textArea.component'
import { UploadComponent } from '@components/custom-controls/upload/upload.component'
import { PictureComponent } from '@components/custom-controls/picture/picture.component'
import { PopUpServiceService } from '@app/dialog/services/popUpService.service'
import { ConfirmServiceService } from '@app/dialog/services/confirmService.service'
import { OKCancelOption } from '@app/dialog/model/confirmDialogData'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'

@Component({
    standalone: true,
    selector: 'app-updateuser',
    templateUrl: './updateUser.component.html',
    styleUrls: ['./updateUser.component.css'],
    imports: [InputComponent, ReactiveFormsModule, SelectComponent, NgStyle, TextAreaComponent, UploadComponent, PictureComponent, UploadComponent, FormsModule],
})
export default class UpdateUserComponent extends HelperComponent implements OnInit, AfterViewInit {
    unamePattern = '^[a-z0-9_-]{8,15}$'
    pwdPattern = ''
    mobnumPattern = '^((\\+91-?)|0)?[0-9]{10}$'
    emailPattern = ''
    userForm: FormGroup
    loading = false
    submitted = false
    dealer?: UserType = UserType.Dealer
    error?: string
    businessCardimage?: ImageData
    images: ImageData[] = []
    image?: ImageData
    message?: string
    user?: User
    firstNameRequired?: string
    companyNameRequired?: string
    initalState?: object
    params?: object
    initialState?: object
    currentImageId?: number
    numberAds?: number
    regions: SelectOption[] = []

    @Input() activationcode!: string
    @Input() userId!: number

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private userService: UserService,
        private alerService: AlertService,
        public staticSelectionService: StaticSelectionService,
        public imageService: ImageService,
        public modalService: ModalService,
        private location: Location,
        private route: ActivatedRoute,
        private popupService: PopUpServiceService,
        private confirmationService: ConfirmServiceService,
        private destroyRef: DestroyRef
    ) {
        super()
        this.regions = [...this.staticSelectionService.Region]
        this.userForm = this.formBuilder.group({
            userName: ['', [Validators.maxLength(50), Validators.required]],
            companyName: ['', [Validators.maxLength(50)]],
            firstName: ['', [Validators.maxLength(50)]],
            fatherName: ['', [Validators.maxLength(50)]],
            lastName: ['', [Validators.maxLength(50)]],
            address: [''],
            city: ['', [Validators.maxLength(50)]],
            regionId: [undefined, Validators.min(1)],
            phone: ['', [Validators.required, Validators.pattern('^[0-9() +-]*$'), Validators.minLength(10), Validators.maxLength(20)]],
            phone2: ['', [Validators.pattern('^[0-9() +-]*$'), Validators.minLength(10), Validators.maxLength(20)]],
            viber: ['', [Validators.pattern('^[0-9() +-]*$'), Validators.minLength(10), Validators.maxLength(20)]],
            whats: ['', [Validators.pattern('^[0-9() +-]*$'), Validators.minLength(10), Validators.maxLength(20)]],
            email: ['', [Validators.required]], //, Validators.pattern(this.unamePattern)
            webPage: [''],
            description: [''],
            imageId: [0],
        })
    }

    ngAfterViewInit(): void {
        if (this.activationcode || this.userId) {
            this.userService
                .loadUserByActivationCode(this.activationcode)
                .pipe(first())
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe((user) => {
                    if (!user) this.router.navigate(['/'])
                    else {
                        this.user = user
                        this.userId = user.userId!
                        this.userForm.patchValue(user)
                        this.dealer = user.dealer
                        if (this.dealer === UserType.Dealer) {
                            this.requiredField(true)
                            this.userForm.controls['companyName'].setValidators(Validators.required)
                            this.userForm.controls['companyName'].updateValueAndValidity()
                        } else {
                            this.requiredField(false)
                            this.userForm.controls['firstName'].setValidators(Validators.required)
                            this.userForm.controls['firstName'].updateValueAndValidity()
                        }
                        this.initialState = this.userForm.value
                    }
                })
        } else if (this.authenticationService.currentUserValue?.userId) {
            this.userService
                .loadCurretUser(this.authenticationService.currentUserValue?.userId)
                .pipe(first())
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe((user) => {
                    this.user = user
                    this.userId = user.userId!
                    this.userForm.patchValue(user)
                    this.dealer = user.dealer
                    if (this.dealer === UserType.Dealer) {
                        this.requiredField(true)
                        this.userForm.controls['companyName'].setValidators(Validators.required)
                        this.userForm.controls['companyName'].updateValueAndValidity()
                        this.userForm.controls['firstName'].clearValidators()
                        this.userForm.controls['firstName'].updateValueAndValidity()
                    } else {
                        this.requiredField(false)
                        this.userForm.controls['firstName'].setValidators(Validators.required)
                        this.userForm.controls['firstName'].updateValueAndValidity()
                        this.userForm.controls['companyName'].clearValidators()
                        this.userForm.controls['companyName'].updateValueAndValidity()
                    }
                    this.initialState = this.userForm.value
                })
        }

        if (this.authenticationService.currentUserValue?.userId) {
            this.imageService
                .getBusinessCardImage(this.authenticationService.currentUserValue.userId)
                .pipe(first())
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe((image) => {
                    this.businessCardimage = image
                    if (this.businessCardimage) this.f['imageId'].setValue(this.businessCardimage?.imageId)
                })

            this.imageService
                .getMinImages(this.authenticationService.currentUserValue.userId)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe((images) => (this.images = images))
        }
    }

    ngOnInit() {
        this.numberAds = this.staticSelectionService.maxNumberParts
        this.userService
            .getNewUserId()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((userId) => (this.userId = userId))
    }

    get f() {
        return this.userForm.controls
    }

    get isDealer() {
        return this.dealer === UserType.Dealer
    }
    get isUser() {
        return this.dealer === UserType.User
    }

    onSubmit() {
        this.submitted = true
        this.alerService.clear()
        this.error = ''
        if (this.userForm.invalid) {
            this.onRequired()
            return
        }

        this.loading = true
        this.userForm.value['userId'] = this.userId
        this.userForm.value['imageId'] = this.businessCardimage?.imageId
        this.userService
            .updateUser(this.userForm.value)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    if (this.authenticationService.currentUserValue) {
                        this.authenticationService.currentUserValue.userName = this.userForm.value.userName
                        this.authenticationService.currentUserValue.regionId = this.userForm.value.regionId
                    }
                    let message: string
                    if (this.activationcode) message = 'Моля активирайте акаунта си чрез изпратеният до Вас е-майл!'
                    else message = 'Потребителя е успешно актуализиран'
                    this.popupService
                        .openWithTimeout(this.labels.MESSAGE, message)
                        .pipe(takeUntilDestroyed(this.destroyRef))
                        .subscribe(() => {
                            this.businessCardimage = undefined
                            this.router.navigate(['/'])
                        })
                },
                error: (error) => {
                    this.alerService.error(error)
                    if (error == this.labels.USERFOUND) {
                        this.error = this.labels.USERALREADYEXIST
                    } else {
                        this.error = error
                    }
                    this.loading = false
                },
                complete: () => {
                    this.loading = false
                },
            })
    }

    updatePassword() {
        // TODO
        throw 'Not implemented'
    }

    //#region View ads
    view() {
        const address = `/user/user`
        this.router.navigate([address], { queryParams: { userId: this.authenticationService.currentUserValue?.userId } })
    }
    //#endregion

    //#region required
    requiredField(dealer: boolean) {
        this.firstNameRequired = !dealer ? '*' : ''
        this.companyNameRequired = dealer ? '*' : ''
    }

    onRequired() {
        this.confirmationService.OK('Съобщение', 'Моля въведете всички задъжителни полета.')
    }
    //#endregion

    //#region images
    imagesAdded(images: ImageData[]) {
        if (images && images.length) {
            images.forEach((image) => this.images.push(image))
            this.popupService.openWithTimeout(this.labels.MESSAGE, 'Снимка(те) са успешно качени', 2000)
        }
    }

    ok() {
        this.imageService
            .deleteImage(this.currentImageId!)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                const index = this.images.findIndex((image) => image.imageId === this.currentImageId)
                if (index != -1) {
                    this.images.splice(index, 1)
                }
                this.popupService.openWithTimeout(this.labels.MESSAGE, 'Снимката е успешно изтрита', 2000)
            })
    }

    deleteImage(image: ImageData) {
        this.currentImageId = image.imageId
        this.confirmationService.OKCancel('Съобщение', ' Потвърдете изтриването на снимката!')
    }
    //#endregion

    //#region Private Dealer
    addBusinessCard(image: ImageData[]) {
        if (image === null) {
            this.businessCardimage = undefined
            this.f['imageId'].setValue(0)
        } else {
            this.businessCardimage = image[0]
            this.f['imageId'].setValue(this.businessCardimage?.imageId)
        }
    }

    deleteBusinessCard() {
        this.message = 'Моля потвърдете изтриването на бизнес картата'
        this.confirmationService
            .OKCancel(this.labels.MESSAGE, this.message)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((result) => {
                if (result === OKCancelOption.OK) {
                    this.onBusinessOk()
                }
            })
    }
    onBusinessOk() {
        this.imageService
            .deleteBusinessCardImage()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.businessCardimage = undefined
                this.popupService.openWithTimeout(this.labels.MESSAGE, 'Бизнес картата успещно е изтрита', 2000)
            })
    }

    //#endregion

    //#region Delete User
    onDelete() {
        this.message = `Do you want to delete your account.`
        this.confirmationService
            .OKCancel(this.labels.MESSAGE, this.message)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((result) => {
                if (result === OKCancelOption.OK) {
                    this.onDeleteOk()
                }
            })
    }

    onDeleteOk() {
        if (!this.user) return
        this.userService
            .deleteUser(this.user.userId!)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (message) => {
                    this.message = message
                    this.popupService.openWithTimeout(this.labels.MESSAGE, message, 4000).subscribe(() => {
                        this.authenticationService.logout()
                        this.router.navigate(['/'])
                    })
                },
                error: (error) => {
                    this.message = error
                    this.popupService.openWithTimeout(this.labels.MESSAGE, this.message!, 2000)
                },
                complete: () => {
                    return
                },
            })
    }

    //#endregion

    //#region logout
    onLogout() {
        this.confirmationService
            .OKCancel(this.labels.WARNING, 'Искате ли да излезете?', 'Излез', 'Откаже')
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((result) => {
                if (result === OKCancelOption.OK) {
                    this.onLoginOk()
                }
            })
    }
    onLoginOk() {
        this.router.navigate(['/'])
    }
    //#endregion

    //#region PrivateDealer
    userPrivate() {
        this.message = `div class='row'>Внимание! Само Вашите последни ${this.numberAds} ще бъдат запазени!</div>
    <div class="row justify-content-center">Искате ли да станете часно лице?</div>`

        this.confirmationService
            .OKCancel(this.labels.WARNING, this.message, 'Потвърди', 'Откаже')
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((result) => {
                if (result === OKCancelOption.OK) {
                    this.onDealerOk()
                }
            })
    }

    onPrivateOk() {
        this.userService
            .userPrivate()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (message) => {
                    this.message = message
                    if (this.authenticationService.currentUserValue) this.authenticationService.currentUserValue.dealer = UserType.User
                    this.userForm.controls['companyName'].clearValidators()
                    this.userForm.controls['companyName'].updateValueAndValidity()
                    this.userForm.controls['firstName'].setValidators(Validators.required)
                    this.userForm.controls['firstName'].updateValueAndValidity()
                    this.dealer = UserType.User
                    this.requiredField(false)
                    this.popupService
                        .openWithTimeout(this.labels.MESSAGE, message, 2000)
                        .pipe(takeUntilDestroyed(this.destroyRef))
                        .subscribe(() => {
                            this.dealer = this.authenticationService.currentUserValue?.dealer
                        })
                },
                error: (error) => {
                    this.message = error
                    this.popupService.openWithTimeout(this.labels.MESSAGE, this.message!, 2000)
                },
            })
    }
    //#endregion

    //#region Dealer
    userDealer() {
        this.confirmationService
            .OKCancel(this.labels.WARNING, `Искате ли да станете дилър?`, 'Потвърди', 'Откаже')
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((result) => {
                if (result === OKCancelOption.OK) {
                    this.onDealerOk()
                }
            })
    }
    onDealerOk() {
        this.userService
            .userDealer()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (message) => {
                    this.message = message
                    if (this.authenticationService.currentUserValue) this.authenticationService.currentUserValue.dealer = UserType.Dealer
                    this.dealer = UserType.Dealer
                    this.userForm.controls['companyName'].setValidators([Validators.required, Validators.maxLength(50)])
                    this.userForm.controls['companyName'].updateValueAndValidity()
                    this.userForm.controls['firstName'].clearValidators()
                    this.userForm.controls['firstName'].updateValueAndValidity()
                    this.requiredField(true)
                    this.popupService.openWithTimeout(this.labels.MESSAGE, this.message, 2000).subscribe(() => {
                        this.dealer = this.authenticationService.currentUserValue?.dealer
                    })
                },
                error: (error) => {
                    this.message = error
                    this.popupService.openWithTimeout(this.labels.MESSAGE, this.message!, 2000)
                },
            })
    }
    //#endregion

    //#region Cancel Button
    onCancelChanges() {
        if (this.initialState != this.userForm.value) {
            this.confirmationService
                .OKCancel(this.labels.WARNING, 'Имате промени. Искате ли да ги откажете?', 'Потвърди', 'Откаже')
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe((result) => {
                    if (result === OKCancelOption.OK) {
                        this.location.back()
                    }
                })
        } else {
            this.location.back()
        }
    }

    //#endregion
}
