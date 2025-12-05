import { CONSTANT } from '@app/constant/globalLabels'

export class Model {
    modelId?: number
    companyId?: number
    modelName?: string
    displayModelName?: string
    groupModelId?: number
    countParts!: number
    countCars!: number
}

export function getModelAll(): Model {
    return { modelId: 0, companyId: 0, groupModelId: 0, modelName: CONSTANT.ALL, displayModelName: CONSTANT.ALL, countParts: 0, countCars: 0 }
}
