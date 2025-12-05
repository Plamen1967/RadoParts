import { AfterViewInit, Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { Location, NgStyle } from '@angular/common'
import { HelperComponent } from '@components/custom-controls/helper/helper.component'
import { UserType } from '@model/enum/userType.enum'
import { User } from '@model/user'
import { UserService } from '@services/user.service'
import { AlertService } from '@services/alert.service'
import { StaticSelectionService } from '@services/staticSelection.service'
import { ImageService } from '@services/image.service'
import { ModalService } from '@services/dialog-api/modal.service'
import { PopUpServiceService } from '@app/dialog/services/popUpService.service'
import { first } from 'rxjs'
import { UploadComponent } from '@components/custom-controls/upload/upload.component'
import { PictureComponent } from '@components/custom-controls/picture/picture.component'
import { ImageData } from '@model/imageData'
import { TextAreaComponent } from '@components/custom-controls/textArea/textArea.component'
import { ConfirmServiceService } from '@app/dialog/services/confirmService.service'
import { InputComponent } from '@components/custom-controls/input/input.component'
import { SelectComponent } from '@components/custom-controls/select-controls/select/select.component'
import { SelectOption } from '@model/selectOption'
import { QueryParam } from '@model/queryParam'
import { OKCancelOption } from '@app/dialog/model/confirmDialogData'
import { globalStaticData } from '@model/staticData'

@Component({
    standalone: true,
    selector: 'app-updateuser',
    templateUrl: './updateUser.component.html',
    styleUrls: ['./updateUser.component.css'],
    imports: [UploadComponent, PictureComponent, NgStyle, TextAreaComponent, InputComponent, ReactiveFormsModule, SelectComponent],
})
export class UpdateUserComponent extends HelperComponent implements OnInit, AfterViewInit {
    unamePattern = '^[a-z0-9_-]{8,15}$'
    pwdPattern = '^(?=.*d)(?=.*[a-z])(?=.*[A-Z])(?!.*s).{6,12}$'
    mobnumPattern = '^((\\+91-?)|0)?[0-9]{10}$'
    emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'
    userForm: FormGroup
    loading = false
    submitted = false
    dealer: UserType = UserType.Dealer
    userId?: number
    error?: string
    businessCardimage?: ImageData
    images: ImageData[] = []
    image?: ImageData
    message?: string
    user?: User
    activationcode?: string
    firstNameRequired?: string
    companyNameRequired?: string
    params?: QueryParam
    initialState?: object
    companyRequired?: string
    currentImageId?: number
    numberAds?: number
    regions: SelectOption[] = []

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private userService: UserService,
        private alerService: AlertService,
        public staticSelectionService: StaticSelectionService,
        public imageService: ImageService,
        public modalService: ModalService,
        public popupService: PopUpServiceService,
        private location: Location,
        private route: ActivatedRoute,
        private confirmationService: ConfirmServiceService
    ) {
        super()
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
        this.regions = [...this.staticSelectionService.Region]
    }

    ngAfterViewInit(): void {
        this.route.queryParams.subscribe((params) => {
            this.params = params
            if (params['activationcode'] || params['userId']) {
                this.activationcode = params['activationcode']
                this.userService
                    .loadUserByActivationCode(this.activationcode!)
                    .pipe(first())
                    .subscribe((user) => {
                        if (!user) this.router.navigate(['/'])
                        else {
                            this.user = user
                            this.userId = user.userId
                            this.userForm.patchValue(user)
                            this.dealer = user.dealer!
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
            } else {
                if (this.authenticationService.currentUserValue) {
                    this.userService
                        .loadCurretUser(this.authenticationService.currentUserValue.userId!)
                        .pipe(first())
                        .subscribe((user) => {
                            this.user = user
                            this.userId = user.userId
                            this.userForm.patchValue(user)
                            this.dealer = user.dealer!
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
            }
        })

        if (this.authenticationService.currentUserValue?.userId) {
            this.imageService
                .getBusinessCardImage(this.authenticationService.currentUserValue.userId)
                .pipe(first())
                .subscribe((image) => {
                    this.businessCardimage = image
                    if (this.businessCardimage) this.f['imageId'].setValue(this.businessCardimage?.imageId)
                })

            this.imageService.getMinImages(this.authenticationService.currentUserValue.userId).subscribe((images) => (this.images = images))
        }
    }

    ngOnInit() {
        this.numberAds = this.staticSelectionService.maxNumberParts
        this.userService.getNewUserId().subscribe((userId) => (this.userId = userId))
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
        this.userService.updateUser(this.userForm.value).subscribe({
            next: (data) => {
                if (this.authenticationService.currentUserValue) {
                    this.authenticationService.currentUserValue.userName = this.userForm.value.userName
                    this.authenticationService.currentUserValue.regionId = this.userForm.value.regionId
                }
                this.userService.getUserById(this.userId!).subscribe((user) => {
                    globalStaticData.addUserImage(this.userId!, user.imageData!)
                })

                let message: string
                if (this.params?.activationcode) message = 'Моля активирайте акаунта си чрез изпратеният до Вас е-майл!'
                else message = 'Потребителя е успешно актуализиран'
                this.confirmationService.OK(this.labels.MESSAGE, message)
                this.businessCardimage = undefined
                setTimeout(() => {
                    this.router.navigate(['/'])
                }, 3000)
                // TOD 
                console.log(data);
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
                console.log('Complete')
            },
        })
    }

    updatePassword() {
        //this.modalService.open('passwordDialog')
    }

    keyPress(event: KeyboardEvent) {
        event.stopPropagation()
    }
    //#region View ads
    view() {
        if (!this.authenticationService.currentUserValue) return
        const address = `/user/user`
        this.router.navigate([address], { queryParams: { userId: this.authenticationService.currentUserValue.userId } })
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

    deleteImage() {
        this.imageService.deleteImage(this.currentImageId!).subscribe({
            next: (f: boolean) => {
                const index = this.images.findIndex((image) => image.imageId === this.currentImageId)
                if (index != -1) {
                    this.images.splice(index, 1)
                }
                this.popupService.openWithTimeout(this.labels.MESSAGE, 'Снимката е успешно изтрита', 2000)
                // TODO
                console.log(f)
            },
            error: (error) => {
                this.popupService.openWithTimeout(this.labels.MESSAGE, 'Снимката не може да  бъде изтрита', 2000)
                console.log(error)
            },
        })
    }

    deleteImageDialog(image: ImageData) {
        this.currentImageId = image.imageId
        this.confirmationService.OKCancel('Съобщение', ' Потвърдете изтриването на снимката!').subscribe((result) => {
            if (result.OK) {
                this.deleteImage()
            }
        })
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
        this.confirmationService.OKCancel('Съобщение', 'Моля потвърдете изтриването на бизнес картата').subscribe((result) => {
            if (result == OKCancelOption.OK) {
                this.imageService.deleteBusinessCardImage().subscribe(() => {
                    this.businessCardimage = undefined
                    this.popupService.openWithTimeout(this.labels.MESSAGE, 'Бизнес картата успещно е изтрита', 2000)
                })
            }
        })
    }
    //#endregion

    //#region Delete User
    onDeleteUserDialog() {
        if (!this.user) return;
        this.message = 'Моля потвърдете изтриването на бизнес картата'
        this.confirmationService.OKCancel('Съобщение', `моля потвърдете изтриването на акаунта.`, 'Изтрий Акаунта', 'Откажи').subscribe((result) => {
            if (result === OKCancelOption.OK) {
                this.deletUser()
            }
        })
    }

    deletUser() {
        if (!this.user) return;
        const userId: number = this.user.userId!
        if (!userId) return

        this.userService.deleteUser(userId).subscribe({
            next: (message) => {
                this.message = message
                this.popupService.openWithTimeout(this.labels.MESSAGE, message, 4000)
                setTimeout(() => {
                    this.authenticationService.logout()
                    this.router.navigate(['/'])
                }, 4000)
            },
            error: (error) => {
                console.log(error)
                this.message = error
                this.popupService.openWithTimeout(this.labels.MESSAGE, error, 2000)
            },
            complete: () => {
                return
            },
        })
    }
    //#endregion

    //#region logout
    onLogout() {
        this.confirmationService.OKCancel('Съобщение', 'Искате ли да излезете?').subscribe((result) => {
            if (result === OKCancelOption.OK) {
                this.authenticationService.logout()
                this.router.navigate(['/'])
            }
        })
    }

    //#endregion

    //#region PrivateDealer
    userPrivate() {
        this.message = `div class='row'>Внимание! Само Вашите последни ${this.numberAds} ще бъдат запазени!</div>
    <div class="row justify-content-center">Искате ли да станете часно лице?</div>`

        this.confirmationService.OKCancel(this.labels.WARNING, this.message).subscribe((result) => {
            if (result === OKCancelOption.OK) this.onPrivateOk()
        })
    }

    onPrivateOk() {
        this.userService.userPrivate().subscribe({
            next: (message) => {
                this.message = message
                if (this.authenticationService.currentUserValue)
                    this.authenticationService.currentUserValue.dealer = UserType.User
                this.userForm.controls['companyName'].clearValidators()
                this.userForm.controls['companyName'].updateValueAndValidity()
                this.userForm.controls['firstName'].setValidators(Validators.required)
                this.userForm.controls['firstName'].updateValueAndValidity()
                this.dealer = UserType.User
                this.requiredField(false)
                this.popupService.openWithTimeout(this.labels.MESSAGE, message, 2000)
                this.dealer = this.authenticationService.currentUserValue?.dealer ?? UserType.Dealer
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

    //#region Dealer
    userDealer() {
        this.message = `Искате ли да станете дилър?`

        this.confirmationService.OKCancel(this.labels.WARNING, this.message).subscribe((result) => {
            if (result === OKCancelOption.OK) this.onDealerOk()
        })
    }
    onDealerOk() {
        this.userService.userDealer().subscribe({
            next: (message) => {
                this.message = message
                if (this.authenticationService.currentUserValue)
                    this.authenticationService.currentUserValue.dealer = UserType.Dealer
                this.dealer = UserType.Dealer
                this.userForm.controls['companyName'].setValidators([Validators.required, Validators.maxLength(50)])
                this.userForm.controls['companyName'].updateValueAndValidity()
                this.userForm.controls['firstName'].clearValidators()
                this.userForm.controls['firstName'].updateValueAndValidity()
                this.requiredField(true)
                this.popupService.openWithTimeout(this.labels.MESSAGE, this.message, 2000)
                if (this.authenticationService.currentUserValue)
                    this.dealer = this.authenticationService.currentUserValue.dealer!
            },
            error: (error) => {
                this.message = error
                this.popupService.openWithTimeout(this.labels.MESSAGE, error, 2000)
            },
            complete: () => {
                return
            },
        })
    }
    //#endregion

    //#region Cancel Button
    onCancelChanges() {
        if (this.initialState != this.userForm.value) {
            this.message = 'Имате промени. Искате ли да ги откажете?'
            this.confirmationService.OKCancel(this.labels.WARNING, this.message).subscribe((result) => {
                if (result === OKCancelOption.OK) {
                    this.location.back()
                }
            })
        } else {
            this.location.back()
        }
    }

    onChangeOk() {
        this.location.back()
    }
    //#endregion
}
