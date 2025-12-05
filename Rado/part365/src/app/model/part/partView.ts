import { Part } from "./part";

export class PartView extends Part{
    companyName?     : string;
    companyId?       : number;
    modelName?       : string;
    modificationName?: string;
    regNumber?       : string;
    vin?             : string;
    engineTypeDesc?  : string;
    categoryName?    : string;
    createdTime?     : number;
    sellerName?      : string;
    sellerPhone?     : string;
    sellerPhone2?    : string
    sellerViber?     : string
    sellerWebPage?   : string;
    numberImages?    : number;
    yearName?        : string;
}
