import { ItemType } from "./enum/itemType.enum";

export class FilterRimWithTyre {
        itemType?:      ItemType;
        tyreCompanyId?: number;
        tyreWidth?:     number;
        tyreHeight?:    number;
        tyreRadius?:    number;
        tyreType?:      number;
        companyId?:     number;
        modelId?:       number;
        rimWidth?:      number;
        rimMaterial?:   number;
        rimOffset?:     number;
        rimBoltCount?:  number;
        rimBoltDistance?: number;
        rimCenter?:     number;
        clientId?:      number;
        loadMainPicture?: boolean;
        hasImages?:     boolean;
        userId?:        number;
        orderBy?:       number;
        adminRun?:      boolean;
}

