import { ItemType } from "@model/enum/itemType.enum"

export class FilterCar {
    companyId?: number
    modelId?: number
    modificationId?: number
    engineType?: number
    powerkWh?: string
    powerBHP?: string
    carId?: number
    description?: string
    regNumber?: string
    year?: number
    itemType?: ItemType
    bus?: number
}
