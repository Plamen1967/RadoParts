import { TypeItem } from '@model/enum/typeItem'
import { InternalValue } from '@model/internalValue'
import { OptionItem } from '@model/optionitem'
import { SelectionItem } from '@model/selectionItem'

export class SelectBase {
    _data: InternalValue[] = []
    _value = ''
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
    selectedValues: SelectionItem[] = []
    notLetterItems?: InternalValue[]
    letterItems?: InternalValue[]
    letterPerRow = 16
    label?: string
    selections: number[] = []
    firstLetters: string[] = []
    letterSelected?: string
    showCountOnly = 0;
    found?: InternalValue[];
    //#region get/set invernal values
    setData(optionItems: OptionItem[]|SelectionItem[]) {
        this._data = optionItems.map((item) => {
            const obj = Object.assign(new InternalValue(), item)
            obj.typeItem = obj.id == -1 ? TypeItem.ALL : TypeItem.NORMAL
            return obj
        })
        if (this.useLetter) {
            this.generateLetters()
        }
    }

    _setValue(value: string): void {
        this._value = value
        this.selections = this._value?.split(',').map((item) => +item)
        this.selectItems()
    }

    selectItems(): void {
        this.selections?.forEach((id) => {
            const index = this._data.findIndex((item) => item.id == id)
            this._data[index].isSelected = true
        })
    }

    get selectedItems() {
        const result = this._data.filter((item) => item.isSelected)

        return result
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

    get selecttion(): number[] {
        if (this._value) {
            return this._value?.split(',').map((item) => +item)
        } else return []
    }

    generateLetters() {
        const letters = this._data.map((item) => (this.isSelectable(item) ? item.description![0] : '')).filter((item) => item != ' ')
        letters.sort()
        this.firstLetters = [...new Set([...letters])]
    }

    isSelectable(item: InternalValue) {
        return item.typeItem == TypeItem.ALL ? false : true
    }

    // setData(data_: any[]) {
    //     this._data = data_
    //     this._letters = []
    //     const selectedValues: number[] = this.selecttion;

    //     const index = this._data?.findIndex((item) =>  item.id! in selectedValues? true:false);
    //     if (index != -1)
    //         this._selection = this._data[index].description ?? ''

    //     this.updataData()
    //     this.selectedValues = this.getSelectedValues()
    // }

    // getSelectedValues(): SelectionItem[] {
    //     let data = this._data ?? []
    //     if (this.selections.size === 0) return []

    //     data = data?.filter((item) => this.selections?.has(item.value))
    //     if (data) {
    //         let result = data.map((item) => {
    //             return { id: item.value, text: item.display, count: item.count }
    //         })
    //         return result
    //     }
    // }
    updateData() {
        if (!this._data) return
        const setId = new Set()
        this.selectedValues = []
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

        this.found = this._data.filter(item => item.showItem);

        if (this._value && this._value.length) this.selections = this._value?.split(',').map((item) => +item)
        else this.selections = []
        this.updateSelection();
    }

    isGroup(item: InternalValue): boolean {
        if (!this.groupSelection) return false

        const groupModelId = item.groupModelId
        const id = item.id

        if (groupModelId === id) return true

        return false
    }

    isSelected(item: InternalValue): boolean {
        if (!this._value) return false

        if (!this.multiSelection) {
            if (item.id == +this._value) {
                return true
            } else {
                return false
            }
        }

        if (this.selecttion.find((elem) => elem == item.id)) return true

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
    get selection() {
        return this._selection
    }

    set selection(value) {
        this._selection = value
    }
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
        this._value = value ?? ''
    }

    updateSelection() {
        this.selectedValues.length = 0
        this._data.forEach((item) => {
            if (item.isSelected) {
                this.selectedValues.push({ id: item.id!, text: item.description!, count: item.count })
            }
        })
    }

    unSelected(id: number) {
        const index = this._data.findIndex((item) => item.id === id)
        if (index != -1) {
            this._data[index].isSelected = false
        }

        if (this.selectedItems.length === 0) this.clear(undefined)
        else {
            const selection = this.selectedItems.map((item) => item.id)
            this.selection = [...selection].join(',')
            this._value = this.selection
        }
    }
}
