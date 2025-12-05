import { CONSTANT } from "@app/constant/globalLabels"

export class Modification {
    modificationId?:            number;
    modelId?:                   number;
    modificationName?:          string;
    modificationDisplayName?:   string;
    yearFrom?:                  number;
    yearTo?:                    number;
    powerHP?:                   number;
    countParts!:                number;
    countCars!:                number;

    public static getAll() : Modification {
        return {modelId:0, modificationId:0, modificationDisplayName: CONSTANT.ALL, modificationName: CONSTANT.ALL, yearFrom: 0, yearTo: 0, powerHP: 0, countParts: 0, countCars: 0}
    }
}
