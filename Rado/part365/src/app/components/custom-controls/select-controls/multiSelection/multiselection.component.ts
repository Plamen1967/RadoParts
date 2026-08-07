import { Component, ElementRef, ViewChild, OnInit, DestroyRef, inject, model, input, effect, output } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { SelectionItem } from '@model/selectionItem'
import { ErrorService } from '@services/error.service'
import { NgClass, NgStyle } from '@angular/common'
import { OptionItem } from '@model/optionitem'
import { ChoiseComponent } from '@components/categoriesMin/choise/choise.component'
import { ButtonGroupComponent } from '@components/custom-controls/buttonGroup/buttongroup.component'
import { CompanyComponent } from '../company/company.component'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { FormValueControl } from '@angular/forms/signals'

@Component({
    selector: 'app-multiselection',
    templateUrl: './multiselection.component.html',
    styleUrls: ['./multiselection.component.css'],
    imports: [ButtonGroupComponent, NgClass, NgStyle, ChoiseComponent],
})
export class MultiSelectionComponent implements FormValueControl<string | undefined>, OnInit {
    value = model<string | undefined>(undefined)
    @ViewChild('minGroup') minGroup?: ElementRef<HTMLInputElement>
    @ViewChild('normalGroup') normalGroup?: ElementRef<HTMLInputElement>
    filter = ''
    selectedValue?: number
    _data?: OptionItem[]
    IsTouched = false
    isDisabled = false
    _letters: string[] = []
    _selection = ' '
    initialValue = ''
    initialIDs?: number[]
    width = '100px'
    letterItem = undefined
    active = false
    selections: Set<number> = new Set<number>()
    selectedValues?: SelectionItem[]
    selection?: string

    clearBox?: boolean
    errorMessage?: string

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    changeOption = output<any>()
    changeOptions = output<Set<number>>()
    closeDialog = output<ElementRef>()
    groupSelection = input<boolean>(false)
    data = input<OptionItem[]>([])
    label = input<string | undefined>(undefined)
    title = input<string | undefined>(undefined)
    hint = input<string | undefined>(undefined)
    showLetter = input<boolean | undefined>(undefined)
    useLetter = input<boolean | undefined>(undefined)
    IsRequired = input<boolean | undefined>(undefined)
    submitted = input<boolean | undefined>(undefined)
    showAll = input<boolean>(true)
    groupDisabled = input<boolean>(false)
    useFilter = input<boolean>(false)
    multiSelection = input<boolean>(false)
    placeHolder = input<string | undefined>(undefined)
    showCount = input<boolean>(true)
    showImage = input<boolean>(true)
    IsInvalid = input<boolean>(false)
    public dialog: MatDialog = inject(MatDialog)
    public errorService: ErrorService = inject(ErrorService)
    private destroyRef: DestroyRef = inject(DestroyRef)

    constructor() {
        effect(() => {
            const data_ = this.data()
            this.setData(data_)
        })
    }

    setDisabledState?(isDisabled: boolean): void {
        this.isDisabled = isDisabled
    }

    setData(data_: OptionItem[]) {
        if (data_) {
            this._data = [...data_]
        }

        this.selectedValues = this.getSelectedValues()
        this.setClearBox(!!this.selectedValues?.length)
        this.value.set(this.initialValue)
    }

    setClearBox(clearBox: boolean) {
        this.clearBox = clearBox
        if (this.clearBox) this.selection = this.placeHolder()?.replace('Избери', 'Добави')
        else this.selection = this.placeHolder()
    }

    ngOnInit() {
        this._selection = this.placeHolder()?.replace('Избери', 'Добави') ?? ''
        this.selection = this.placeHolder()
    }

    clickSelect() {
        if (!this._data) return
        const dialogRef = this.dialog.open(CompanyComponent, {
            height: '100%',
            width: '100%',
            panelClass: 'custom-container',
            disableClose: false,
            hasBackdrop: false,
            data: {
                showAll: true,
                data: this._data,
                useLetter: this.useLetter ?? false,
                useFilter: this.useFilter ?? false,
                showCount: this.showCount,
                groupSelection: this.groupSelection ?? true,
                value: this.initialIDs ? this.initialIDs.join(',') : '',
                multiSelection: true,
                groupDisabled: this.groupDisabled,
                placeHolder: this.placeHolder,
            },
        })
        dialogRef
            .afterClosed()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((result) => {
                if (result) this.change(result)
            })
    }

    clear() {
        this.initialValue = ''
        this.change([])
    }

    writeValue(value: string): void {
        this.initialValue = value
        if (value?.length > 0) {
            const arr: string[] = this.initialValue?.split(',') ?? []
            this.initialIDs = arr.map((id) => +id)
        } else this.initialIDs = []
        this.selectedValues = this.getSelectedValues()
        this.setClearBox(!!this.selectedValues?.length)
    }

    change(value: number[]) {
        value = value.map((item) => +item)
        this.initialValue = [...value].join(',')
        this.initialIDs = [...value]
        this.selectedValues = this.getSelectedValues()
        this.setClearBox(!!this.selectedValues?.length)
        this.value.set(this.initialValue)
        this.changeOptions.emit(new Set([...value]))
    }

    getSelectedValues(): SelectionItem[] {
        let data = this._data ?? []
        if (!this.initialIDs) return []
        if (this.initialIDs?.length === 0) return []
        const selections = new Set([...this.initialIDs])
        let result = []
        data = data?.filter((item) => selections?.has(item.id!))
        if (data) {
            result = data.map((item) => {
                return { id: item.id, text: item.description, count: item.count }
            })
            return result
        }

        return []
    }

    deleteSelection(id: number) {
        let arr = (this.initialValue?.split(',') ?? []).map((id) => +id)
        arr = arr.filter((item) => +item != id)
        this.initialValue = arr.join(',')
        this.change(arr)
    }
}
