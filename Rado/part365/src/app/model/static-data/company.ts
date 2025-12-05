import { CONSTANT } from "@app/constant/globalLabels"

export class Company {
    companyId?:         number;
    companyName?:       string;
    bus?:               number;
    countParts?:        number;
    countCarBus?:       number;

    public static getAll() : Company {
        return {companyId: 0, companyName : CONSTANT.ALL, bus: 0, countParts: 0}
    }
}