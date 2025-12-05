import { Component, DestroyRef, ElementRef, EventEmitter, Input, Output, Self } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { ControlValueAccessor, FormBuilder, FormGroup, NgControl, ReactiveFormsModule } from '@angular/forms'
import { TooltipDirective } from '@app/directive/tooltip.directive'
import { CustomSelectComponent } from '@components/custom-controls/x-custom-select/customSelect.component'
import { MultiSelectionComponent } from '@components/custom-controls/select-controls/multiSelection/multiselection.component'
import { ItemType } from '@model/enum/itemType.enum'
import { TypeItem } from '@model/enum/typeItem'
import { OptionItem } from '@model/optionitem'
import { Modification } from '@model/static-data/modification'
import { ModificationService } from '@services/company-model-modification/modification.service'
import { ErrorService } from '@services/error.service'

@Component({
    standalone: true,
    selector: 'app-modification-choice',
    templateUrl: './modification-choice.component.html',
    styleUrls: ['./modification-choice.component.css'],
    imports: [CustomSelectComponent, MultiSelectionComponent, TooltipDirective, ReactiveFormsModule],
})
export class ModificationChoiceComponent implements ControlValueAccessor {
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

    @Input() multiselection = true
    @Input() useFilter = true
    @Input() all = false
    @Input() userId = 0
    @Input() required = false
    @Input() submitted = false
    @Input() showCount = false;
    @Input() itemType: ItemType = ItemType.All
    @Input() set modelsId(value: string | number) {
        this.modelChange(value.toString())
    }

    @Output() modifcationChange: EventEmitter<Modification> = new EventEmitter<Modification>()

    constructor(
        private modificationService: ModificationService,
        private formBuilder: FormBuilder,
        @Self() public control: NgControl,
        public errorService: ErrorService,
        private element: ElementRef,
        private destroyRef: DestroyRef
    ) {
        if (this.control) this.control.valueAccessor = this
        this.modificationForm = formBuilder.group({
            modificationsId_int: [0],
        })

        this.modificationForm.controls['modificationsId_int'].valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((f) => {
            const modification = this.originalModification.find((modification) => modification.modificationId == f)
            this.modifcationChange.emit(modification)
            if (this.onChange) this.onChange(f)
        })
    }

    writeValue(value: string): void {
        this.modificationForm.patchValue({ modificationsId_int: value })
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
    modelChange(value: string) {
        this.models_Id = value
        if (this.userId) {
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
        if (this.itemType == ItemType.OnlyBus || this.itemType == ItemType.OnlyCar) this.modifications.forEach((item) => (item.count = item.countCars))
        else if (this.itemType == ItemType.CarPart || this.itemType == ItemType.BusPart) this.modifications.forEach((item) => (item.count = item.countParts))
        else this.modifications.forEach((item) => (item.count = item.countParts + item.countCars))
    }
}
