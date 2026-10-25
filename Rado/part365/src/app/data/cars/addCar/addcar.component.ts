//#region imports
import { AfterViewInit, Component, ElementRef, HostListener, inject, OnInit, ChangeDetectionStrategy, input, effect, output, computed, signal, untracked } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { HelperComponent } from '@components/custom-controls/helper/helper.component'
import { CarView } from '@model/car/carView'
import { UpdateEnum } from '@model/enum/update.enum'
import { SelectOption } from '@model/selectOption'
import { CarService } from '@services/car.service'
import { ModificationService } from '@services/company-model-modification/modification.service'
import { StaticSelectionService } from '@services/staticSelection.service'
import { ConfirmServiceService } from '@app/dialog/services/confirmService.service'
import { Car } from '@model/car/car'
import { PopUpService } from '@app/dialog/services/popUpService.service'
import { HomeService } from '@services/home.service'
import { SelectComponent } from '@components/custom-controls/select-controls/select/select.component'
import { InputComponent } from '@components/custom-controls/input/input.component'
import { TextAreaComponent } from '@components/custom-controls/textArea/textArea.component'
import { ImageListComponent } from '@components/custom-controls/imagelist/imagelist.component'
import { CompanyChoiseComponent } from '@app/component-main/company-choise/company-choise.component'
import { ModelChoiceComponent } from '@app/component-main/model-choice/model-choice.component'
import { ModificationChoiceComponent } from '@app/component-main/modification-choice/modification-choice.component'
import { Modification } from '@model/static-data/modification'
import { CONSTANT } from '@app/constant/globalLabels'
import { OKCancelOption } from '@app/dialog/model/confirmDialogData'
import { ToolBarComponent } from '@components/custom-controls/toolBar/toolBar.component'
import { LoggerService } from '@services/authentication/logger.service'
import { UserCountService } from '@services/userCount.service'
import { DisplayPartView } from '@model/displayPartView'
import { ImageData } from '@model/imageData'
import { ToastService } from '@services/dialog-api/ToastService/toast.service'
import { ItemType } from '@model/enum/itemType.enum'
import { AddItemParam } from './addCarParam'
import { form, FormField, maxLength, min, minLength, validate } from '@angular/forms/signals'
import { NextId } from '@model/nextId'
import { httpResource } from '@angular/common/http'
import { environment } from '@env/environment'
import { InputStringComponent } from '@components/custom-controls/input-string/input-string.component'
//#endregion

//#region metadata
interface addCarFormModelInterface {
    companyId: number
    modelId: number
    modificationId: number
    year: number
    regNumber: string
    powerkWh: number | string
    powerBHP: number | string
    millage: number | string
    vin: string
    description: string
    engineType: number
    engineModel: string
    gearboxType: number
    regionId: number
    mainImageId: number | string
}

@Component({
    selector: 'app-addcar',
    templateUrl: './addcar.component.html',
    styleUrls: ['./addcar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        ImageListComponent,
        SelectComponent,
        InputComponent,
        TextAreaComponent,
        ReactiveFormsModule,
        CompanyChoiseComponent,
        ModelChoiceComponent,
        ModificationChoiceComponent,
        ToolBarComponent,
        FormField,
        InputStringComponent,
    ],
})
//#endregion
export default class AddCarComponent extends HelperComponent implements OnInit, AfterViewInit {
    //#region form
    addCarFormModel = signal<addCarFormModelInterface>({
        companyId: 0,
        modelId: 0,
        modificationId: 0,
        year: 2021,
        regNumber: '',
        powerkWh: '',
        powerBHP: '',
        millage: '',
        vin: '',
        description: '',
        engineType: 0,
        engineModel: '',
        gearboxType: 0,
        regionId: this.regionId() ?? 0,
        mainImageId: '',
    })

    addCarForm = form(this.addCarFormModel, (schema) => {
        min(schema.companyId, 1, {
            error: { kind: 'not-selected', message: 'Моля изберете фирма' },
        })
        min(schema.modelId, 1, {
            error: { kind: 'not-selected', message: 'Моля изберете модел' },
        })
        min(schema.modificationId, 1, {
            when: () => !this.bus(),
            error: { kind: 'not-selected', message: 'Моля изберете модификация' },
        })
        minLength(schema.vin, 17, {
            when: () => this.addCarFormModel().vin.length !== 0,
            error: { kind: 'not-selected', message: 'VIN трябва да е 17 символа' },
        })
        maxLength(schema.vin, 17, {
            when: () => this.addCarFormModel().vin.length !== 0,
            error: { kind: 'not-selected', message: 'VIN трябва да е 17 символа' },
        })
        minLength(schema.regNumber, 3, {
            error: { kind: 'not-selected', message: 'Моля въведете регистрационен номер с най-малко 3 символа' },
        })
        validate(schema.regNumber, ({ value }) => {
            if (value().length < 3) {
                return {
                    kind: 'https',
                    message: 'Моля въведете регистрационен номер с най-малко 3 символа',
                }
            }
            return null
        })
    })

    //#endregion form

    //#region services
    public carService: CarService = inject(CarService)
    public modificationService: ModificationService = inject(ModificationService)
    public staticSelectionService: StaticSelectionService = inject(StaticSelectionService)
    private activatedRoute: ActivatedRoute = inject(ActivatedRoute)
    private router: Router = inject(Router)
    private confirmService: ConfirmServiceService = inject(ConfirmServiceService)
    private homeService: HomeService = inject(HomeService)
    private loggerService: LoggerService = inject(LoggerService)
    private popupService: PopUpService = inject(PopUpService)
    private userCountService: UserCountService = inject(UserCountService)
    private toastService: ToastService = inject(ToastService)
    //#endregion

    //#region inputs and outputs
    bus = input<number | undefined>(0)
    carId = input<number | undefined>(undefined)
    add = input<boolean>(false)
    update = input<boolean>(false)
    mode = input<UpdateEnum>(UpdateEnum.New)
    ad = input<string>('')
    addItemParam = input.required<AddItemParam>()
    time = signal(0)
    query = input<number>()

    noChange = output<number | undefined>()
    saved = output<number>()
    //#endregion

    //#region host listeners
    @HostListener('window:keydown.esc')
    handleKeyDownEscape() {
        this.cancel()
    }
    @HostListener('window:keydown.enter')
    handleKeyDownEnter() {
        this.onSubmit()
    }
    //#endregion

    //#region properties
    displayPartView?: DisplayPartView
    displayPartView_?: DisplayPartView
    submitElement?: ElementRef<HTMLInputElement>
    car?: CarView
    formInitialValues: object
    mainImageId?: number = 0
    images: ImageData[] = []
    saving = signal(false)
    submitted = signal<boolean>(false)
    $userId = signal(0)
    $yearTo = signal(0)
    $yearFrom = signal(this.labels.YEAR_START)
    newItemId = signal(0)
    //#endregion

    //#region computed
    $itemId = computed(() => {
        if (this.addItemParam()?.id && this.addItemParam()?.id != 0) return this.addItemParam()?.id
        if (this.carId() && this.carId() != 0) return this.carId()
        return this.newItemId()
    })
    $canUpdate = computed(() => {
        console.log(`Mode is ${this.$mode()} ${this.add()} ${this.addItemParam()?.add}`)
        return this.$mode() === UpdateEnum.Update || this.$mode() === UpdateEnum.New
    })

    $mode = computed(() => {
        let mode: UpdateEnum = UpdateEnum.View
        if (this.addItemParam()?.add) mode = UpdateEnum.New
        else if (this.addItemParam()?.mode) mode = this.addItemParam().mode!
        else if (this.mode()) mode = this.mode()
        else if (this.ad() == 'new') mode = UpdateEnum.New

        return mode
    })

    $contentMessage = computed(() => {
        const modeMessage = this.mode() === UpdateEnum.Update ? 'записана' : 'добавена'
        return `${this.$typeMessage()} е успешно ${modeMessage}`
    })

    $actionMessage = computed(() => {
        if (this.mode() == UpdateEnum.Update) {
            return this.labels.UPDATE
        } else {
            return this.labels.SAVE
        }
    })

    $newItemId = computed<number>(() => this.nextResource.value()?.nextId ?? 0)

    nextResource = httpResource<NextId>(
        () => {
            console.log(`Resource called ${this.$mode()} ${this.$mode() != 0} ${this.newItemId()}`)
            const mode: UpdateEnum = this.$mode()
            const check = mode === UpdateEnum.New
            if (check && this.newItemId() == 0) {
                untracked(() => this.newItemId.set(-1))
                return {
                    url: `${environment.restAPI}/users/GetNextId?itemType=${ItemType.OnlyBus}`,
                }
            } else {
                return undefined
            }
        },
        {
            parse: (rawResponse: unknown): NextId => {
                const nextId = rawResponse as NextId
                this.newItemId.set(nextId.nextId!)
                console.log(`Ne Id: ${this.newItemId()}`)
                return nextId
            },
            defaultValue: { nextId: 0, error: '' },
        }
    )

    $typeMessage = computed(() => (this.bus() ? 'Буса' : 'Колата'))

    $labelMessage = computed(() => (this.bus() ? 'Име на бус' : 'Име на кола'))

    $years = computed(() => {
        const result: SelectOption[] = []
        for (let i = this.$yearFrom(); i <= this.$yearTo(); i++) {
            result.push({
                value: i,
                text: i.toString(),
            })
        }
        return result
    })
    //#endregion

    //#region resources


    // nextResource = httpResource<NextId>(
    //     () => ({
    //         url: `${environment.restAPI}/users/GetNextId?itemType=${ItemType.OnlyBus}&time=${this.time()}`
    //     }),
    //     {
    //         parse: (rawResponse: unknown): NextId => rawResponse as NextId,
    //         defaultValue: { nextId: 0, error: '' }
    //     }
    // );

    //     parse: (rawResponse:): UserViewModel => {
    //         const dto = rawResponse as UserDto;
    //         return {
    //             id: dto.id,
    //             fullName: `${dto.first_name} ${dto.last_name}`
    //         };
    //         },
    // //     userResource2 = httpResource<NextId>(() => {
    // //         if (true) return undefined

    //         return {
    //             url: '',
    //             params: {
    //                 levelId: 1
    //             }
    //         }
    //     })

    // readonly userResource = httpResource<UserViewModel>(() => ({
    //     url: `/api/users/${this.userId()}`,
    //     method: 'GET'
    //   }), {
    //     // Transform or map raw DTO data into a ViewModel
    //     parse: (rawResponse: unknown): UserViewModel => {
    //       const dto = rawResponse as UserDto;
    //       return {
    //         id: dto.id,
    //         fullName: `${dto.first_name} ${dto.last_name}`
    //       };
    //     },
    //     defaultValue: { id: 0, fullName: 'Loading...' }
    //   });
    //     myResource = httpResource<User[]>(() => {
    //   const shouldFetchData = this.shouldFetchData(); // Custom condition
    //   return shouldFetchData ? `${RESOURCE_URL}${this.query()}` : undefined;
    // });
    //     userResource = httpResource<NextId>(() =>
    //     (
    //         {
    //             if (this.mode() !== UpdateEnum.New)
    //                 return undefined

    //             return `${environment.restAPI}/users/GetNextId?itemType=${ItemType.OnlyBus}`,
    //         }
    //             ,
    //     //     params: {
    //     //     },

    //     // {
    //     //     defaultValue: {nextId: 0, error: ''},
    //     //     parse: (raw) => {
    //     //         const nextId = raw as NextId
    //     //         if (nextId.error?.length) {
    //     //             throw new Error("Invalid user data received");
    //     //         }
    //     //         this.newCarId.set(nextId.nextId?? 0)
    //     //         return nextId;
    //     //     },
    // });
    // nextResource = httpResource(
    // {
    //     params: () => {itemType: ItemType.OnlyCar},
    //     loader: async ({ params, abortSignal }) => {
    //                     const response = await fetch(`/api/users/${params}`, {
    //                     signal: abortSignal,
    //                     });
    //     if (!response.ok) {
    //           throw new Error(`Failed to load user ${params}`);
    //     }
    //     return response.json();
    // }
    // })
    //#endregion

    //#region constructor
    constructor() {
        super()
        this.$yearTo.set(this.currentYear)
        this.formInitialValues = this.addCarForm().value()
        this.$userId.set(this.loggedUser?.userId ?? 0)

        //#region effect
        effect(() => {
            console.log(`Car ID: ${this.$itemId()}`)
        })

        // effect(() => {
        //     console.log(`Add Car Errors: ${this.addCarForm().errors()}`)
        // })
        effect(() => {
            console.log(`Add Car Bus: ${this.$itemId()}`)
        })
        // effect(() => {
        //     console.log('Add Car Form:', this.addCarForm().errors()[0])
        // })

        // effect(() => {
        //     this.addCarFormModel().powerkWh = this.addCarForm.powerBHP().value()
        // })

        effect(() => {
            this.time.set(Date.now())
        })

        effect(() => {
            this.clearZeros()
            this.addCarForm().value()
        })
        //#endregion
    }
    //#endregion

    //#region ngfunctions
    ngOnInit() {
        // let id = 0
        // if (this.$mode() === UpdateEnum.New)
        //     id = this.$newCarId()
        // console.log(`Local ${id}`)
        const check = this.$mode() == UpdateEnum.Update
        if (check) this.loadCar()

        this.activatedRoute.queryParamMap.subscribe((param) => {
            this.parseQueryParams(param)
        })
    }

    ngAfterViewInit(): void {
        this.goTop()
        return
    }
    //#endregion

    // #region others
    defaultImageChanged(imageId: number) {
        this.addCarFormModel.set({ ...this.addCarFormModel(), mainImageId: imageId })
    }

    powerkWhChanged() {
        this.calculateBHP(+this.addCarFormModel().powerkWh)
    }

    powerBHPChanged() {
        this.calculatekWh(+this.addCarFormModel().powerBHP)
    }

    modificatioChanged(modification: Modification) {
        this.$yearFrom.set(modification?.yearFrom ?? this.labels.YEAR_START)
        this.$yearTo.set(modification?.yearTo ?? 2025)
    }

    focus() {
        this.submitElement?.nativeElement.focus()
    }

    clearZeros() {
        if (!this.car) return

        if (this.car.powerBHP === 0) this.car.powerBHP = undefined
        if (this.car.powerkWh === 0) this.car.powerkWh = undefined
        if (this.car.millage === 0) this.car.millage = undefined

        if (this.addCarFormModel().powerBHP === 0) this.addCarFormModel.set({ ...this.addCarFormModel(), powerBHP: 0 })
        if (this.addCarFormModel().powerkWh === 0) this.addCarFormModel.set({ ...this.addCarFormModel(), powerkWh: 0 })
        if (this.addCarFormModel().millage === 0) this.addCarFormModel.set({ ...this.addCarFormModel(), millage: 0 })
    }

    changeMessage() {
        this.confirmService.OKCancel(CONSTANT.MESSAGE, 'Потвърдете, че искате да отмeните промените').subscribe((reuslt) => {
            if (reuslt === OKCancelOption.OK) {
                this.goBack()
            }
        })
    }
    calculateBHP(value: number) {
        const newValue = Math.ceil(Number(value) * this.labels.KWH_TO_BHP)
        if (newValue != this.addCarFormModel().powerBHP) this.addCarFormModel.set({ ...this.addCarFormModel(), powerBHP: newValue })
    }

    calculatekWh(value: number) {
        const newValue = Math.floor(Number(value) / this.labels.KWH_TO_BHP)
        if (newValue != this.addCarFormModel().powerkWh) this.addCarFormModel.set({ ...this.addCarFormModel(), powerkWh: newValue })
    }
    //#endregion

    showMessageNotFound() {
        this.popupService.openWithTimeout('Съобщение', 'Частта вече не е налична!').subscribe(() => this.goBack())
    }

    loadCar() {
        if (this.$itemId() && this.$mode() == UpdateEnum.Update) {
            this.carService.fetchCar(this.$itemId()!).subscribe({
                next: (res) => {
                    this.car = { ...res }
                    this.mainImageId = this.car.mainImageId
                    this.clearZeros()
                    this.addCarFormModel.update((value) => ({ ...value, ...this.car }))
                    this.inialValue = this.addCarFormModel()
                },
                error: (error) => {
                    this.loggerService.logError(error)
                    this.showMessageNotFound()
                },
                complete: () => {
                    return
                },
            })
        }
        // else {
        //     this.nextIdService.getNextId(this.bus() ? ItemType.OnlyBus : ItemType.OnlyCar).subscribe({
        //         next: (id) => {
        //             if (id.nextId) {
        //                 this.newCarId.set(id.nextId)
        //             } else if (id.error) {
        //                 this.popupService.openWithTimeout('Съобщение', id.error, 2000).subscribe(() => {
        //                     this.goBack()
        //                 })
        //             } else {
        //                 this.popupService.openWithTimeout('Съобщение', 'Грешка при генериране на Id за новата кола!', 2000).subscribe(() => {
        //                     this.goBack()
        //                 })
        //             }
        //         },
        //         error: (error) => {
        //             this.loggerService.logError(error)
        //             this.popupService.openWithTimeout('Съобщение', 'Нова кола не може да бъде добавена!', 2000).subscribe(() => {
        //                 this.goBack()
        //             })
        //         },
        //         complete: () => {
        //             return
        //         },
        //     })

        //     this.inialValue = this.addCarFormModel()
        // }
    }

    addCar(update: UpdateEnum = UpdateEnum.New) {
        const formModel = this.addCarFormModel()
        const carUpdated: Car = Object.assign({}, formModel, {
            modelId: Number(formModel.modelId),
            modificationId: Number(formModel.modificationId),
            powerkWh: Number(formModel.powerkWh),
            powerBHP: Number(formModel.powerBHP),
            millage: Number(formModel.millage),
            mainImageId: Number(formModel.mainImageId),
            bus: this.bus(),
            carId: this.$itemId(),
            userId: this.$userId(),
        })
        this.saving.set(true)

        this.carService.addUpdateCar(carUpdated, update).subscribe({
            next: (val) => {
                this.carSaved(val)
            },
            error: (error) => {
                this.popupService.openWithTimeout('Съобщение', error.error.message, 2000)
                this.saving.set(false)
                this.loggerService.logError(error)
                console.log(error)
            },
            complete: () => {
                this.saving.set(false)
                return
            },
        })
    }

    carSaved(val: DisplayPartView) {
        this.carService.currentCarId = val.id
        this.saving.set(false)
        this.carService.currentCarId = val.carId
        this.userCountService.refresh()
        const snackBarRef = this.toastService.showToast(this.$contentMessage(), 2)
        snackBarRef.afterDismissed().subscribe(() => {
            this.homeService.updateDisplayPartView(val)
            this.submitted.set(false)
            this.saved.emit(val.id!)
            this.carService.currentCarId = val.id
            if (this.ad() != 'new') {
                if (this.bus() === 1) {
                    this.router.navigate(['/data/bus'])
                } else {
                    this.router.navigate(['/data/cars'])
                }
            } else this.goBack()
        })
    }

    goBack() {
        this.noChange.emit(this.$itemId())
    }

    cancel() {
        if (this.addCarForm().touched()) {
            this.changeMessage()
        } else {
            this.noChange.emit(this.carId())
            this.goBack()
        }
    }

    onSubmit() {
        this.submitted.set(true)
        if (!this.addCarForm().valid()) {
            console.log('Form is company:', this.addCarForm.companyId().errors(), this.addCarForm().value())
            this.toastService.show('Моля попълнете задължителната информация')
            return
        }

        if (this.$mode() === UpdateEnum.New) {
            this.carService.checkForUniqueness(this.addCarFormModel().regNumber, this.bus() ?? 0).subscribe({
                next: (res) => {
                    if (res == false) {
                        const busCar = this.bus() ? 'Бус' : 'Кола'
                        const message = `${busCar} с това име "${this.addCarFormModel().regNumber}" вече съществува`
                        this.toastService.show(message)
                    } else {
                        this.addCar(UpdateEnum.New)
                    }
                },
            })
        } else {
            this.addCar(UpdateEnum.Update)
        }
    }
}
