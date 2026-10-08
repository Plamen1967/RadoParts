//#region imports
import { Component, inject, model, input, effect } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
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

export class ModelChoiceComponent implements FormValueControl<number | string> {
    //#region variables and services
    isDisabled = false

    value = model<number | string>(0)

    models = model<OptionItem[]>([])

    multiselection = input<boolean>(true)
    groupDisabled = input<boolean>(false)
    showGroup = input<boolean>(true)
    companyId = input<number>(0)
    useFilter = input<boolean>(true)
    useLetter = input<boolean>(true)
    showLetter = input<boolean>(true)
    all = input<boolean>(false)
    submitted = input<boolean>(false)
    IsRequired = input<boolean>(false)
    userId = input<number | undefined>(undefined)
    showCount = input<boolean>(false)
    itemType = input<ItemType>(ItemType.All)
    //#region services
    public modelService: ModelService = inject(ModelService)
    public errorService: ErrorService = inject(ErrorService)
    //#region
    //#endregion
    constructor() {

        effect(() => {
            console.log(`Model Choice groupDisabled Value is: ${this.groupDisabled()}`)
        })
        effect(() => {
            console.log(`Model Choise ${this.value()}`)
            if (this.multiselection()) {
                this.value.set(this.value().toString())
            } else {
                this.value.set(Number(this.value()))
            }
        })

        effect(() => {
            console.log('Model Value:', this.value())
        })
        effect(() => {
            const companyId_ = this.companyId()
            if (companyId_) {
                this.onCompanyChage(companyId_)
            } else {
                this.models.set([])
            }
        })
    }
    setDisabledState?(isDisabled: boolean): void {
        this.isDisabled = isDisabled
    }

    focus() {
        return
    }

    filter(item: OptionItem) {
        if (!this.showGroup && item.id == item.groupModelId) return false
        if (this.all()) return true

        return item.count != 0 || item.id == 0
    }

    onCompanyChage(value: number) {
        if (this.userId()) {
            if (value) {
                this.modelService
                    .fetchByCompanyIdByUserId(value)
                    .subscribe((res) => {
                        const models = res
                        models.unshift({ modelId: 0, companyId: 0, groupModelId: 0, modelName: ' Избери модел', displayModelName: ' Избери модел', countCars: 0, countParts: 0 })
                        this.models.set(models
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
                            .filter((item) => this.filter(item)))
                        this.updateCount()
                    })
            } else {
                this.models.set([])
            }
        } else {
            if (value) {
                this.modelService
                    .fetchByCompanyId(value)
                    .subscribe((res) => {
                        const models = res
                        models.unshift({ modelId: 0, companyId: 0, groupModelId: 0, modelName: ' Избери модел', displayModelName: ' Избери модел', countCars: 0, countParts: 0 })
                        this.models.set(models
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
                            .filter((item) => this.filter(item)))
                        this.updateCount()
                    })
            } else {
                this.models.set([])
            }
        }
    }
    updateCount() {
        if (this.itemType() == ItemType.OnlyBus || this.itemType() == ItemType.OnlyCar) this.models().forEach((item) => (item.count = item.countCars))
        else if (this.itemType() == ItemType.CarPart || this.itemType() == ItemType.BusPart) this.models().forEach((item) => (item.count = item.countParts))
        else this.models().forEach((item) => (item.count = item.countParts + item.countCars))
    }
}
