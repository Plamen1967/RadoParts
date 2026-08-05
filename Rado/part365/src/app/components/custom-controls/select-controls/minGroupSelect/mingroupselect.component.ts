//#region
import { Component, EventEmitter, inject, Input, OnInit, Output, model, input } from '@angular/core'
import { TopService } from '@services/top.service'
import { MatDialog } from '@angular/material/dialog'
import { InternalValue } from '@model/internalValue'
import { SelectionItem } from '@model/selectionItem'
import { FormValueControl } from '@angular/forms/signals'

@Component({
    selector: 'app-mingroupselect',
    templateUrl: './mingroupselect.component.html',
    styleUrls: ['./mingroupselect.component.css'],
    imports: [],
})

//#endregion
export class MinGroupSelectComponent implements OnInit, FormValueControl<string |undefined> {
    value = model<string|undefined>(undefined)
    //#region members
    _selection = 'Избери данни'
    data = input<InternalValue[]>([])
    default = input('Избери данни')
    useFilter = input(false)
    useLetter = input(false)
    groupSelection = input(false)
    multiSelection = input(true)
    groupDisabled = input(false)
    setValue = input((value: string) => {
        this.writeValue(value)
    })
    // eslint-disable-next-line @angular-eslint/no-output-native
    @Output() change: EventEmitter<number[]> = new EventEmitter<number[]>()

    _data?: InternalValue[]
    id?: string
    ids?: number[]
    selectedItems?: string
    SelectionItems: SelectionItem[] = []
    private topService: TopService = inject(TopService)
    public dialog: MatDialog = inject(MatDialog)
    //#endregion
    //#region interface functions
    writeValue(obj: string): void {
        this.id = this.selectedItems = obj
        if (this.onChange) this.onChange(obj)
        this.updateSelection()
    }

    // Function to call when the rating changes.
    //#endregion
    //#region get
    get selection() {
        console.log(this._selection)
        return this._selection
    }

    get clearBox() {
        return this.selectedItems
    }
    //#endregion

    ngOnInit() {
        console.table(this._data)
        this._selection = this.default()
        this.updateSelection()
    }

    clear() {
        this.selectedItems = ''
        this.change.emit([])
    }

    updateSelection() {
        if (!this._data) {
            this._selection = this.default()
            return
        }
        if (this.selectedItems) {
            const ids = this.selectedItems.split(',')
            if (ids) {
                this.ids = ids.map((id) => +id)
            } else this.ids = []

            const selection = this._data.filter((item) => {
                return this.ids?.includes(item.id!)
            })
            this.SelectionItems = selection.map((item) => {
                return {
                    id: item.id,
                    text: item.description,
                    count: item.count,
                }
            })
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    returnValue(data: any) {
        this.selectedItems = data.ids
        let arr: number[] = []
        if (this.selectedItems?.length) arr = this.selectedItems?.split(',')?.map((item) => +item) ?? []
        this.onChange?.(this.selectedItems)
        this.change.emit(arr)
        this.updateSelection()
        this.topService.close.next(undefined)
    }
}
