//#region imports
import { Component, inject, Inject, OnInit } from '@angular/core'
import { SelectBase } from '../../selectBase'
import { TopService } from '@services/top.service'
import { Subscription } from 'rxjs'
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogContent } from '@angular/material/dialog'
import { InternalValue } from '@model/internalValue'
import { NgClass } from '@angular/common'
import { ChoiseComponent } from '@components/categoriesMin/choise/choise.component'
import { SearchInputComponent } from '@components/custom-controls/searchInput/searchInput.component'
import { DialogData } from '@model/dialogData'
//#endregion
//#region @Component
@Component({
    selector: 'app-model',
    templateUrl: './minmodel.component.html',
    styleUrls: ['./minmodel.component.css'],
    imports: [MatDialogContent, ChoiseComponent, MatDialogClose, NgClass, SearchInputComponent],
})
//#endregion
export class MinModelComponent extends SelectBase implements OnInit {
    value?: string
    subscription?: Subscription
    placeHolder?: string
    clearBox?: boolean
    private topService: TopService = inject(TopService)
    @Inject(MAT_DIALOG_DATA) public data: DialogData = inject(MAT_DIALOG_DATA)

    constructor() {
        super()
        this._data = []
    }

    ngOnInit() {
        this._useFilter = true
        this.useLetter = this.data.useLetter
        this.groupSelection = this.data.groupSelection
        this.value = this.data.value
        this.multiSelection = this.data.multiSelection
        this.groupDisabled = this.data.groupDisabled
        this.placeHolder = this.data.placeHolder ?? 'Избери'
        this.setData(this.data.data)
    }

    clickLetter(event: Event, letter: string) {
        event.stopPropagation()
        event.preventDefault()
        if (this.letterSelected == letter) this.letterSelected = undefined
        else this.letterSelected = letter

        this.updateData()
    }

    isSelectedLetter(letter: string) {
        const value = letter == this.letterSelected
        return value
    }

    filterChange(value: string) {
        this._filter = value
        this.updateData()
        this.clearBox = value ? true : false
    }

    clickItem(event: Event, item: InternalValue) {
        event.preventDefault()
        if (this.letterSelected == item.letters[0]) this.letterSelected = undefined
        else this.letterSelected = item.letters[0]
        this._filter = ''
    }

    close() {
        let selection = ''
        const selectedItems = this._data.filter((item) => item.isSelected && item.id! > 0)
        if (selectedItems) {
            selection = selectedItems.map((item) => item.id).join(',')
        }

        this.value = selection
        this.topService.returnData.next({ component: undefined, ids: selection })
    }

    deleteSelection(event: number) {
        const index = this._data.findIndex((item) => item.id == event)
        this._data[index].isSelected = false
        // TODO
        // this.updateSelection()
        // this.selectedValues = this.getSelectedValues()
    }
}
