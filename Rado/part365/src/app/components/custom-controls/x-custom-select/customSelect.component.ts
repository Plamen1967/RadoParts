import { Component, DestroyRef, ElementRef, EventEmitter, inject, Output, model, input, effect } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { CompanyComponent } from '../select-controls/company/company.component'
import { NgClass, NgStyle } from '@angular/common'
import { ButtonGroupComponent } from '../buttonGroup/buttongroup.component'
import { OptionItem } from '@model/optionitem'
import { AlertService } from '@services/alert.service'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { FormValueControl } from '@angular/forms/signals'

@Component({
    selector: 'app-customselect',
    templateUrl: './customSelect.component.html',
    styleUrls: ['./customSelect.component.css'],
    imports: [NgClass, NgStyle, ButtonGroupComponent, ReactiveFormsModule],
})
export class CustomSelectComponent implements FormValueControl<number | undefined> {
    value = model<number | undefined>(undefined)
    selectedValue?: number
    letterItem = undefined
    _selection?: string
    data_: OptionItem[] = []
    clearBox?: boolean
    loaded = false

    @Output() changeOption: EventEmitter<number> = new EventEmitter<number>()
    @Output() closeDialog: EventEmitter<ElementRef> = new EventEmitter<ElementRef>()

    groupSelection = input<boolean>(false)
    data = input<OptionItem[]>([])
    tooltip = input<string | undefined>(undefined)
    label = input<string | undefined>(undefined)
    hint = input<string | undefined>(undefined)
    showLetter = input<boolean | undefined>(undefined)
    letter = input<boolean | undefined>(undefined)
    IsRequired = input<boolean | undefined>(undefined)
    submitted = input<boolean | undefined>(undefined)
    showAll = input<boolean>(true)
    groupDisabled = input<boolean>(false)
    useFilter = input<boolean>(false)
    multiSelection = input<boolean>(false)
    placeHolder = input<string | undefined>(undefined)
    showCount = input<boolean>(true)
    select = input<number | undefined>(undefined)
    errorMessage?: string
    IsInvalid = false
    public dialog: MatDialog = inject(MatDialog)
    private alertService: AlertService = inject(AlertService)
    private destroyRef: DestroyRef = inject(DestroyRef)

    constructor() {
        effect(() => {
            this.writeValue(this.select() ?? 0)
        })

        effect(() => {
            this.data_ = [...this.data()]

            if (this.groupDisabled()) {
                this.data_ = this.data_?.filter((item) => item['groupModelId'] != item.id)
            }
            this._selection = this.data_?.find((item) => item.id === this.value())?.description ?? this.placeHolder()
            if (this.data_ && this.data_.length) this.loaded = true
            if (this.value) {
                this.writeValue(this.value()!)
            }
        })
        this._selection = this.placeHolder()
    }

    // get errorMessage() {
    //     return this.errorService.getMessage(this.label, this.control.errors)
    // }

    //#region ValueAccessor
    writeValue(value: number): void {
        this.value.set(value)
        this.clearBox = value ? true : false
        this._selection = this.data_?.find((item) => item.id === value)?.description ?? this.placeHolder()
        this.changeOption.emit(value)
    }

    change(value?: number) {
        if (!value) value = 0
        this.value.set(value)
        if (this.value) this.value.set(+this.value)
        this.clearBox = value ? true : false
        this._selection = this.data_?.find((item) => item.id == +value!)?.description ?? this.placeHolder()
        this.changeOption.emit(value!)
    }

    clickSelect() {
        const dialogRef = this.dialog.open(CompanyComponent, {
            height: '100%',
            width: '100%',
            panelClass: 'custom-container',
            data: {
                data: this.data_,
                userFilter: this.useFilter ?? false,
                groupSelection: this.groupSelection ?? true,
                value: this.value,
                multiSelection: this.multiSelection,
                groupDisabled: this.groupDisabled,
                placeHolder: this.placeHolder,
                showCount: this.showCount,
                useFilter: true,
                label: '',
            },
        })
        dialogRef
            .afterClosed()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((result) => {
                if (result) this.change(result)
                this.alertService.info(`Dialog result: ${result}`)
            })
    }

    clear() {
        this._selection = this.placeHolder()
        this.change(undefined)
    }
    get contolName(): string {
        return this.contolName ?? this.placeHolder() ?? this.label ?? 'Избери'
    }

    //#endregion
}

