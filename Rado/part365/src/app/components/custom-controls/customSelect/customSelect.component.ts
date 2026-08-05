//#region  Imports
import { AfterViewInit, Component, DestroyRef, ElementRef, EventEmitter, inject, Input, OnInit, Output, model, effect, input } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { NgClass, NgStyle } from '@angular/common'
import { ButtonGroupComponent } from '../buttonGroup/buttongroup.component'
import { OptionItem } from '@model/optionitem'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { FormValueControl } from '@angular/forms/signals'
import { CompanyComponent } from '../select-controls/company/company.component'
import { ErrorService } from '@services/error.service'
//#endregion
//#region  Component
@Component({
    selector: 'app-customselect',
    templateUrl: './customSelect.component.html',
    styleUrls: ['./customSelect.component.css'],
    imports: [NgClass, NgStyle, ButtonGroupComponent],
})
//#endregion

export class CustomSelectComponent implements OnInit, AfterViewInit, FormValueControl<number | undefined> {
    value = model<number | undefined>(undefined);
    selectedValue?: number
    letterItem = undefined
    _selection?: string
    data_: OptionItem[] = []
    clearBox?: boolean

    @Output() changeOption: EventEmitter<number | undefined> = new EventEmitter<number | undefined>()
    @Output() closeDialog: EventEmitter<ElementRef> = new EventEmitter<ElementRef>()
    @Input() displayProperty = 'text'
    @Input() valueProperty = 'value'
    @Input() countProperty = 'count'
    @Input() groupSelection = false
    @Input() set data(data_: OptionItem[]) {
        this.data_ = [...data_]

        if (this.groupDisabled) {
            this.data_ = this.data_?.filter((item) => item['groupModelId'] != item.id)
        }
        this._selection = this.data_?.find((item) => item.id === this.value())?.description ?? this.placeHolder
    }
    @Input() tooltip?: string
    @Input() label?: string
    @Input() hint?: string
    @Input() showLetter?: boolean
    @Input() letter?: boolean
    @Input() submitted?: boolean
    @Input() isRequired?: boolean
    @Input() isInvalid?: boolean
    @Input() showAll = true
    @Input() groupDisabled = false
    @Input() useFilter = false
    @Input() multiSelection = false
    @Input() placeHolder?: string
    readonly isDisabled = input(false);
    public dialog: MatDialog = inject(MatDialog)
    private destroyRef: DestroyRef = inject(DestroyRef)

    constructor() {
        effect(() => {
            this.clearBox = this.value() ? true : false
            this.selectedValue = this.value()
            this._selection = this.data_?.find((item) => item.id === this.value())?.description ?? this.placeHolder
            this.changeOption.emit(this.value())
        })
    }   
    ngOnInit() {
        this._selection = this.placeHolder
    }

    ngAfterViewInit(): void {
        console.log(this.label)
    }

    get errorMessage() {
        const errorService: ErrorService = inject(ErrorService)
        return errorService.getMessage(this.label!, this.isInvalid ? { required: true } : null)
    }

    get controlName(): string {
        return this.label ?? this.placeHolder ?? 'Избери'
    }
    clickSelect() {
        if (!this.data_) return
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
            },
        })
        dialogRef
            .afterClosed()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((result) => {
                if (result) this.value.set(result)
                console.log(`Dialog result: ${result}`)
            })
    }

    clear() {
        this._selection = this.placeHolder
        this.value.set(undefined)
    }
    // get contolName(): string {
    //     return this.control.name?.toString() ?? this.placeHolder ?? this.label ?? 'Избери'
    // }

    //#endregion
}
