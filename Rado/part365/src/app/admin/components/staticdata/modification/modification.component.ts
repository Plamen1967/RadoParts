//#region imports
import { NgClass, NgStyle } from '@angular/common'
import { Component, effect, inject, signal } from '@angular/core'
import { FormBuilder, ReactiveFormsModule } from '@angular/forms'
import { InputComponent } from '@components/custom-controls/input/input.component'
import { SelectComponent } from '@components/custom-controls/select-controls/select/select.component'
import { HelperComponent } from '@components/custom-controls/helper/helper.component'
import { SelectOption } from '@model/selectOption'
import { AdminService } from '@app/admin/services/admin.service'
import { ModelService } from '@services/company-model-modification/model.service'
import { ModificationService } from '@services/company-model-modification/modification.service'
import { Modification } from '@model/static-data/modification'
import { PopUpService } from '@app/dialog/services/popUpService.service'
import { ConfirmServiceService } from '@app/dialog/services/confirmService.service'
import { OKCancelOption } from '@app/dialog/model/confirmDialogData'
import { form, FormField } from '@angular/forms/signals'
//#endregion
interface modificationFormInterface {
            companyId: number,
            modelId: number,
            modificationId: number,
            modificationName: string
            powerHP: string,
            yearFrom: number,
            yearTo: number,
}

//#region component
@Component({
    selector: 'app-modification-admin',
    templateUrl: './modification.component.html',
    styleUrls: ['./modification.component.css'],
    imports: [ReactiveFormsModule, NgStyle, SelectComponent, InputComponent, NgClass, FormField],
})
//#endregion
export default class ModificationComponentAdmin extends HelperComponent {
    modificationFormModel = signal<modificationFormInterface> ({
            companyId: 0,
            modelId: 0,
            modificationId: 0,
            modificationName: '',
            powerHP: '',
            yearFrom: 0,
            yearTo: 0,
    })

    modificationForm = form(this.modificationFormModel)
    //#region variables and services
    companies: SelectOption[] = []
    models: SelectOption[] = []
    modifications: SelectOption[] = []
    companyId?: number
    modelId?: number
    modificationId?: number
    modificationName?: string
    kupes: { kupeId: number; kupeName: string }[] = [{ kupeId: 1, kupeName: 'Хачбак' }]
    years: SelectOption[]
    yearsTo: SelectOption[]
    originalModification: Modification[] = []
    formBuilder: FormBuilder = inject(FormBuilder)
    private adminService: AdminService = inject(AdminService)
    private modelService: ModelService = inject(ModelService)
    private modificationService: ModificationService = inject(ModificationService)
    private confirmService: ConfirmServiceService = inject(ConfirmServiceService)
    private popupService: PopUpService = inject(PopUpService)
    //#endregion

    constructor() {
        super()

        const result: SelectOption[] = []
        for (let i = 1950; i <= 2022; i++) {
            result.push({ value: i, text: i.toString() })
        }

        this.years = result
        result.push({ value: 0, text: '-' })
        this.yearsTo = result

        effect(() => {
            this.companyIdChanged(this.modificationForm.companyId().value())
        })

        effect(() => {
            this.modelIdChanged(this.modificationForm.modelId().value())
        })
        effect(() => {
            this.modificationIdChanged(this.modificationForm.modificationId().value())
        })

    }

    get buttonLabel() {
        if (this.modificationId) return this.labels.UPDATE
        else return this.labels.ADDMODIFICATION
    }

    companyIdChanged(companyId: number) {
        this.companyId = companyId
        this.modelService.fetchByCompanyId(companyId).subscribe((res) => {
            this.models = res.map((model) => {
                return { value: model.modelId, text: model.modelName }
            })
            this.controls['modelId'].setValue(this.modelId)
            this.modelIdChanged(this.modelId!)
        })
    }

    modelIdChanged(modelId: number) {
        this.modelId = modelId
        this.modificationService.fetch(this.modelId!).subscribe((res) => {
            this.originalModification = [...res]
            res.unshift({
                modelId: 0,
                modificationId: 0,
                modificationDisplayName: this.labels.ADDMODIFICATION,
                modificationName: this.labels.ADDMODIFICATION,
                yearFrom: 0,
                yearTo: 0,
                powerHP: 0,
                countCars: 0,
                countParts: 0,
            })
            this.modifications = res.map((modification) => {
                return { value: modification.modificationId, text: modification.modificationName, displayText: modification.modificationDisplayName }
            })
            this.modificationId = 0
            this.controls['modificationId'].setValue(this.modificationId)
        })
    }

    modificationIdChanged(modificationId: number) {
        this.modificationId = modificationId
        if (modificationId) {
            const modification = this.originalModification.find((item) => item.modificationId === modificationId)
            // this.modificationForm.setValue(modification);
            if (modification) {
                if (modification.powerHP == 0) 
                    this.modificationFormModel.update((value) => ({ ...value, modificationName: modification.modificationName!, powerHP: '', yearFrom: modification.yearFrom ?? 0, yearTo: modification.yearTo ?? 0 }))
                else 
                    this.modificationFormModel.update((value) => ({ ...value, modificationName: modification.modificationName!, powerHP:  modification.powerHP?.toString() ?? '', yearFrom: modification.yearFrom?? 0, yearTo: modification.yearTo?? 0 }))
            }
        } else {
            this.modificationFormModel.update((value) => ({ ...value,  modificationName: '', powerHP: '', yearFrom: 2004, yearTo: 0 }))
        }
    }

    update() {
        this.adminService.updateModification({
            ...this.modificationFormModel(),
            powerHP: Number(this.modificationFormModel().powerHP) || 0,
            countParts: 0,
            countCars: 0
        }).subscribe((res) => {
            const modification_ = this.modifications
            const modification = modification_.find((item) => item.value === res.modificationId)
            if (modification) {
                modification.text = res.modificationName
                modification.displayText = res.modificationDisplayName
            } else {
                modification_.push({
                    value: res.modificationId,
                    text: res.modificationName,
                    displayText: res.modificationDisplayName,
                })
                this.modificationFormModel.update((value) => ({...value, modificationId: res.modificationId ?? 0 }))
            }
            modification_.sort((a, b) => (a.text! < b.text! ? -1 : 1))
            this.modifications = modification_
        })
    }

    //#region delete Modification
    delete() {
        this.confirmService.OKCancel(this.labels.WARNING, 'Искате ли да изтриете модификацията?').subscribe((result) => {
            if (result === OKCancelOption.OK) {
                this.onDeleteOk()
            }
        })
    }

    onDeleteOk() {
        this.adminService.deleteModification(this.modificationId!).subscribe(() => {
            this.popupService.openWithTimeout(this.labels.MESSAGE, 'модификацията е успешно изтрита.', 2000).subscribe(() => {
                const index = this.modifications.findIndex((item) => item.value == this.modificationId)
                if (index != -1) this.models.splice(index, 1)
                this.modificationFormModel.update((value) => ({...value,  modificationName: '', modificationId: 0, powerHP: '', yearFrom: 2004, yearTo: 0 }))
            })
        })
    }

    //#endregion
    get updateButton() {
        const modificationName = this.controls['modificationName'].value
        const value = this.companyId && this.modelId && this.modificationId && modificationName.length
        return value === undefined
    }
}
