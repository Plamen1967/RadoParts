//#region @Component
import { Component, HostListener, inject, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog'
import { SelectBase } from '@components/custom-controls/selectBase'
import { NgClass } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { DialogData } from '@model/dialogData'
import { InternalValue } from '@model/internalValue'
import { SearchInputComponent } from '@components/custom-controls/searchInput/searchInput.component'
import { ChoiseComponent } from '@components/categoriesMin/choise/choise.component'
import { RadioButton } from '@model/radioButton'
import { RadioGroupComponent } from '@components/custom-controls/radioGroup/radiogroup.component'

@Component({
    selector: 'app-company',
    templateUrl: './company.component.html',
    styleUrls: ['./company.component.css'],
    imports: [NgClass, FormsModule, MatDialogContent, MatDialogClose, SearchInputComponent, ChoiseComponent, RadioGroupComponent, ReactiveFormsModule],
})
//#endregion
export class CompanyComponent extends SelectBase implements OnInit {
    @HostListener('window:keydown.enter', ['$event']) clickEvent(event: Event) {
        event.stopPropagation()
        event.preventDefault()
        this.close()
        return true
    }
    //#region members
    _index = 0
    showAll = true
    placeHolder?: string
    showCount?: boolean = true
    radios: RadioButton[] = [
        { label: 'Всички', id: 0 },
        { label: 'С обяви', id: 1 },
    ]
    @Inject(MAT_DIALOG_DATA) public data: DialogData = inject(MAT_DIALOG_DATA)
    public dialogRef: MatDialogRef<CompanyComponent> = inject(MatDialogRef<CompanyComponent>)

    //#endregioninput
    constructor() {
        super()
    }

    index() {
        return this._index++
    }
    ngOnInit() {
        this.showAll = this.data.showAll
        this.showCount = this.data.showCount
        this.useLetter = this.data.useLetter
        this.groupSelection = this.data.groupSelection
        this.value.set(this.data.value)
        this.multiSelection = this.data.multiSelection
        this.groupDisabled = this.data.groupDisabled
        this.placeHolder = this.data.placeHolder ?? 'Избери'
        this.label = this.data.label
        this._useFilter = this.data.useFilter
        this.setData(this.data.data)
        this.updateData()
    }

    clickLetter(event: Event, letter: string) {
        event.stopPropagation()
        event.preventDefault()
        if (this.letterSelected == letter) this.letterSelected = undefined
        else this.letterSelected = letter

        this.updateData()
    }

    clearSelection() {
        this.selections.set([])
        this.letterSelected = undefined
        this.clear()
        this._data.forEach((item) => (item.isSelected = false))
        this.updateData()
    }

    filterChange(value: string) {
        this._filter = value
        this.updateData()
    }

    close() {
        this.dialogRef.close(this.selections())
        return
    }

    clickItem($event: Event, item: InternalValue) {
        if (!item.isSelectable) return

        if (item.isSelected) {
            const index = this.selections().findIndex((elem) => elem == item.id!)
            item.isSelected = !item.isSelected
            this.selections.update((current) => current.filter((_, i) => i !== index))
        } else {
            this.selections.update((current) => [...current, item.id!])
            item.isSelected = !item.isSelected
            if (!this.multiSelection) {
                this.dialogRef.close(this.selections())
            }
        }
    }

    deleteSelection($event: number) {
        const index = this._data.findIndex((item) => item.id == $event)
        this._data[index].isSelected = false
        const index2 = this.selections().findIndex((item) => item == $event)
        this.selections.update((current) => current.filter((_, i) => i !== index2))
        console.log(`Delete Selection: ${$event} Selections: ${this.selections()}`)
    }

    changed(event: number) {
        this.showCountOnly = event
        this.updateData()
        console.log(event ? 'С обяви' : 'Всички')
    }
}
