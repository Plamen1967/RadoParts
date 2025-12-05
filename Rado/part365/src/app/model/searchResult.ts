import { DisplayPartView } from './displayPartView'
import { Filter } from './filters/filter'
import { FilterRimWithTyre } from './FilterRimWithTyre'
import { UserView } from './userView'
import { UserCount } from './userCount'

export class SearchResult {
    data?: DisplayPartView[]
    duration?: number
    currentItem?: number
    clientId?: number

    size?: number
    filter?: Filter
    filterRimWithTyre?: FilterRimWithTyre
    userCount?: UserCount
    userView?: UserView
}
