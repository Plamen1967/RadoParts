//#region
import { Component, EventEmitter, inject, Input, OnInit, Output, ChangeDetectionStrategy } from '@angular/core'
import { ControlValueAccessor } from '@angular/forms'
import { TopService } from '@services/top.service'
import { MatDialog } from '@angular/material/dialog'
import { InternalValue } from '@model/internalValue'
import { SelectionItem } from '@model/selectionItem'
import { BaseControl } from '@components/custom-controls/baseControl'

@Component({
    selector: 'app-mingroupselect',
    templateUrl: './mingroupselect.component.html',
    styleUrls: ['./mingroupselect.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [],
})

//#endregion
export class MinGroupSelectComponent extends BaseControl<string> implements OnInit, ControlValueAccessor {
    override get contolName(): string {
        throw new Error('Method not implemented.')
    }
    //#region members
    _selection = 'Избери данни'
    @Input() data: InternalValue[] = []
    @Input() default = 'Избери данни'
    @Input() useFilter = false
    @Input() useLetter = false
    @Input() groupSelection = false
    @Input() multiSelection = true
    @Input() groupDisabled = false
    @Input() set setValue(value: string) {
        this.writeValue(value)
    }
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
    //#region constructor
    constructor() {
        super()
    }
    //#endregion
    //#region interface functions
    override writeValue(obj: string): void {
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
        this._data = this.data
        console.table(this._data)
        this._selection = this.default
        this.updateSelection()
    }

    clear() {
        this.selectedItems = ''
        this.change.emit([])
    }

    updateSelection() {
        if (!this._data) {
            this._selection = this.default
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
        this.onChange?.(this.selectedItems!)
        this.change.emit(arr)
        this.updateSelection()
        this.topService.close.next(undefined)
    }
}
