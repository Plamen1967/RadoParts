//#region  Imports
import { AfterViewInit, Component, DestroyRef, ElementRef, inject, OnInit, model, effect, input, output } from '@angular/core'
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

    changeOption = output<number | undefined>()
    closeDialog = output<ElementRef>()
    displayProperty = input<string>('text')
    valueProperty = input<string>('value')
    countProperty = input<string>('count')
    groupSelection = input<boolean>(false)
    tooltip = input<string | undefined>(undefined)
    label = input<string | undefined>(undefined)
    hint = input<string | undefined>(undefined)
    showLetter = input<boolean | undefined>(undefined)
    letter = input<boolean | undefined>(undefined)
    submitted = input<boolean | undefined>(undefined)
    isRequired = input<boolean | undefined>(undefined)
    isInvalid = input<boolean | undefined>(undefined)
    showAll = input<boolean>(true)
    groupDisabled = input<boolean>(false)
    useFilter = input<boolean>(false)
    multiSelection = input<boolean>(false)
    placeHolder = input<string | undefined>(undefined)
    isDisabled = input(false);
    data = input<OptionItem[] | undefined>(undefined)
    public dialog: MatDialog = inject(MatDialog)
    private destroyRef: DestroyRef = inject(DestroyRef)

    constructor() {
        effect(() => {
            this.clearBox = this.value() ? true : false
            this.selectedValue = this.value()
            this._selection = this.data_?.find((item) => item.id === this.value())?.description ?? this.placeHolder()
            this.changeOption.emit(this.value())
            if (this.data()) 
            {
                this.data_ = [...this.data()]

            if (this.groupDisabled()) {
                this.data_ = this.data_?.filter((item) => item['groupModelId'] != item.id)
            }
                this._selection = this.data_?.find((item) => item.id === this.value())?.description ?? this.placeHolder()
            }
        })
    }   
    ngOnInit() {
        this._selection = this.placeHolder()
    }

    ngAfterViewInit(): void {
        console.log(this.label)
    }

    get errorMessage() {
        const errorService: ErrorService = inject(ErrorService)
        return errorService.getMessage(this.label() ?? '', this.isInvalid() ? { required: true } : null)
    }

    get controlName(): string {
        return this.label() ?? this.placeHolder() ?? 'Избери'
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
        this._selection = this.placeHolder()
        this.value.set(undefined)
    }
    // get contolName(): string {
    //     return this.control.name?.toString() ?? this.placeHolder ?? this.label ?? 'Избери'
    // }

    //#endregion
}
