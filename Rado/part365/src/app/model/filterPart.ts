export class FilterPart {
    carId?: number = 0;
    companyId? : number = 0;
    modelId? : number = 0;
    modificationId?: number = 0
    categoryId? : number = 0;
    subCategoryId? : number = 0;
    partNumber? : string;
    engineType? : number = 0;
    engineModel? : string;
    gearboxType?: number = 0;
    regionId? : number = 0;
    keyword? : string;
    powerkWh? : number = 0;
    categories? : number[] = [];
    partOnly?: boolean = true;
    clientId?: number = 0;
    userId?: number = 0;
    loadMainPicture?: boolean = false;
    orderBy?: number = 0;  
    selectedCategories? : {selected: number, categoryId : number}[] = []
    id?: number = 0;
    extendedSearch?: boolean = false;
};
