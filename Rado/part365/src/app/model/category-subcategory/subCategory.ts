import { CONSTANT } from "@app/constant/globalLabels";

export class SubCategory {
    subCategoryId? : number;
    categoryId? : number;
    subCategoryName? : string;
    count?: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getAll() : SubCategory {
    return {subCategoryId:0, categoryId: 0, count: 0, subCategoryName: CONSTANT.ALL};
}
