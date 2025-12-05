import { ApprovedType } from '../enum/approveType.enum'

export class Part {
    partId?                 : number
    carId?                  : number
    bus?                    : number
    modelId?                : number
    modificationId?         : number
    categoryId?             : number
    subCategoryId?          : number
    dealerSubCategoryId?    : number
    dealerSubCategoryName?  : string
    description?            : string
    price?                  : number
    powerkWh?               : number
    powerBHP?               : number
    leftRightPosition?      : number
    frontBackPosition?      : number
    count?                  : number
    partNumber?             : string
    engineType?             : number
    engineModel?            : string
    year?                   : number
    millage?                 : number
    gearboxType?            : number
    regionId?               : number
    isCar?                  : boolean
    modifiedTime?           : number
    mainPicture?            : string
    mainImageId?            : number
    approved?               : ApprovedType
}
