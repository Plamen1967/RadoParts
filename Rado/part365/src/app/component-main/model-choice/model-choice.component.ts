//#region imports
import { AfterViewInit, Component, DestroyRef, ElementRef, inject, Input, OnInit, model } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { TooltipDirective } from '@app/directive/tooltip.directive'
import { CustomSelectComponent } from '@components/custom-controls/x-custom-select/customSelect.component'
import { MultiSelectionComponent } from '@components/custom-controls/select-controls/multiSelection/multiselection.component'
import { ItemType } from '@model/enum/itemType.enum'
import { OptionItem } from '@model/optionitem'
import { ModelService } from '@services/company-model-modification/model.service'
import { ErrorService } from '@services/error.service'
import { FormValueControl } from '@angular/forms/signals'
//#endregion
//#region component
@Component({
    selector: 'app-model-choice',
    templateUrl: './model-choice.component.html',
    styleUrls: ['./model-choice.component.css'],
    imports: [CustomSelectComponent, MultiSelectionComponent, TooltipDirective, ReactiveFormsModule],
})
//#endregion
export class ModelChoiceComponent implements FormValueControl<number | undefined>, OnInit, AfterViewInit {
    //#region variables and services
    value = model<number | undefined>(undefined)
    modelForm: FormGroup
    models: OptionItem[] = []
    isDisabled = false
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    protected onTouched?() {}
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    protected onChange?(_: number) {}

    @Input() multiselection = true
    @Input() set companyId(value: number) {
        this.onCompanyChage(value)
    }
    @Input() useFilter = true
    @Input() useLetter = true
    @Input() showLetter = true
    @Input() groupSelection = true
    @Input() all = false
    @Input() submitted = false
    @Input() IsRequired = false
    @Input() userId = 0
    @Input() showCount = false
    @Input() itemType: ItemType = ItemType.All
    //#region services
    public modelService: ModelService = inject(ModelService)
    private formBuilder: FormBuilder = inject(FormBuilder)
    public errorService: ErrorService = inject(ErrorService)
    private element: ElementRef = inject(ElementRef)
    private destroyRef: DestroyRef = inject(DestroyRef)
    //#region
    //#endregion
    constructor() {
        this.modelForm = this.formBuilder.group({
            modelsId_int: [0],
        })
    }
    ngAfterViewInit(): void {
        this.modelForm.controls['modelsId_int'].valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((f) => {
            if (this.onChange) this.onChange(f)
        })
    }
    ngOnInit(): void {
        return
    }
    writeValue(value: string): void {
        this.modelForm.patchValue({ modelsId_int: value })
    }
    registerOnChange(fn: (_: unknown) => unknown): void {
        this.onChange = fn
    }
    registerOnTouched(fn: () => unknown): void {
        this.onTouched = fn
    }
    setDisabledState?(isDisabled: boolean): void {
        this.isDisabled = isDisabled
    }

    focus() {
        return
    }

    filter(item: OptionItem) {
        if (!this.groupSelection && item.id == item.groupModelId) return false
        if (this.all) return true

        return item.count != 0 || item.id == 0
    }

    onCompanyChage(value: number) {
        if (this.userId) {
            if (value) {
                this.modelService
                    .fetchByCompanyIdByUserId(value)
                    .pipe(takeUntilDestroyed(this.destroyRef))
                    .subscribe((res) => {
                        const models = res
                        models.unshift({ modelId: 0, companyId: 0, groupModelId: 0, modelName: ' Избери модел', displayModelName: ' Избери модел', countCars: 0, countParts: 0 })
                        this.models = models
                            .map((model) => {
                                return {
                                    id: model.modelId,
                                    description: model.displayModelName,
                                    groupModelId: model.groupModelId ?? 0,
                                    count: model.countCars + model.countParts,
                                    countParts: model.countParts,
                                    countCars: model.countCars,
                                    important: false,
                                }
                            })
                            .filter((item) => this.filter(item))
                        this.updateCount()
                    })
            } else {
                this.models = []
            }
        } else {
            if (value) {
                this.modelService
                    .fetchByCompanyId(value)
                    .pipe(takeUntilDestroyed(this.destroyRef))
                    .subscribe((res) => {
                        const models = res
                        models.unshift({ modelId: 0, companyId: 0, groupModelId: 0, modelName: ' Избери модел', displayModelName: ' Избери модел', countCars: 0, countParts: 0 })
                        this.models = models
                            .map((model) => {
                                return {
                                    id: model.modelId,
                                    description: model.displayModelName,
                                    groupModelId: model.groupModelId ?? 0,
                                    count: model.countCars + model.countParts,
                                    countParts: model.countParts,
                                    countCars: model.countCars,
                                    important: false,
                                }
                            })
                            .filter((item) => this.filter(item))
                        this.updateCount()
                    })
            } else {
                this.models = []
            }
        }
    }
    updateCount() {
        if (this.itemType == ItemType.OnlyBus || this.itemType == ItemType.OnlyCar) this.models.forEach((item) => (item.count = item.countCars))
        else if (this.itemType == ItemType.CarPart || this.itemType == ItemType.BusPart) this.models.forEach((item) => (item.count = item.countParts))
        else this.models.forEach((item) => (item.count = item.countParts + item.countCars))
    }
}
