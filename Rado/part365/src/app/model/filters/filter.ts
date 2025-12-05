import { ApprovedType } from "../enum/approveType.enum";
import { ItemType } from "../enum/itemType.enum";
import { SearchBy } from "../enum/searchBy.enum";

export class Filter {
    id = 0;
    itemId?: number
    itemType?:          ItemType;
    carId?:             number = 0;
    companyId? :        number = 0;
    modelId? :          number = 0;
    modelsId? :         string = '';
    modificationId?:    number = 0
    modificationsId?:   string = ''
    categoryId? :       number = 0;
    subCategoryId? :    number = 0;
    engineType? :       number = 0;
    categoriesId?:      string = '';
    subCategoriesId?:      string = '';
    engineModel? :      string = "";
    partNumber? :       string;
    powerkWh? :         number = 0;
    powerBHP? :         number = 0;
    gearboxType?:       number = 0;
    categories? :       number[] = [];
    partOnly?:          boolean = false;
    searchBy?:          SearchBy = SearchBy.Filter; 
    regNumber?:         string = "";
    extendedSearch?:    boolean = false;
    searchType?:        number;
    year?:              number;
    keywords?:          Map<string, string>
    arrkeywords?:          object;

    selectedCategories? : {selected: number, categoryId : number}[] = []

    tyreCompanyId?:     number;
    tyreWidth?:         number;
    tyreHeight?:        number;
    tyreRadius?:        number;
    tyreType?:          number;

    rimCompanyId?:      number;
    rimModelId?:        number;
    rimWidth?:          number;
    rimMaterial?:       number;
    rimOffset?:         number;
    rimBoltCount?:      number;
    rimBoltDistance?:   number;
    rimCenter?:         number;

    clientId?:          number = 0;
    userId?:            number = 0;
    loadMainPicture?:   boolean = false;
    orderBy?:           number = 0;  
    regionId? :         number = 0;
    hasImages?:         boolean = false;
    keyword? :          string;
    description?:       string;
    adminRun?:          boolean = false;
    approved?:          ApprovedType = ApprovedType.All;
    loaded?:            number;
    bus?:               number = -1;
};
