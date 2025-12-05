import { ItemType } from "./enum/itemType.enum";

export class QueryParam {
    query?: number;
    id?: number;
    viewId?: number;
    ad?: boolean;
    update?: boolean;
    itemType?: ItemType;
    userId? : number;
    page?: number;
    viewPartId?: number;
    currentId?: number;
    bus?: number;
    activationcode?: string;
    updateId?: number;
}
