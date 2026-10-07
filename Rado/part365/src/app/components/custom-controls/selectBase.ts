import { computed, effect, signal } from '@angular/core'
import { TypeItem } from '@model/enum/typeItem'
import { InternalValue } from '@model/internalValue'
import { OptionItem } from '@model/optionitem'
import { SelectionItem } from '@model/selectionItem'

export class SelectBase {
    _data: InternalValue[] = []
    value = signal<string>('')
    _letters: string[] = []
    _selection = ' '
    groupSelection = false
    _useFilter = false
    _showAll = true
    _notSelected?: boolean
    useLetter?: boolean
    groupDisabled?: boolean
    _filter?: string
    _active = false
    multiSelection = false
    notLetterItems?: InternalValue[]
    letterItems?: InternalValue[]
    letterPerRow = 16
    label?: string
    selections = signal<number[]>([])
    firstLetters: string[] = []
    letterSelected?: string
    showCountOnly = 0
    found?: InternalValue[]
    //#region get/set invernal values

    selectedItems = computed(() => {
        return this._data
            .filter((item) => this.selections().includes(item.id!))
            .map((item) => {
                return { id: item.id, text: item.description, count: item.count }
            })
    })

    constructor() {
        effect(() => {
            this.selections.set(
                this.value()
                    ?.split(',')
                    .map((item) => +item) ?? []
            )
        })
    }

    setData(optionItems: OptionItem[] | SelectionItem[]) {
        this._data = optionItems.map((item) => {
            const obj = Object.assign(new InternalValue(), item)
            obj.typeItem = obj.id == -1 ? TypeItem.ALL : TypeItem.NORMAL
            return obj
        })
        if (this.useLetter) {
            this.generateLetters()
        }
    }

    getValue(): string {
        const value = this._data
            .filter((item) => item.isSelected)
            .map((item) => item.id)
            .join(',')
        return value
    }

    setBase(data: { groupSelection: boolean; useFilter: boolean; showAll: boolean; notSelected: boolean; letter: boolean; groupDisabled: boolean; letterItem: string }) {
        this.groupSelection = data.groupSelection ?? false
        this._useFilter = data.useFilter
        this._showAll = data.showAll
        this._notSelected = data.notSelected
        this.useLetter = data.letter
        this.groupDisabled = data.groupDisabled
        this.letterSelected = data.letterItem
    }

    generateLetters() {
        const letters = this._data.map((item) => (this.isSelectable(item) ? item.description![0] : '')).filter((item) => item != ' ')
        letters.sort()
        this.firstLetters = [...new Set([...letters])]
    }

    isSelectable(item: InternalValue) {
        return item.typeItem == TypeItem.ALL ? false : true
    }

    updateData() {
        if (!this._data) return
        const setId = new Set()
        this._data.forEach((item) => {
            const id = item.id
            let showItem = this.showItem(item)
            if (item.id! > 0 && setId.has(id) && this._filter?.length) showItem = false
            if (this.showCountOnly && item.id !== -1) if (!item.count) showItem = false
            item.showItem = showItem
            item.isSelected = this.isSelected(item)
            item.group = this.isGroup(item)
            item.isElementDisabled = this.isElementDisabled(item)
            item.checked = item.isSelected
            item.isSelectable = this.isSelectable(item)
            setId.add(item.id)
        })

        this.found = this._data.filter((item) => item.showItem)

        if (this.value() && this.value().length)
            this.selections.set(
                this.value()
                    ?.split(',')
                    .map((item) => +item)
            )
        else this.selections.set([])
    }

    isGroup(item: InternalValue): boolean {
        if (!this.groupSelection) return false

        const groupModelId = item.groupModelId
        const id = item.id

        if (groupModelId === id) return true

        return false
    }

    isSelected(item: InternalValue): boolean {
        if (!this.value()) return false

        if (!this.multiSelection) {
            if (this.selections().includes(item.id!)) {
                return true
            } else {
                return false
            }
        }

        if (this.selections().find((elem) => elem == item.id)) return true

        return false
    }

    isElementDisabled(item: InternalValue): boolean {
        if (item.typeItem === TypeItem.ALL) {
            return true
        }
        if (this.groupDisabled) {
            if (this.isGroup(item)) return true
        }
        return false
    }

    display(item: InternalValue) {
        return item.description
    }

    showItem(item: InternalValue) {
        if (this._useFilter && this._filter?.length) {
            const display: string = item.description!
            if (item.typeItem == TypeItem.ALL) return false

            return display.toLowerCase().startsWith(this._filter.toLowerCase())
        }

        if (item.id == 0) return false
        if (this.useLetter && this.letterSelected) {
            if (item.typeItem == TypeItem.ALL) return true

            const display: string = item.description ?? ''
            const firstLetter = display.toLowerCase()[0]
            return this.letterSelected.toLowerCase() === firstLetter
        }

        return true
    }

    //#region selection

    //#endregion

    //#region filter
    setFilter(value: string) {
        this._filter = value
        this.updateData()
    }
    //#endregion

    //#region active
    get active() {
        return this._active
    }

    set active(value: boolean) {
        this._active = value
    }

    clear(value?: string) {
        this.value.set(value ?? '')
        this.selections.set([])
    }

    unSelected(id: number) {
        const index = this._data.findIndex((item) => item.id === id)
        if (index != -1) {
            this._data[index].isSelected = false
        }

        if (this.selectedItems().length === 0) this.clear(undefined)
        else {
            const selection = this.selectedItems().map((item) => item.id!) ?? []
            this.selections.set([...selection])
        }
    }
}
