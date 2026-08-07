//#region imports
import { Component, DestroyRef, inject, model, input, effect, output } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { TooltipDirective } from '@app/directive/tooltip.directive'
import { CustomSelectComponent } from '@components/custom-controls/x-custom-select/customSelect.component'
import { MultiSelectionComponent } from '@components/custom-controls/select-controls/multiSelection/multiselection.component'
import { ItemType } from '@model/enum/itemType.enum'
import { TypeItem } from '@model/enum/typeItem'
import { OptionItem } from '@model/optionitem'
import { Modification } from '@model/static-data/modification'
import { ModificationService } from '@services/company-model-modification/modification.service'
import { ErrorService } from '@services/error.service'
import { FormValueControl } from '@angular/forms/signals'
//#endregion
//#region component
@Component({
    selector: 'app-modification-choice',
    templateUrl: './modification-choice.component.html',
    styleUrls: ['./modification-choice.component.css'],
    imports: [CustomSelectComponent, MultiSelectionComponent, TooltipDirective, ReactiveFormsModule],
})
//#endregion
export class ModificationChoiceComponent implements FormValueControl<number | undefined> {
    //#region variables and services
    value = model<number | undefined>(undefined)    
    modifications: OptionItem[] = []
    modificationForm: FormGroup
    models_Id = ''
    modificationsId_int = ''
    isDisabled = false
    originalModification: Modification[] = []
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    protected onTouched?() {}
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    protected onChange?(_: number) {}
    multiselection = input<boolean>(true)
    useFilter = input<boolean>(true)
    all = input<boolean>(false)
    userId = input<number>(0)
    IsRequired = input<boolean>(false)
    submitted = input<boolean>(false)
    showCount = input<boolean>(false)
    itemType = input<ItemType>(ItemType.All) 
    modelsId = input<string | number>('')


    modifcationChange = output<Modification>()
    //#region services
    private modificationService: ModificationService = inject(ModificationService)
    private formBuilder: FormBuilder = inject(FormBuilder)
    public errorService: ErrorService = inject(ErrorService)
    private destroyRef: DestroyRef = inject(DestroyRef)
    //#endregion
    //#endregion

    constructor() {
        this.modificationForm = this.formBuilder.group({
            modificationsId_int: [0],
        })

        effect(() => {
            if (this.modelsId()) this.modelChange(this.modelsId().toString())
        })
        this.modificationForm.controls['modificationsId_int'].valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((f) => {
            const modification = this.originalModification.find((modification) => modification.modificationId == f)
            this.modifcationChange.emit(modification!)
            if (this.onChange) this.onChange(f)
        })
    }

    writeValue(value: string): void {
        this.modificationForm.patchValue({ modificationsId_int: value })
    }

    setDisabledState?(isDisabled: boolean): void {
        this.isDisabled = isDisabled
    }
    modelChange(value: string) {
        this.models_Id = value
        if (this.userId()) {
            if (value) {
                this.modificationService
                    .fetchModificationsByUserId(value)
                    .pipe(takeUntilDestroyed(this.destroyRef))
                    .subscribe((res) => {
                        this.originalModification = [...res]
                        res.unshift({
                            modelId: 0,
                            modificationId: 0,
                            modificationDisplayName: 'Избери модификация',
                            modificationName: 'Избери модификация',
                            yearFrom: 0,
                            yearTo: 0,
                            powerHP: 0,
                            countParts: 0,
                            countCars: 0,
                        })
                        this.modifications = res
                            .map((modification) => {
                                return {
                                    id: modification.modificationId,
                                    description: modification.modificationDisplayName,
                                    count: modification.countParts + modification.countCars,
                                    countParts: modification.countParts,
                                    countCars: modification.countCars,
                                    groupModelId: 0,
                                    typeItem: TypeItem.ALL,
                                }
                            })
                            .filter((item) => this.all || item.count != 0 || item.id == 0)
                        this.updateCount()
                    })
            } else {
                const modifications = [Modification.getAll()]
                this.modifications = modifications.map((modification) => {
                    return {
                        id: modification.modificationId,
                        description: modification.modificationDisplayName,
                        count: modification.countParts + modification.countCars,
                        countParts: modification.countParts,
                        countCars: modification.countCars,
                        groupModelId: 0,
                        typeItem: TypeItem.ALL,
                    }
                })
            }
        } else {
            if (value) {
                this.modificationService
                    .fetchModifications(value)
                    .pipe(takeUntilDestroyed(this.destroyRef))
                    .subscribe((res) => {
                        this.originalModification = [...res]
                        res.unshift({
                            modelId: 0,
                            modificationId: 0,
                            modificationDisplayName: 'Избери модификация',
                            modificationName: 'Избери модификация',
                            yearFrom: 0,
                            yearTo: 0,
                            powerHP: 0,
                            countParts: 0,
                            countCars: 0,
                        })
                        this.modifications = res
                            .map((modification) => {
                                return {
                                    id: modification.modificationId,
                                    description: modification.modificationDisplayName,
                                    count: modification.countParts + modification.countCars,
                                    countParts: modification.countParts,
                                    countCars: modification.countCars,
                                    groupModelId: 0,
                                    typeItem: TypeItem.ALL,
                                }
                            })
                            .filter((item) => this.all || item.count != 0 || item.id == 0)
                        this.updateCount()
                    })
            } else {
                const modifications = [Modification.getAll()]
                this.modifications = modifications.map((modification) => {
                    return {
                        id: modification.modificationId,
                        description: modification.modificationDisplayName,
                        count: modification.countParts + modification.countCars,
                        countParts: modification.countParts,
                        countCars: modification.countCars,
                        groupModelId: 0,
                        typeItem: TypeItem.ALL,
                    }
                })
            }
        }
    }
    focus() {
        return
    }
    updateCount() {
        if (this.itemType() == ItemType.OnlyBus || this.itemType() == ItemType.OnlyCar) this.modifications.forEach((item) => (item.count = item.countCars))
        else if (this.itemType() == ItemType.CarPart || this.itemType() == ItemType.BusPart) this.modifications.forEach((item) => (item.count = item.countParts))
        else this.modifications.forEach((item) => (item.count = item.countParts + item.countCars))
    }
}
