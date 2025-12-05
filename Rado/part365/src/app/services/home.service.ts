import { Injectable } from '@angular/core'
import { DataManager } from '@model/dataManager'
import { SearchResult } from '@model/searchResult'
import { DisplayPartView, Enrich } from '@model/displayPartView'
import { Filter } from '@model/filters/filter'
import { SearchPartService } from './searchPart.service'
import { Part } from '@model/part/part'
import { StaticSelectionService } from './staticSelection.service'

@Injectable({
    providedIn: 'root',
})
export class HomeService {
    dataManagers: Map<number, DataManager> = new Map<number, DataManager>()

    constructor(public searchPartService: SearchPartService,
        private staticService: StaticSelectionService
    ) {}
    updateDisplayPartView(updatedItem: DisplayPartView) {
        this.updateItem(updatedItem.id!, updatedItem)
    }
    updateItem(id: number, updatedItem: DisplayPartView) {
        this.dataManagers.forEach((manager) => {
            manager.allParts = manager.allParts?.map((elem) => {
                if (elem.id === id) return { ...updatedItem }
                else return elem
            })

            manager.pageParts = manager.pageParts?.map((elem) => {
                if (elem.id === id) return { ...updatedItem }
                else return elem
            })
        })
    }
    updatePart(part: Part) {
        this.dataManagers.forEach((manager) => {
            manager.allParts = manager.allParts?.map((elem) => {
                if (elem.id === part.partId) return { ...Enrich(part, this.staticService)}
                else return elem
            })

            manager.pageParts = manager.pageParts?.map((elem) => {
                if (elem.id === part.partId) return { ...Enrich(part, this.staticService) }
                else return elem
            })
        })
    }
    deleteCar(carId: number) {
        this.dataManagers.forEach((manager) => {
            manager.allParts = manager.allParts?.filter((elem) => elem.carId !== carId)
            manager.pageParts = manager.pageParts?.filter((elem) => elem.carId !== carId)
            manager.allParts = manager.allParts?.filter((elem) => elem.id !== carId)
            manager.pageParts = manager.pageParts?.filter((elem) => elem.id !== carId)
        })
    }

    deletePart(id: number) {
        this.dataManagers.forEach((manager) => {
            manager.allParts = manager.allParts?.filter((elem) => elem.id !== id)
            manager.pageParts = manager.pageParts?.filter((elem) => elem.id !== id)
        })
    }

    deleteItem(id: number) {
        this.dataManagers.forEach((manager) => {
            manager.allParts = manager.allParts?.filter((elem) => elem.id !== id)
            manager.pageParts = manager.pageParts?.filter((elem) => elem.id !== id)
        })
    }
    addDataManager(id: number, result: SearchResult) {
        const dataManager = new DataManager()
        this.dataManagers.delete(+id)
        this.dataManagers.set(+id, dataManager)
        dataManager.clearData()
        dataManager.loading = true
        dataManager.submitted = true
        dataManager.currentId = 0
        dataManager.updateData(result)
    }
    getDataManager(userId: number) {
        if (!userId) return undefined;

        if (!this.dataManagers.has(+userId)) return undefined
        return this.dataManagers.get(+userId)
    }

    deleteDataManager(id: number) {
        if (!id) return undefined;

        this.dataManagers.delete(+id)
    }
    setDataManager(id: number, dataManager: DataManager) {
        if (!id) return undefined;

        this.dataManagers.delete(+id)
        this.dataManagers.set(+id, dataManager)
    }
    updateData(userId: number, filter: Filter): DataManager {
        filter.loadMainPicture = true
        delete filter.selectedCategories

        let dataManager = this.getDataManager(+userId)
        if (dataManager) {
            dataManager.clearData()
            dataManager.loading = true
            dataManager.submitted = true
            dataManager.currentId = 0
            dataManager.searchResult = undefined
        } else {
            dataManager = new DataManager()
            dataManager.searchResult = undefined
            this.dataManagers.set(+userId, dataManager)
        }
        return dataManager
    }
}
