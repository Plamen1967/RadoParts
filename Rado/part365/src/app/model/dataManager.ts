import { Subject } from 'rxjs'
import { CountItems } from './countItems'
import { DisplayPartView } from './displayPartView'
import { SearchResult } from './searchResult'
import { ItemType } from './enum/itemType.enum'
import { sortPart } from '@app/functions/functions'
import { SortType } from './enum/sortType.enum'
import { UserCount } from './userCount'

export class DataManager {
    public allParts?: DisplayPartView[]
    public filterType?: number
    private itemPerPage = 10
    public pageParts?: DisplayPartView[]
    public currentPage = 0
    public searched = false
    public numberPages?: number
    public submitted: boolean | undefined = undefined
    public extendedSearch?: boolean = false
    public _currentId?: number
    public _loading = false
    public displayFilter = true
    public showParts = false
    public _searchResult: SearchResult | undefined
    public sortType = 0
    public static showAll = false
    public countItems: CountItems = new CountItems()
    public userCount: UserCount = new UserCount()
    ids: number[] = [];
    dataSubject = new Subject<DisplayPartView[]>()

    get currentId(): number | undefined {
        return this._currentId
    }

    set currentId(value: number) {
        if (!value) return
        this._currentId = +value
        const index = this.filterData?.findIndex((item) => item.id == +value)
        this.currentPage = Math.floor(index / this.itemPerPage) + 1
        this.getPageData()
    }

    get filterData(): DisplayPartView[] {
        if (!this.filterType) return this.allParts ?? []

        let filterData: DisplayPartView[] | undefined
        if (this.filterType == ItemType.All) filterData = this.allParts
        else if (this.filterType == ItemType.CarPart) filterData = this.allParts?.filter((part) => part.itemType == this.filterType)
        else if (this.filterType == ItemType.BusPart) filterData = this.allParts?.filter((part)  => part.itemType == this.filterType)
        else if (this.filterType == ItemType.OnlyCar) filterData = this.allParts?.filter((part)  => part.itemType == this.filterType)
        else if (this.filterType == ItemType.OnlyBus) filterData = this.allParts?.filter((part)  => part.itemType == this.filterType)
        else if (this.filterType == ItemType.AllCarAndPart) filterData = this.allParts?.filter((part) => part.bus == 0 && (part.itemType == ItemType.OnlyCar || part.itemType == ItemType.CarPart))
        else if (this.filterType == ItemType.AllBusAndPart) filterData = this.allParts?.filter((part) => part.bus == 1&& (part.itemType == ItemType.OnlyBus || part.itemType == ItemType.BusPart))
        else filterData = this.allParts?.filter((part) => part.itemType == this.filterType) ?? []

        return filterData ?? []
    }

    setFilterType(value: number) {
        this.filterType = value
        this.getPageData()
    }

    clearData() {
        this.allParts = []
        this.pageParts = []
        this.searched = false
        this.submitted = undefined
        this.filterType = undefined
    }

    public noParts(): boolean {
        return this.filterData ? this.filterData.length === 0 : false
    }

    public getDispayPartViewById(id: number) {
        const index = this.filterData.findIndex((item) => item.id === +id)
        if (index !== undefined) return this.filterData[index]

        return undefined
    }

    sortData(sortType: SortType) {
        if (!this.filterData || this.filterData.length === 0) return
        this.filterData.sort((a, b) => sortPart(sortType, a, b))
        this.currentPage = 1

        this.pageParts = this.filterData.slice((this.currentPage - 1) * this.itemPerPage, this.currentPage * this.itemPerPage)
        this.ids = this.pageParts.map((part) => part.id).filter((id): id is number => id !== undefined)
    }

    getPageData() {
        if (!this.allParts) {
            return
        }
        if (this.currentPage === undefined) this.currentPage = 1
        if (DataManager.showAll) {
            this.pageParts = this.filterData
            this.currentPage = 1
            this.numberPages = 1
        } else {
            this.numberPages = Math.ceil(this.filterData.length / this.itemPerPage)
            this.pageParts = this.filterData.slice((this.currentPage - 1) * this.itemPerPage, this.currentPage * this.itemPerPage)
        }

        this.dataSubject.next(this.pageParts)

        return
    }

    get loading() {
        return this._loading
    }

    set loading(value) {
        this._loading = value
    }

    updateData(result: SearchResult) {
        if (result) {
            this.searched = true
            this.searchResult = result
            this.allParts = result?.data
            this.filterData.sort((a, b) => sortPart(this.sortType, a, b))
            this.currentPage = 1
            this.getPageData()
        }
    }

    get searchResult() {
        return this._searchResult
    }

    set searchResult(result: SearchResult | undefined) {
        this._searchResult = result
        // TODO
        if (this._searchResult) {
            this.countItems.countCar = this._searchResult?.data?.filter((item) => item.bus == 0 && (item.itemType == ItemType.OnlyCar || item.itemType == ItemType.CarPart)).length
            this.countItems.countBus = this._searchResult?.data?.filter((item) => item.bus == 1 && (item.itemType == ItemType.OnlyBus || item.itemType == ItemType.BusPart)).length
            this.countItems.countTyre = this._searchResult?.data?.filter((item) => item.itemType == ItemType.Tyre).length
            this.countItems.countRim = this._searchResult?.data?.filter((item) => item.itemType == ItemType.Rim).length
            this.countItems.countTyreWithRim = this._searchResult?.data?.filter((item) => item.itemType == ItemType.RimWithTyre).length


            this.userCount  = this._searchResult.userCount!;
            // this.userCount.carCount = this._searchResult?.data?.filter((item) => item.bus == 0 && item.itemType == ItemType.OnlyCar).length ?? 0
            // this.userCount.busCount = this._searchResult?.data?.filter((item) => item.bus == 1 && item.itemType == ItemType.OnlyBus).length ?? 0
            // this.userCount.partCarCount = this._searchResult?.data?.filter((item) => item.bus == 0 && item.itemType == ItemType.CarPart).length ?? 0
            // this.userCount.partBusCount = this._searchResult?.data?.filter((item) => item.bus == 1 && item.itemType == ItemType.BusPart).length ?? 0
            // this.userCount.tyreCount = this.countItems.countTyre ?? 0;
            // this.userCount.rimCount = this.countItems.countRim ?? 0;
            // this.userCount.rimWithTyreCount = this.countItems.countTyreWithRim ?? 0;
        }
    }

    //#region move through items
    first() {
        return this.filterData[0].id === this._currentId
    }

    last() {
        return this.filterData[this.filterData.length - 1].id === this._currentId
    }

    next() {
        const index = this.filterData.findIndex((item) => item.id === this._currentId)
        if (index < this.filterData.length - 1) {
            this._currentId = this.filterData[index + 1].id
            return this.filterData[index + 1]
        }
        return undefined
    }

    previous() {
        const index = this.filterData.findIndex((item) => item.id === this._currentId)
        if (index !== 0) {
            this._currentId = this.filterData[index - 1].id
            return this.filterData[index - 1]
        }
        return undefined
    }
    //#endregion

    //#region update items
    updateItem(updateItem: DisplayPartView) {
        const index = this.filterData.findIndex((item) => item.id === updateItem.id)
        if (index != -1) this.filterData[index] = {...updateItem}

        if (this.pageParts) {
            const pageindex = this.pageParts.findIndex((item) => item.id === updateItem.id)
            if (pageindex != -1) this.pageParts[pageindex] = {...updateItem}
        }
    }
    removeItem(index: number) {
        if (index != -1) {
            this.allParts?.splice(index, 1)
        }
    }

    delete(itemToDelete: DisplayPartView) {
        // TODO
        if (itemToDelete.isCar) {
            const items = this.allParts?.filter((item) => item.carId === itemToDelete.carId)
            items?.forEach((item) => {
                this.removeItem(item.id!)
            })
        }

        const index = this.allParts?.findIndex((item) => item.id === itemToDelete.id)
        if (index) this.removeItem(index)

        if (this._currentId === itemToDelete.id) this._currentId = undefined

        if (index != -1) this.currentPage = Math.floor(index! / this.itemPerPage) + 1
        this.getPageData()
    }
    //#endregion
}
