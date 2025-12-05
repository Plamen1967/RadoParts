import * as Labels from '@global/globalLabels'

export class Model {
    modelId : number;
    companyId : number;
    modelName : string;
    displayModelName : string;
    groupModelId: number;
    countParts?: number = 0;

    static getAll() : Model  {
        return { modelId : 0, companyId: 0, groupModelId: 0, modelName: Labels.ALL, displayModelName: Labels.ALL, countParts: 0};
    }
}