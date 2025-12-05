import { SubCategory } from "./subCategory";

export class NumberPartsPerCategory {
    categoryId!     : number;
    numberParts!    : number;
    subCategories   : SubCategory[] = [];
}
