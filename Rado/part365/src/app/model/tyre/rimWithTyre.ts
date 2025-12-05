import { ItemType } from "@model/enum/itemType.enum";

export class RimWithTyre {
    itemType?       : ItemType;
    rimWithTyreId?  : number
    tyreCompanyId?  : number;
    tyreWidth?      : number;
    tyreHeight?     : number;
    tyreRadius?     : number;
    tyreType?       : number;
    companyId?      : number
    modelId?        : number
    rimWidth?       : number
    rimMaterial?    : number
    rimOffset?      : number
    rimBoltCount?   : number
    rimBoltDistance?: number
    rimCenter?      : number
    description?    : string;
    mainPicture?    : string;
    mainImageId?    : number;
    price?          : number;
    userId?         : number;
    images?         : ImageData[];
    modifiedTime?   : number;
    count?          : number;
    monthDOT?       : number;
    yearDOT?        : number;
}
