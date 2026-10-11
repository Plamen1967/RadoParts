import { Component, ElementRef, ViewChild, OnInit, DestroyRef, inject, model, input, effect, output, computed } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { SelectionItem } from '@model/selectionItem'
import { ErrorService } from '@services/error.service'
import { NgClass, NgStyle } from '@angular/common'
import { OptionItem } from '@model/optionitem'
import { ChoiseComponent } from '@components/categoriesMin/choise/choise.component'
import { ButtonGroupComponent } from '@components/custom-controls/buttonGroup/buttongroup.component'
import { CompanyComponent } from '../company/company.component'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { FormValueControl, ValidationError } from '@angular/forms/signals'

@Component({
    selector: 'app-multiselection',
    templateUrl: './multiselection.component.html',
    styleUrls: ['./multiselection.component.css'],
    imports: [ButtonGroupComponent, NgClass, NgStyle, ChoiseComponent],
})
export class MultiSelectionComponent implements FormValueControl<string | number>, OnInit {
    value = model<string | number>('')
    @ViewChild('minGroup') minGroup?: ElementRef<HTMLInputElement>
    @ViewChild('normalGroup') normalGroup?: ElementRef<HTMLInputElement>
    filter = ''
    selectedValue14?: number
    _data?: OptionItem[]
    IsTouched = false
    isDisabled = false
    _letters: string[] = []
    _selection = ' '
    initialValue = ''
    letterItem = undefined
    active = false
    selections: Set<number> = new Set<number>()
    selection?: string

    errorMessage?: string

    changeOption = output<string>()
    changeOptions = output<Set<number>>()
    closeDialog = output<ElementRef>()
    showGroup = input<boolean>(false)
    data = model<OptionItem[]>([])
    label = input<string | undefined>(undefined)
    title = input<string | undefined>(undefined)
    hint = input<string | undefined>(undefined)
    showLetter = input<boolean | undefined>(undefined)
    useLetter = input<boolean | undefined>(undefined)
    isRequired = input<boolean | undefined>(undefined)
    submitted = input<boolean | undefined>(undefined)
    showAll = input<boolean>(true)
    groupDisabled = input<boolean>(false)
    useFilter = input<boolean>(false)
    multiSelection = input<boolean>(false)
    placeHolder = input<string | undefined>(undefined)
    showCount = input<boolean>(true)
    showImage = input<boolean>(true)
    IsInvalid = input<boolean>(false)
    readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);
    public dialog: MatDialog = inject(MatDialog)
    public errorService: ErrorService = inject(ErrorService)
    private destroyRef: DestroyRef = inject(DestroyRef)

    initialIDs = computed(() => {
        if (this.multiSelection()) {
            const models = this.value()
            console.log(`models`, models)
            if (this.value() && this.value() != '') {
                const ids = this.value().toString().split(',')
                const arr = ids.map((id) => +id)
                return arr
            } else {
                return []
            }
        } else {
            return []
        }
    })

    clearBox = computed<boolean>(() => {

        if (this.value() && this.value() != 0) {
            this.selection = this.placeHolder()?.replace('Избери', 'Добави')
            return true
        } else {
            this.selection = this.placeHolder()
            return false
        }
    })

    selectedValues = computed(() => {
        this.initialIDs()
        this.data()
        return this.getSelectedValues()
    })

    constructor() {
        effect(() => console.log(`Multi Selection Value constructor`, this.value()))
        effect(() => {
            const data_ = this.data()
            this.setData(data_)
        })

        effect(() => console.log(`initial IDS`, this.initialIDs()))
    }

    setDisabledState?(isDisabled: boolean): void {
        this.isDisabled = isDisabled
    }

    setData(data_: OptionItem[]) {
        if (data_) {
            this._data = [...data_]
        }
    }


    ngOnInit() {
        this._selection = this.placeHolder()?.replace('Избери', 'Добави') ?? ''
        this.selection = this.placeHolder()
    }

    clickSelect() {
        if (!this._data) return

        //const selection = this.initialIDs?.().map((element: number) => element.toString) ?? []
        const dialogRef = this.dialog.open(CompanyComponent, {
            height: '100%',
            width: '100%',
            panelClass: 'custom-container',
            disableClose: false,
            hasBackdrop: false,
            data: {
                showAll: true,
                data: this._data,
                useLetter: this.useLetter() ?? false,
                useFilter: this.useFilter() ?? false,
                showCount: this.showCount() ?? false,
                groupSelection: this.showGroup() ?? true,
                value: this.initialIDs?.().join(',') ?? '',
                multiSelection: true,
                groupDisabled: this.groupDisabled() ?? false,
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
        if (this.multiSelection()) 
        {
            this.value.set('')
            this.changeOption.emit(this.value().toString())
        } else {
            this.value.set(0)
            this.changeOption.emit(this.value().toString())
        }
    }

    change(value: number[]) {
        const values = value.map((item) => item.toString())
        this.value.set(values.join(','))
        this.changeOptions.emit(new Set([...value]))
        this.changeOption.emit(this.value().toString())
    }



    getSelectedValues(): SelectionItem[] {
        let data = this._data ?? []
        const initialIDs = this.initialIDs()
        if (initialIDs.length === 0) return []
        const selections = new Set(initialIDs)
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
        const initialIDs = this.initialIDs()
        const index = initialIDs.findIndex((item) => item == id)
        initialIDs.splice(index, 1)
        this.initialValue = initialIDs.join(',')
        this.change(initialIDs)
    }
}
