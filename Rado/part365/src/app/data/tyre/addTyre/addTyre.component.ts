//#region import
import { NgClass, NgStyle } from '@angular/common'
import { AfterViewInit, Component, computed, effect, HostListener, inject, input, OnInit, output, signal } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { PopUpService } from '@app/dialog/services/popUpService.service'
import { InputComponent } from '@components/custom-controls/input/input.component'
import { RadioGroupListComponent } from '@components/custom-controls/radioGroupList/radiogrouplist.component'
import { SelectComponent } from '@components/custom-controls/select-controls/select/select.component'
import { TextAreaComponent } from '@components/custom-controls/textArea/textArea.component'
import { HelperComponent } from '@components/custom-controls/helper/helper.component'
import { ItemType } from '@model/enum/itemType.enum'
import { UpdateEnum } from '@model/enum/update.enum'
import { QueryParam } from '@model/queryParam'
import { RadioButton } from '@model/radioButton'
import { SelectOption } from '@model/selectOption'
import { RimWithTyre } from '@model/tyre/rimWithTyre'
import { HomeService } from '@services/home.service'
import { ImageService } from '@services/image.service'
import { NavigationService } from '@services/navigation.service'
import { NextIdService } from '@services/nextId.service'
import { PathService } from '@services/path.service'
import { StaticSelectionService } from '@services/staticSelection.service'
import { StateService } from '@services/storage/state.service'
import { TyreService } from '@services/tyre/tyre.service'
import { ImageData } from '@model/imageData'
import { OptionItem } from '@model/optionitem'
import { ImageListComponent } from '@components/custom-controls/imagelist/imagelist.component'
import { ConfirmServiceService } from '@app/dialog/services/confirmService.service'
import { CompanyChoiseComponent } from '@app/component-main/company-choise/company-choise.component'
import { ModelChoiceComponent } from '@app/component-main/model-choice/model-choice.component'
import { CONSTANT } from '@app/constant/globalLabels'
import { OKCancelOption } from '@app/dialog/model/confirmDialogData'
import { ToolBarComponent } from '@components/custom-controls/toolBar/toolBar.component'
import { goTop } from '@app/functions/functions'
import { LoggerService } from '@services/authentication/logger.service'
import { UserCountService } from '@services/userCount.service'
import { DisplayPartView } from '@model/displayPartView'
import { form, FormField, min } from '@angular/forms/signals'
import { httpResource } from '@angular/common/http'
import { NextId } from '@model/nextId'
import { environment } from '@env/environment'
import { ToastService } from '@services/dialog-api/ToastService/toast.service'
//#endregion
interface AddTyreFormInterface {
    itemType: number
    tyreWidth: number
    tyreHeight: number
    tyreRadius: number
    tyreType: number
    tyreCompanyId: number
    companyId: number
    modelId: number
    rimMaterial: number
    rimOffset: number
    rimBoltCount: number
    rimBoltDistance: number
    rimCenter: number
    count: number
    monthDOT: number
    yearDOT: number
    regionId: number
    description: string
    price: number
    mainImageId: number
}

//#region component
@Component({
    selector: 'app-addtyre',
    templateUrl: './addTyre.component.html',
    styleUrls: ['./addTyre.component.css'],
    imports: [
        TextAreaComponent,
        ReactiveFormsModule,
        NgClass,
        NgStyle,
        SelectComponent,
        RadioGroupListComponent,
        InputComponent,
        ImageListComponent,
        CompanyChoiseComponent,
        ModelChoiceComponent,
        ToolBarComponent,
        FormField,
    ],
})
export default class AddTyreComponent extends HelperComponent implements OnInit, AfterViewInit {
    @HostListener('window:keydown.esc')
    handleKeyDownEscape() {
        this.cancel()
    }
    @HostListener('window:keydown.enter')
    handleKeyDownEnter() {
        this.onSubmit()
    }
    //#endregion
    //#region form
    addTyreFormModel = signal<AddTyreFormInterface>({
        itemType: 0,
        tyreWidth: 0,
        tyreHeight: 0,
        tyreRadius: 0,
        tyreType: 0,
        tyreCompanyId: 0,
        companyId: 0,
        modelId: 0,
        rimMaterial: 0,
        rimOffset: 0,
        rimBoltCount: 0,
        rimBoltDistance: 0,
        rimCenter: 0,
        count: 0,
        monthDOT: 0,
        yearDOT: 0,
        regionId: this.regionId() ?? 0,
        description: '',
        price: 0,
        mainImageId: 0,
    })

    addTyreForm = form(this.addTyreFormModel, (path) => {
        min(path.tyreWidth, 1, {
            message: 'Моля изберете широчината на гумата',
            when: ({ valueOf }) => valueOf(path.itemType) == ItemType.Tyre || valueOf(path.itemType) == ItemType.RimWithTyre,
        })
        min(path.tyreHeight, 1, {
            message: 'Моля изберете височината на гумата',
            when: ({ valueOf }) => valueOf(path.itemType) == ItemType.Tyre || valueOf(path.itemType) == ItemType.RimWithTyre,
        })
        min(path.tyreRadius, 1, {
            message: 'Моля изберете радиуса на гумата',
        })
        min(path.tyreType, 1, {
            message: 'Моля изберете сезонността',
            when: ({ valueOf }) => valueOf(path.itemType) == ItemType.Tyre || valueOf(path.itemType) == ItemType.RimWithTyre,
        })
        min(path.companyId, 1, {
            message: 'Моля изберете марката на джантата',
            when: ({ valueOf }) => valueOf(path.itemType) == ItemType.Rim || valueOf(path.itemType) == ItemType.RimWithTyre,
        })
        // validate(path.companyId, ({ value, valueOf }) => {
        //     const check = valueOf(path.itemType) == ItemType.Rim || valueOf(path.itemType) == ItemType.RimWithTyre
        //     console.log(check)
        //     if (value() < 1) {
        //         return {
        //             kind: 'https',
        //             message: 'Моля изберете марката на джантата',
        //         }
        //     }
        //     return null
        // })

        min(path.rimMaterial, 1, {
            message: 'Моля изберете материал на джантата',
            when: ({ valueOf }) => valueOf(path.itemType) == ItemType.Rim || valueOf(path.itemType) == ItemType.RimWithTyre,
        })
        min(path.rimBoltCount, 1, {
            message: 'Моля въведете броя на болтовете',
            when: ({ valueOf }) => valueOf(path.itemType) == ItemType.Rim || valueOf(path.itemType) == ItemType.RimWithTyre,
        })
        min(path.count, 1, {
            message: 'Моля въведете броя',
        })
        min(path.price, 0.01, {
            message: 'Моля въведете цена.',
        })
    })

    // checkCompany(companyId: number, itemType: ItemType) {
    //     console.log(`Company path: ${companyId}`)
    //     const check =
    //     return check
    // }
    // controlRimWithTyre() {
    //     // this.addForm.controls['tyreWidth'].setValidators([Validators.required, Validators.min(1)])
    //     // this.addForm.controls['tyreHeight'].setValidators([Validators.required, Validators.min(1)])
    //     // this.addForm.controls['tyreRadius'].setValidators([Validators.required, Validators.min(1)])
    //     // this.addForm.controls['tyreType'].setValidators([Validators.required, Validators.min(1)])

    //     // this.addForm.controls['tyreWidth'].updateValueAndValidity()
    //     // this.addForm.controls['tyreHeight'].updateValueAndValidity()
    //     // this.addForm.controls['tyreRadius'].updateValueAndValidity()
    //     // this.addForm.controls['tyreType'].updateValueAndValidity()

    //     // this.addForm.controls['companyId'].setValidators([Validators.required, Validators.min(1)])
    //     // this.addForm.controls['rimBoltCount'].setValidators([Validators.required, Validators.min(1)])

    //     this.addForm.controls['companyId'].updateValueAndValidity()
    //     this.addForm.controls['rimBoltCount'].updateValueAndValidity()
    // }
    // controlTyre() {
    //     // this.addForm.controls['tyreWidth'].setValidators([Validators.required, Validators.min(1)])
    //     // this.addForm.controls['tyreHeight'].setValidators([Validators.required, Validators.min(1)])
    //     // this.addForm.controls['tyreRadius'].setValidators([Validators.required, Validators.min(1)])
    //     // this.addForm.controls['tyreType'].setValidators([Validators.required, Validators.min(1)])

    //     this.addForm.controls['tyreWidth'].updateValueAndValidity()
    //     this.addForm.controls['tyreHeight'].updateValueAndValidity()
    //     this.addForm.controls['tyreRadius'].updateValueAndValidity()
    //     this.addForm.controls['tyreType'].updateValueAndValidity()

    //     this.addForm.controls['companyId'].clearValidators()
    //     this.addForm.controls['rimBoltCount'].clearValidators()

    //     this.addForm.controls['companyId'].updateValueAndValidity()
    //     this.addForm.controls['rimBoltCount'].updateValueAndValidity()
    // }

    //     controlRim() {
    //     // this.addForm.controls['companyId'].setValidators([Validators.required, Validators.min(1)])
    //     // this.addForm.controls['rimBoltCount'].setValidators([Validators.required, Validators.min(1)])

    //     this.addForm.controls['companyId'].updateValueAndValidity()
    //     this.addForm.controls['rimBoltCount'].updateValueAndValidity()

    //     this.addForm.controls['tyreWidth'].clearValidators()
    //     this.addForm.controls['tyreHeight'].clearValidators()
    //     this.addForm.controls['tyreRadius'].clearValidators()
    //     this.addForm.controls['tyreType'].clearValidators()

    //     this.addForm.controls['tyreWidth'].updateValueAndValidity()
    //     this.addForm.controls['tyreHeight'].updateValueAndValidity()
    //     this.addForm.controls['tyreRadius'].updateValueAndValidity()
    //     this.addForm.controls['tyreType'].updateValueAndValidity()
    // }

    //#endregion
    //#region input/output
    id = input<number | undefined>()
    displayPartView = input<DisplayPartView>()
    ad = input<string>()
    update = input<boolean>()
    view = input<boolean>()
    itemType = input<number>()
    query = input<number>()
    userId = input<number>()

    time = signal(0)
    mode = computed(() => {
        if (this.update() === true) return UpdateEnum.Update
        if (this.view() === true) return UpdateEnum.View
        else if (this.ad() === 'ad') return UpdateEnum.New
        return UpdateEnum.New
    })

    nextResource = httpResource<NextId>(() => ({
        url: `${environment.restAPI}/users/GetNextId?itemType=${ItemType.OnlyBus}&time=${this.time()}`,
    }))
    $newCarId = computed(() => {
        return this.nextResource.value()?.nextId
    })

    saved = output<number>()
    noChange = output<number>()
    //#endregion
    $canUpdate = computed(() => {
        return this.$mode() === UpdateEnum.Update || this.$mode() === UpdateEnum.New
    })
    $mode = computed(() => this.mode())
    $actionMessage = computed(() => {
        if (this.mode() == UpdateEnum.Update) {
            return this.labels.UPDATE
        } else {
            return this.labels.SAVE
        }
    })

    //#region services
    public staticSelectionService: StaticSelectionService = inject(StaticSelectionService)
    private toastService: ToastService = inject(ToastService)

    private popupService: PopUpService = inject(PopUpService)
    private tyreService: TyreService = inject(TyreService)
    private activatedRoute: ActivatedRoute = inject(ActivatedRoute)
    private router: Router = inject(Router)
    public homeService: HomeService = inject(HomeService)
    private pathService: PathService = inject(PathService)
    private nextIdService: NextIdService = inject(NextIdService)
    private imageService: ImageService = inject(ImageService)
    private stateServce: StateService = inject(StateService)
    private navigationService: NavigationService = inject(NavigationService)
    private confirmService: ConfirmServiceService = inject(ConfirmServiceService)
    private loggerService: LoggerService = inject(LoggerService)
    private userCountService: UserCountService = inject(UserCountService)
    //#endregion

    //#region members
    itemId = signal<number>(0)
    submitted = signal<boolean>(false)
    saving = false
    images: ImageData[] = []
    message = ''
    currentItem?: RimWithTyre
    companies: OptionItem[] = []
    models: OptionItem[] = []
    tyreWidth: SelectOption[] = []

    tyreHeight: SelectOption[] = []
    tyreRadius: SelectOption[] = []
    tyreTypes: SelectOption[] = []
    tyreProducers: SelectOption[] = []

    rimBoltDistances: SelectOption[] = []
    rimCenters: SelectOption[] = []
    rimBoltCount: SelectOption[] = []
    rimOffset: SelectOption[] = []
    rimMaterial: SelectOption[] = []
    rimWidth: SelectOption[] = []
    regions: SelectOption[] = []

    params?: QueryParam
    viewId = input<number>(0)
    goHome = false
    tyreDescription?: string
    numberOfPartsPerUser?: number
    _displayPartView?: DisplayPartView
    updateFlag = true
    companyId?: number
    mainImageId?: number
    months = Array.from({ length: 53 }, (value, index) => {
        return { value: index + 1, text: (index + 1).toString() }
    })

    years = Array.from({ length: this.currentYear - 2000 }, (value, index) => {
        return { value: index + 1, text: (index + 1).toString().padStart(2, '0') }
    })
    radioTypes: RadioButton[] = [
        { label: 'Гуми', id: 3 },
        { label: 'Джанти', id: 4 },
        { label: 'Джанти с гуми', id: 5 },
    ]
    currentitemType = computed(() => {
        if (this.itemType()) return this.itemType()
        return ItemType.Tyre
    })
    //#endregion
    $displayTyre = computed(() => {
        const itemType = this.currentitemType()
        if (itemType == ItemType.Tyre || itemType == ItemType.RimWithTyre) return true
        return false
    })

    $displayRim = computed(() => {
        const itemType = this.currentitemType()
        if (itemType == ItemType.Rim || itemType == ItemType.RimWithTyre) return true

        return false
    })

    constructor() {
        super()
        this.tyreWidth = [{ value: 0, text: 'Избери ширина' }, ...this.staticSelectionService.TyreWidth]
        this.tyreHeight = [{ value: 0, text: 'Избери височина' }, ...this.staticSelectionService.TyreHeight]
        this.tyreRadius = [{ value: 0, text: 'Избери радиус' }, ...this.staticSelectionService.TyreRadius]
        this.tyreTypes = [{ value: 0, text: 'Избери тип' }, ...this.staticSelectionService.TyreType]
        this.tyreProducers = [{ value: 0, text: 'Избери компания' }, ...this.staticSelectionService.TyreProducers]

        this.rimBoltDistances = [{ value: 0, text: 'Избери болт дистанция ' }, ...this.staticSelectionService.RimBoltDistance]
        this.rimCenters = [{ value: 0, text: 'Избери джанта център' }, ...this.staticSelectionService.RimCenter]
        this.rimBoltCount = [{ value: 0, text: 'Избери брой болтове' }, ...this.staticSelectionService.RimBoltCount]
        this.rimOffset = [{ value: 0, text: 'Избери офсет' }, ...this.staticSelectionService.RimOffset]
        this.rimMaterial = [{ value: 0, text: 'Избери материал' }, ...this.staticSelectionService.RimMaterial]
        this.rimWidth = [{ value: 0, text: 'Избери джанта ширина ' }, ...this.staticSelectionService.RimWidth]
        this.regions = [{ value: 0, text: 'Избери регион' }, ...this.staticSelectionService.Region]

        effect(() => {
            this.time.set(Date.now())
        })

        effect(() => {
            console.log(`Errors : ${this.addTyreForm().errors()}`)
        })

        effect(() => {
            console.log(`Item Id: ${this.itemId()}`)
        })
        // effect(() => {
        //     console.log(`Tyre Component Form ${JSON.stringify(this.addTyreForm().value())}`)
        // })
        // effect(() => {
        //     console.log(`Tyre Component ${this.regionId()}`)
        // })
        effect(() => {
            if (this.id()) this.itemId.set(this.id()!)
        })
        effect(() => {
            if (this.displayPartView()) {
                this._displayPartView = { ...this.displayPartView() }
                this.images = this.displayPartView()!.images ?? []
                this.itemId.set(this.displayPartView()!.id!)
                if (this.displayPartView()!.id!) this.loadTyre(this.displayPartView()!.id!)
            }
        })

        effect(() => {
            console.log(`Current Item Type: ${this.currentitemType()}`)
        })

        effect(() => {
            console.log(`Item Id: ${this.itemId()}`)
        })
        effect(() => {
            this.onItemTypeChange(this.addTyreForm.itemType().value())
        })

        effect(() => {
            console.log(`Dispay : ${this.$displayTyre()} Rim: ${this.$displayRim()}`)
        })

        effect(() => {
            this.onCompanyChange(this.addTyreForm.companyId().value())
        })

        effect(() => {
            console.log(`Add Tyre Company Id: ${this.addTyreForm.companyId().value()}`)
        })

        effect(() => {
            this.onItemTypeChange(this.addTyreForm.itemType().value())
            if (this.itemId() && this.mode() === UpdateEnum.Update) {
                this.loadTyre(this.itemId()!)
            }
        })
    }

    get action() {
        if (this.mode() === UpdateEnum.New) {
            return this.labels.ADD
        } else {
            return this.labels.SAVE
        }
    }
    get allowanceNotReached(): boolean {
        if (this.$seller()) return true

        if (this.numberOfPartsPerUser! < this.staticSelectionService.maxNumberParts) return true

        return false
    }
    ngAfterViewInit(): void {
        goTop()
    }

    displaySections() {
        this.tyreDescription = this.currentitemType() === ItemType.Tyre ? 'Гума' : this.currentitemType() === ItemType.Rim ? 'Джанта' : 'Гума с Джанта'
    }

    ngOnInit() {
        this.mode = this.mode ?? UpdateEnum.New

        if (this.$seller())
            if (this.currentitemType())
                // if (this.params?.ad) {
                //     this.currentitemType = ItemType.Tyre
                // }

                this.addTyreFormModel.set({ ...this.addTyreFormModel(), itemType: this.currentitemType()! })
        this.displaySections()

        if (this.mode() === UpdateEnum.Update || this.mode() === UpdateEnum.View) {
            this.loadTyre(this.itemId!())
        }

        this.displaySections()
        window.scroll(0, 0)
        this.activatedRoute.queryParams.subscribe((params) => {
            this.params = params

            if (this.params.viewId) this.itemId.set(this.viewId())

            if (this.itemId()) {
                this.loadTyre(this.itemId())
            } else if (!this.id()) {
                this.nextIdService.getNextId(this.currentitemType()!).subscribe({
                    next: (nextId) => {
                        if (nextId.error) {
                            this.popupService.openWithTimeout('Съобщение', nextId.error, 2000).subscribe(() => {
                                this.goBack()
                            })
                        } else {
                            this.itemId.set(nextId.nextId!)
                        }
                    },
                    error: (error) => {
                        this.loggerService.logError(error)
                        this.popupService.openWithTimeout('Съобщение', 'Нова джанта/гума не може да бъде добавена!', 2000).subscribe(() => {
                            this.goBack()
                        })
                    },
                    complete: () => {
                        return
                    },
                })
            }
        })
    }

    get getNewId(): number {
        return Date.now()
    }

    onItemTypeChange(event: ItemType) {
        console.log(event)
        this.displaySections()
        this.addTyreFormModel.update((value) => ({
            ...value,
            tyreWidth: 0,
            tyreHeight: 0,
            tyreRadius: 0,
            tyreType: 0,
            tyreCompanyId: 0,
            companyId: 0,
            modelId: 0,
            rimMaterial: 0,
            rimOffset: 0,
            rimBoltCount: 0,
            rimBoltDistance: 0,
            rimCenter: 0,
            count: 0,
            monthDOT: 0,
            yearDOT: 0,
            description: '',
            price: 0,
            mainImageId: 0,
        }))
    }

    get dataManager() {
        return this.homeService.getDataManager(this.query()!)
    }

    defaultImageChanged(imageId: number) {
        this.addTyreForm.mainImageId().value.set(imageId)
    }
    $tyreResource = httpResource<RimWithTyre>(() => {
        if (this.id()) return `${environment.restAPI}/rimWithTyre/${this.id()}`
        else return undefined
    })

    loadTyre(id: number) {
        this.tyreService.getItem(id).subscribe({
            next: (tyre) => {
                this.currentItem = tyre
                //this.currentitemType = tyre.itemType ?? ItemType.Tyre
                this.displaySections()
                this.addTyreFormModel.update((value) => ({ ...value, ...this.currentItem }))
                this.mainImageId = this.currentItem.mainImageId

                if (tyre.rimWithTyreId)
                    this.imageService.getMinImages(tyre.rimWithTyreId!).subscribe((res) => {
                        this.images = res
                    })
            },
            error: () => {
                return
            },
            complete: () => {
                return
            },
        })
    }

    onSubmit() {
        this.submitted.set(true)
        if (this.addTyreForm().invalid()) {
            const snackBarRef = this.toastService.showToast('Моля попълнете задължителните полета!', 2)
            snackBarRef.afterDismissed().subscribe(() => {
                return
            })
            console.log(`Errors ${JSON.stringify(this.addTyreForm().errors())}`)
            console.log(this.addTyreForm().errorSummary())
            return
        }

        const item: RimWithTyre = Object.assign({}, this.addTyreForm().value())
        item.rimWithTyreId = this.itemId()
        this.tyreService.addUpdateItem(item, this.mode()).subscribe(() => {
            let message
            if (this.mode() == UpdateEnum.Update) message = `Обявата е успешно записана`
            else message = `Обявата е успешно добавена`
            this.userCountService.refresh()
            this.saved.emit(item.rimWithTyreId!)
            const snackBarRef = this.toastService.showToast(message, 2)

            snackBarRef.afterDismissed().subscribe(() => {
                this.goBack()
            })
            // this.popupService.openWithTimeout(this.labels.MESSAGE, message)
            // setTimeout(() => {
            // }, 2000)
        })
    }

    get moreImages() {
        return this.images.length < 10
    }

    showError(message: string) {
        this.popupService.openWithTimeout(this.labels.MESSAGE, message, 2000)
    }

    onCompanyChange(f: number) {
        this.companyId = f
    }

    //#region  Control enable/disable

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    focus(event: any) {
        // const nextControl: any = event.srcElement.nextElementSibling
        // if (nextControl) nextControl.focus()
    }

    cancel() {
        if (this.addTyreForm().touched()) {
            this.changeMessage()
        } else this.goBack()
    }
    goBack() {
        this.saved.emit(this.id()!)
        this.stateServce.currentId = this.id()
        if (this.mode() == UpdateEnum.New) {
            if (this.params?.ad) {
                this.router.navigate(['/data/tyres'])
                return
            }
        } else {
            history.back()
        }
    }

    changeMessage() {
        this.confirmService.OKCancel(CONSTANT.MESSAGE, 'Потвърдете, че искате да отмeните промените').subscribe((reuslt) => {
            if (reuslt === OKCancelOption.OK) {
                this.goBack()
            }
        })
    }
}
