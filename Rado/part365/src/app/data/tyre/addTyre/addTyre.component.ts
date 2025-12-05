import { NgClass, NgStyle } from '@angular/common'
import { AfterViewInit, Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { PopUpServiceService } from '@app/dialog/services/popUpService.service'
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
import { AlertService } from '@services/alert.service'
import { ModelService } from '@services/company-model-modification/model.service'
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

@Component({
    standalone: true,
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
    ],
})
export default class AddTyreComponent extends HelperComponent implements OnInit, AfterViewInit {
    @HostListener('window:keydown.esc', ['$event'])
    handleKeyDownEscape() {
        this.cancel()
    }
    @HostListener('window:keydown.enter', ['$event'])
    handleKeyDownEnter() {
        this.onSubmit()
    }

    addForm: FormGroup
    submitted = false
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
    viewId?: number
    query?: number
    userId?: number
    displayTyre?: boolean
    displayRim?: boolean
    goHome = false
    tyreDescription?: string
    initValue
    numberOfPartsPerUser?: number
    _displayPartView?: DisplayPartView
    updateFlag = true
    companyId?: number
    mainImageId?: number
    months = Array.from({ length: 53 }, (value, index) => {
        return { value: index + 1, text: (index + 1).toString() }
    })
    currentYear = new Date().getFullYear()
    years = Array.from({ length: this.currentYear - 2000 }, (value, index) => {
        return { value: index + 1, text: (index + 1).toString().padStart(2, '0') }
    })
    radioTypes: RadioButton[] = [
        { label: 'Гуми', id: 3 },
        { label: 'Джанти', id: 4 },
        { label: 'Джанти с гуми', id: 5 },
    ]

    @Input() mode: UpdateEnum = UpdateEnum.New
    @Input() itemType?: ItemType
    @Input() itemId?: number
    @Input() set displayPartView(value: DisplayPartView) {
        this._displayPartView = value
        if (this._displayPartView) {
            this.images = value.images ?? []
            this.itemId = this._displayPartView.id
            this.loadTyre(this.itemId!)
        }
    }
    @Output() back: EventEmitter<number> = new EventEmitter<number>()
    @Output() saved: EventEmitter<number> = new EventEmitter<number>()

    constructor(
        public staticSelectionService: StaticSelectionService,
        formBuilder: FormBuilder,
        private popupService: PopUpServiceService,
        private tyreService: TyreService,
        private alerService: AlertService,
        private modelService: ModelService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private homeService: HomeService,
        private pathService: PathService,
        private nextIdService: NextIdService,
        private imageService: ImageService,
        private stateServce: StateService,
        private navigationService: NavigationService,
        private confirmService: ConfirmServiceService,
        private loggerService: LoggerService,
        private userCountService: UserCountService
    ) {
        super()
        this.addForm = formBuilder.group({
            itemType: [0, [Validators.required, Validators.min(1)]],
            tyreWidth: [0, [Validators.required, Validators.min(1)]],
            tyreHeight: [0, [Validators.required, Validators.min(1)]],
            tyreRadius: [0, [Validators.required, Validators.min(1)]],
            tyreType: [0, [Validators.required, Validators.min(1)]],
            tyreCompanyId: [0],
            companyId: [0, [Validators.required, Validators.min(1)]],
            modelId: [0],
            rimMaterial: [0],
            rimOffset: [0],
            rimBoltCount: [0, [Validators.required, Validators.min(1)]],
            rimBoltDistance: [0],
            rimCenter: [0],
            count: [0, [Validators.required, Validators.min(1)]],
            monthDOT: [undefined],
            yearDOT: [undefined],
            regionId: [0],
            description: [''],
            price: [0, [Validators.required, Validators.min(1)]],
            mainImageId: [0],
        })
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
        this.initValue = this.addForm.value
    }

    get allowanceNotReached(): boolean {
        if (this.seller) return true

        if (this.numberOfPartsPerUser! < this.staticSelectionService.maxNumberParts) return true

        return false
    }
    ngAfterViewInit(): void {
        if (this.mode === UpdateEnum.New) {
            this.addForm.patchValue({ regionId: this.regionId })
        }

        if (this.seller)
            if (this.params?.ad) {
                this.itemType = ItemType.Tyre
            }
        this.addForm.patchValue({ itemType: this.itemType })
        this.displaySections()

        if (this.mode === UpdateEnum.Update || this.mode === UpdateEnum.View) {
            this.loadTyre(this.itemId!)
        }

        this.addForm.controls['itemType'].valueChanges.subscribe((f) => this.onItemTypeChange(f))
        this.addForm.controls['companyId'].valueChanges.subscribe((f) => this.onCompanyChange(f))
        goTop()
    }

    displaySections() {
        this.tyreDescription = this.itemType === ItemType.Tyre ? 'Гума' : this.itemType === ItemType.Rim ? 'Джанта' : 'Гума с Джанта'
        this.displayTyre = this.itemType === ItemType.Tyre || this.itemType === ItemType.RimWithTyre
        this.displayRim = this.itemType === ItemType.Rim || this.itemType === ItemType.RimWithTyre

        if (this.itemType === ItemType.Tyre) {
            this.controlTyre()
        } else if (this.itemType === ItemType.Rim) {
            this.controlRim()
        } else if (this.itemType === ItemType.RimWithTyre) {
            this.controlRimWithTyre()
        }
    }
    ngOnInit() {
        this.mode = this.mode ?? UpdateEnum.New
        this.updateFlag = this.mode != UpdateEnum.View

        this.displaySections()
        window.scroll(0, 0)
        this.activatedRoute.queryParams.subscribe((params) => {
            this.params = params
            if (this.params.id) this.itemId = +this.params.id

            if (this.params.viewId) this.itemId = this.viewId = +this.params.viewId
            if (this.params.update) this.mode = UpdateEnum.Update
            if (this.params.query) {
                this.query = +this.params.query
            }
            if (this.params.userId) {
                this.userId = +this.params.userId
            }
            if (this.viewId) this.itemId = this.viewId

            if (this.params.ad) {
                this.itemId = undefined
            }
            if (this.itemId) {
                this.loadTyre(this.itemId)
            } else if (this.viewId) {
                this.loadTyre(this.viewId)
            } else if (!this.itemId) {
                this.nextIdService.getNextId().subscribe({
                    next: (id) => {
                        this.itemId = id
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
            if (this.params.itemType) {
                this.itemType = +this.params.itemType
            }
        })
    }

    get getNewId(): number {
        return Date.now()
    }

    onItemTypeChange(event: ItemType) {
        if (this.itemType !== event) {
            this.itemType = event
            this.displaySections()
            this.addForm.patchValue({
                tyreWidth: undefined,
                tyreHeight: undefined,
                tyreRadius: undefined,
                tyreType: undefined,
                tyreCompanyId: 0,
                companyId: undefined,
                modelId: undefined,
                rimMaterial: undefined,
                rimOffset: undefined,
                rimBoltCount: undefined,
                rimBoltDistance: undefined,
                rimCenter: undefined,
                count: undefined,
                monthDOT: undefined,
                yearDOT: undefined,
                description: '',
                price: undefined,
                mainImageId: 0,
            })
        }
    }

    get dataManager() {
        return this.homeService.getDataManager(this.query!)
    }

    defaultImageChanged(imageId: number) {
        this.addForm.patchValue({ mainImageId: imageId })
    }

    loadTyre(id: number) {
        this.tyreService.getItem(id).subscribe({
            next: (tyre) => {
                this.currentItem = tyre
                this.itemType = tyre.itemType
                this.displaySections()
                this.addForm.patchValue(this.currentItem)
                this.mainImageId = this.currentItem.mainImageId
                this.displayTyre = this.itemType === ItemType.Tyre || this.itemType === ItemType.RimWithTyre
                this.displayRim = this.itemType === ItemType.Rim || this.itemType === ItemType.RimWithTyre
                if (this.itemType === ItemType.Tyre) this.controlTyre()
                else if (this.itemType === ItemType.Rim) this.controlRim()

                this.initValue = this.addForm.value
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
        this.submitted = true
        if (!this.addForm.valid) {
            this.showError('Моля попълнете задължителните полета!')
            return
        }

        const item: RimWithTyre = Object.assign({}, this.addForm.value)
        item.rimWithTyreId = this.itemId
        item.itemType = this.itemType
        this.tyreService.addUpdateItem(item, this.mode).subscribe(() => {
            let message
            if (this.mode == UpdateEnum.Update) message = `Обявата е успешно записана`
            else message = `Обявата е успешно добавена`
            this.userCountService.refresh()
            this.saved.emit(item.rimWithTyreId)
            this.popupService.openWithTimeout(this.labels.MESSAGE, message)
            setTimeout(() => {
                this.goBack()
            }, 2000)
        })
    }

    get action() {
        if (this.mode === UpdateEnum.New) {
            return this.labels.ADD
        } else {
            return this.labels.SAVE
        }
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

    controlTyre() {
        this.addForm.controls['tyreWidth'].setValidators([Validators.required, Validators.min(1)])
        this.addForm.controls['tyreHeight'].setValidators([Validators.required, Validators.min(1)])
        this.addForm.controls['tyreRadius'].setValidators([Validators.required, Validators.min(1)])
        this.addForm.controls['tyreType'].setValidators([Validators.required, Validators.min(1)])

        this.addForm.controls['tyreWidth'].updateValueAndValidity()
        this.addForm.controls['tyreHeight'].updateValueAndValidity()
        this.addForm.controls['tyreRadius'].updateValueAndValidity()
        this.addForm.controls['tyreType'].updateValueAndValidity()

        this.addForm.controls['companyId'].clearValidators()
        this.addForm.controls['rimBoltCount'].clearValidators()

        this.addForm.controls['companyId'].updateValueAndValidity()
        this.addForm.controls['rimBoltCount'].updateValueAndValidity()
    }

    controlRim() {
        this.addForm.controls['companyId'].setValidators([Validators.required, Validators.min(1)])
        this.addForm.controls['rimBoltCount'].setValidators([Validators.required, Validators.min(1)])

        this.addForm.controls['companyId'].updateValueAndValidity()
        this.addForm.controls['rimBoltCount'].updateValueAndValidity()

        this.addForm.controls['tyreWidth'].clearValidators()
        this.addForm.controls['tyreHeight'].clearValidators()
        this.addForm.controls['tyreRadius'].clearValidators()
        this.addForm.controls['tyreType'].clearValidators()

        this.addForm.controls['tyreWidth'].updateValueAndValidity()
        this.addForm.controls['tyreHeight'].updateValueAndValidity()
        this.addForm.controls['tyreRadius'].updateValueAndValidity()
        this.addForm.controls['tyreType'].updateValueAndValidity()
    }

    controlRimWithTyre() {
        this.addForm.controls['tyreWidth'].setValidators([Validators.required, Validators.min(1)])
        this.addForm.controls['tyreHeight'].setValidators([Validators.required, Validators.min(1)])
        this.addForm.controls['tyreRadius'].setValidators([Validators.required, Validators.min(1)])
        this.addForm.controls['tyreType'].setValidators([Validators.required, Validators.min(1)])

        this.addForm.controls['tyreWidth'].updateValueAndValidity()
        this.addForm.controls['tyreHeight'].updateValueAndValidity()
        this.addForm.controls['tyreRadius'].updateValueAndValidity()
        this.addForm.controls['tyreType'].updateValueAndValidity()

        this.addForm.controls['companyId'].setValidators([Validators.required, Validators.min(1)])
        this.addForm.controls['rimBoltCount'].setValidators([Validators.required, Validators.min(1)])

        this.addForm.controls['companyId'].updateValueAndValidity()
        this.addForm.controls['rimBoltCount'].updateValueAndValidity()
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    focus(event: any) {
        // const nextControl: any = event.srcElement.nextElementSibling
        // if (nextControl) nextControl.focus()
    }

    get changed() {
        return JSON.stringify(this.initValue) !== JSON.stringify(this.addForm.value)
    }

    cancel() {
        if (this.changed) {
            this.changeMessage()
        } else this.goBack()
    }
    goBack() {
        this.back.emit(this.itemId)
        this.stateServce.currentId = this.itemId
        if (this.mode == UpdateEnum.New) {
            if (this.params?.ad) {
                this.router.navigate(['/data/tyres'])
                return
            }
            if (this.navigationService.back()) return
            if (!this.params?.id && !this.params?.viewId) {
                return
            }

            const value = { id: this.params.id, viewPartId: this.params.viewId, query: this.params.query, userId: this.params.userId, page: 1 }
            this.pathService.navigate(value)
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
