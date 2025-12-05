import { ItemType } from './enum/itemType.enum'

export interface CompanyControlConfig {
    all? : boolean
    multiselection? : boolean
    submitted ? : boolean
    required? : boolean
    userId? : number
    bus? : number
    itemType?: ItemType
}
