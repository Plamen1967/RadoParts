import { ApprovedType } from "@model/enum/approveType.enum";

export class Car {
    carId?           : number;
    bus?             : number;
    modelId?         : number; 
    modificationId?  : number;
    year?            : number;
    vin?             : string;
    regNumber?       : string;
    description?     : string;
    price?           : number;
    powerkWh?        : number;
    powerBHP?        : number;
    engineType?      : number;
    engineModel?     : string;
    millage?          : number;
    gearboxType?     : number;
    modifiedTime?    : number;
    sellerPhone?     : string;
    sellerPhone2?    : string;
    sellerViber?     : string;
    sellerWebPage?   : string;
    regionId?        : number;
    userId?          : number;
    mainImageId?     : number;
    mainPicture?     : string;
    approved?        : ApprovedType;
}
