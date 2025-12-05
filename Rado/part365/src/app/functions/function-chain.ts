import { Company } from "@model/company-model-modification/company";
import { Model } from "@model/company-model-modification/model";
import { OptionItem } from "@model/optionitem";
import {  Observable, of } from "rxjs";

// companyConver(data: Observable<Company>): Observable<OptionItem> {
//     return of(da)..
// }


export function companyToOptionItem(data: Company[]) : Observable<OptionItem[]> {
    return of(data.map((company: Company) => {
        return {
            id: company.companyId,
            description: company.companyName,
            important: company.important,
            groupModelId: 0,
            count: company.countCars+company.countParts,
            countParts: company.countParts,
            countCars: company.countCars
        }
    }))
}

export function modelToOptionItem(data: Model[]) : Observable<OptionItem[]> {
    return of(data.map((model: Model) => {
        return {
            id: model.modelId,
            description: model.modelName,
            important: false,
            groupModelId: model.groupModelId,
            count: model.countCars+model.countParts,
            countParts: model.countParts,
            countCars: model.countCars
        }
    }))
}