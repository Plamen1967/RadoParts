import { CONSTANT } from "@app/constant/globalLabels";

export class Company {
    important?       : boolean;
    companyId?      : number;
    companyName?    : string
    bus?            : number;
    countParts!     : number;
    countCars!    : number;
}

export function getCompanyAll() : Company {
    return {companyId: 0, companyName : CONSTANT.ALL, bus: 0, countParts: 0, countCars: 0}
}
export function getBusCompanyAll() : Company {
    return {companyId: 0, companyName : CONSTANT.ALL, bus: 1, countParts: 0, countCars: 0}
}
