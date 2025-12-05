import { NgStyle, NgClass } from '@angular/common'
import { AfterViewInit, Component } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { InputComponent } from '@components/custom-controls/input/input.component'
import { SelectComponent } from '@components/custom-controls/select-controls/select/select.component'
import { HelperComponent } from '@components/custom-controls/helper/helper.component'
import { Model } from '@model/company-model-modification/model'
import { AdminService } from '@services/admin.service'
import { CompanyService } from '@services/company-model-modification/company.service'
import { ModelService } from '@services/company-model-modification/model.service'
import { SelectOption } from '@model/selectOption'
import { ConfirmServiceService } from '@app/dialog/services/confirmService.service'
import { PopUpServiceService } from '@app/dialog/services/popUpService.service'

@Component({
    standalone: true,
    selector: 'app-model',
    templateUrl: './model.component.html',
    styleUrls: ['./model.component.css'],
    imports: [ReactiveFormsModule, NgStyle, SelectComponent, InputComponent, NgClass],
})
export default class ModelComponent extends HelperComponent implements AfterViewInit {
    modelForm: FormGroup
    companies: SelectOption[] = []
    modelsAll: SelectOption[] = []
    models: SelectOption[] = []
    groupModels: SelectOption[] = []
    companyId?: number
    modelId?: number
    groupModelId?: number

    constructor(
        formBuilder: FormBuilder,
        private adminService: AdminService,
        private companyService: CompanyService,
        private confirmService: ConfirmServiceService,
        private popupService: PopUpServiceService,
        private modelService: ModelService
    ) {
        super()

        this.modelForm = formBuilder.group({
            companyId: [0],
            groupModelId: [0],
            modelId: [0],
            modelName: ['', Validators.required],
        })

        this.companyService.fetchCompanies().subscribe((res) => {
            this.companies = res.map((company) => {
                return {
                    value: company.companyId,
                    text: company.companyName,
                }
            })
        })
    }

    get controls() {
        return this.modelForm.controls
    }
    ngAfterViewInit(): void {
        this.controls['companyId'].valueChanges.subscribe((f) => this.companyIdChanged(f))
        this.controls['groupModelId'].valueChanges.subscribe((f) => this.groupModelIdChanged(f))
        this.controls['modelId'].valueChanges.subscribe((f) => this.modelIdChanged(f))
    }

    companyIdChanged(companyId: number) {
        this.companyId = companyId
        this.modelService.fetchByCompanyId(companyId).subscribe((res) => {
            res.sort((a, b) => (a.modelName! < b.modelName! ? -1 : 1))
            res.unshift({ companyId: 0, modelId: 0, groupModelId: -1, modelName: this.labels.ADDMODEL, displayModelName: this.labels.ADDMODEL, countCars: 0, countParts: 0 })
            this.models = res.map((model) => {
                return {
                    text: model.displayModelName,
                    value: model.modelId,
                    displayText: model.modelName,
                }
            })
            this.groupModels = res
                .filter((elem) => elem.modelId === elem.groupModelId)
                .map((groupModel) => {
                    return {
                        text: groupModel.displayModelName,
                        value: groupModel.groupModelId,
                    }
                })
            this.modelsAll = [...this.models]
        })
    }

    groupModelIdChanged(groupModelId: number) {
        this.groupModelId = groupModelId
        this.models = this.modelsAll.filter((elem) => elem.value !== elem.value && elem.value === groupModelId)
        this.models.unshift({ value: 0, text: this.labels.ADDMODEL, displayText: this.labels.ADDMODEL })
    }

    modelIdChanged(modelId: number) {
        this.modelId = modelId
        let modelName = ''
        if (modelId) {
            const model = this.models.find((item) => item.value === modelId)
            modelName = model?.text ?? ''
        }

        this.modelForm.patchValue({ modelName: modelName })
    }

    update() {
        this.adminService.updateModel(this.modelForm.value).subscribe((model) => {
            this.updateModels(model)
        })
    }

    //#region delete Model

    delete() {
        this.confirmService.OKCancel(this.labels.WARNING, 'Искате ли да изтриете модела?')
    }
    onDeleteOk() {
        this.adminService.deleteModel(this.modelId!).subscribe((res) => {
            if (res) {
                this.popupService.openWithTimeout(this.labels.MESSAGE, 'Модела е успешно изтрит.', 2000).subscribe(() => {
                    const index = this.models.findIndex((item) => item.value == this.modelId)
                    if (index != -1) this.models.splice(index, 1)
                    this.modelForm.patchValue({ modelName: '', modelId: 0 })
                })
            }
        })
    }

    //#endregion

    get deleteButton() {
        return !this.modelId
    }

    updateModels(model: Model) {
        const models_: SelectOption[] = this.models
        const model_ = models_.find((item) => item.value === model.modelId)
        if (model_) {
            model_.displayText = model.modelName
            model_.text = model.modelName
        } else
            models_.push({
                value: model.modelId,
                displayText: model.modelName,
                text: model.modelName,
            })
        models_.sort((a, b) => (a.text! < b.text! ? -1 : 1))

        this.models = models_
    }

    get buttonLabel() {
        if (this.modelId) return this.labels.UPDATE
        else return this.labels.ADDMODEL
    }
    get updateButton() {
        const modelName = this.controls['modelName'].value
        const value = this.companyId && this.groupModelId && modelName?.length
        return value === undefined
    }
}
