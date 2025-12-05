import { Component, ElementRef, EventEmitter, Input, Output, Self, ViewChild, OnInit, DestroyRef } from '@angular/core'
import { ControlValueAccessor, NgControl } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { SelectionItem } from '@model/selectionItem'
import { ErrorService } from '@services/error.service'
import { NgClass, NgStyle } from '@angular/common'
import { OptionItem } from '@model/optionitem'
import { ChoiseComponent } from '@components/categoriesMin/choise/choise.component'
import { ButtonGroupComponent } from '@components/custom-controls/buttonGroup/buttongroup.component'
import { CompanyComponent } from '../company/company.component'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'

@Component({
    standalone: true,
    selector: 'app-multiselection',
    templateUrl: './multiselection.component.html',
    styleUrls: ['./multiselection.component.css'],
    imports: [ButtonGroupComponent, NgClass, NgStyle, ChoiseComponent],
})
export class MultiSelectionComponent implements ControlValueAccessor, OnInit {
    @ViewChild('minGroup') minGroup?: ElementRef<HTMLInputElement>
    @ViewChild('normalGroup') normalGroup?: ElementRef<HTMLInputElement>
    filter = ''
    selectedValue?: number
    _data?: OptionItem[]
    touched = false
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
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private onTouched?() {}
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    private onChange?(_: unknown) {}

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Output() changeOption: EventEmitter<any> = new EventEmitter<any>()
    @Output() changeOptions: EventEmitter<Set<number>> = new EventEmitter<Set<number>>()
    @Output() closeDialog: EventEmitter<ElementRef> = new EventEmitter<ElementRef>()
    @Input() groupSelection = false
    @Input() set data(data_: OptionItem[]) {
        this.setData(data_)
    }
    @Input() label?: string
    @Input() title?: string
    @Input() hint?: string
    @Input() showLetter?: boolean
    @Input() useLetter?: boolean
    @Input() required?: boolean
    @Input() submitted?: boolean
    @Input() showAll = true
    @Input() groupDisabled = false
    @Input() useFilter = false
    @Input() multiSelection = false
    @Input() placeHolder?: string
    @Input() showCount = true
    @Input() showImage = true

    constructor(
        @Self() public control: NgControl,
        public dialog: MatDialog,
        public errorService: ErrorService,
        private destroyRef: DestroyRef
    ) {
        if (this.control) this.control.valueAccessor = this
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

    setData(data_: OptionItem[]) {
        if (data_) {
            this._data = [...data_]
        }

        this.selectedValues = this.getSelectedValues()
        this.setClearBox(!!this.selectedValues?.length)
        if (this.onChange) this.onChange(this.initialValue)
    }

    setClearBox(clearBox: boolean) {
        this.clearBox = clearBox
        if (this.clearBox) this.selection = this.placeHolder?.replace('Избери', 'Добави')
        else this.selection = this.placeHolder
    }

    ngOnInit() {
        this._selection = this.placeHolder ?? ''
        this.selection = this.placeHolder
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

    markAsTouched() {
        if (this.onTouched) {
            this.onTouched()
            this.touched = true
        }
    }
    change(value: number[]) {
        value = value.map((item) => +item)
        this.initialValue = [...value].join(',')
        this.initialIDs = [...value]
        this.selectedValues = this.getSelectedValues()
        this.setClearBox(!!this.selectedValues?.length)
        if (this.onChange) this.onChange(this.initialValue)
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
