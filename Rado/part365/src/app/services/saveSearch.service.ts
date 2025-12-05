import { Injectable } from '@angular/core'
import { Filter } from '@model/filters/filter'
import { StaticSelectionService } from './staticSelection.service'

@Injectable({
    providedIn: 'root',
})
export class SaveSearchService {
    storageName = 'filters'
    constructor(private staticSelectionService: StaticSelectionService) {}
    save(filter: Filter) {
        const keywords = new Map<string, string>()

        if (filter.keywords) {
            for (const key in filter.keywords) {
                const propertyValue: string = filter.keywords[key as keyof typeof filter.keywords] as string
                keywords.set(key, propertyValue)
            }
        }
        filter.arrkeywords = new Map(keywords)
        filter.keywords = new Map(keywords)
        if (filter.engineType) {
            const engineType = this.staticSelectionService.EngineType.find((item) => item.value === filter.engineType)?.text ?? ''
            filter.keywords?.set('Двигател', engineType)
        }
        if (filter.tyreType) {
            const tyreType = this.staticSelectionService.TyreType.find((item) => item.value === filter.tyreType)?.text ?? ''
            filter.keywords?.set('Вид гуми', tyreType)
        }

        if (filter.rimMaterial) {
            const rimType: string = this.staticSelectionService.TyreType.find((item) => item.value === filter.rimMaterial)?.text ?? ''
            filter.keywords?.set('Вид джанта', rimType)
        }
        if (filter.regionId) {
            const region = this.staticSelectionService.Region.find((item) => item.value === filter.regionId)?.text ?? ''
            filter.keywords?.set('Регион', region)
        }

        if (filter.tyreWidth! > 0 || filter.tyreHeight! > 0 || filter.tyreRadius! > 0) {
            let sTyreWidth = 'Всички',
                sTyreHeight = 'Всички',
                sTyreRadius = 'Всички'
            if (filter.tyreWidth! > 0) sTyreWidth = this.staticSelectionService.TyreWidth.find((item) => item.value == filter.tyreWidth)?.text ?? ''
            if (filter.tyreHeight! > 0) sTyreHeight = this.staticSelectionService.TyreHeight.find((item) => item.value == filter.tyreHeight)?.text ?? ''
            if (filter.tyreRadius! > 0) sTyreRadius = this.staticSelectionService.TyreRadius.find((item) => item.value == filter.tyreRadius)?.text ?? ''
            const desc = `${sTyreHeight}\\${sTyreWidth}\\${sTyreRadius}`
            filter.keywords.set('Гума размер', desc)
        }

        this.addSavedItem(filter)
    }

    clear() {
        localStorage.removeItem('filters')
    }

    addSavedItem(filter: Filter) {
        const filters = this.getSavedItems()
        if (filters.length > 9) filters.pop()
        filters.unshift(filter)
        for (const item of filters) {
            item.arrkeywords = Object.fromEntries(item.keywords!)
        }
        localStorage.setItem('filters', JSON.stringify([...filters]))
    }

    removeSavedItem(id: number) {
        const filters = this.getSavedItems()
        filters.splice(
            filters.findIndex((item) => item.id === id),
            1
        )
        localStorage.setItem('items', JSON.stringify(filters))
    }

    getSavedItems(): Filter[] {
        let arr
        const items = localStorage.getItem('filters') ?? ''
        if (items.length == 0) return []
        try {
            arr = JSON.parse(items)
            for (const item of arr) {
                item.keywords = new Map(Object.entries(item.arrkeywords!))
            }
        } catch (error) {
            console.log(error)
            return []
        }
        return arr
    }

    isSaved(id: number) {
        const filters = this.getSavedItems()
        return filters.findIndex((item) => item.id === id) !== -1
    }
}
