import { NgClass, NgStyle } from '@angular/common'
import { AfterViewInit, Component } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { InputComponent } from '@components/custom-controls/input/input.component'
import { SelectComponent } from '@components/custom-controls/select-controls/select/select.component'
import { HelperComponent } from '@components/custom-controls/helper/helper.component'
import { SelectOption } from '@model/selectOption'
import { AdminService } from '@services/admin.service'
import { ModelService } from '@services/company-model-modification/model.service'
import { ModificationService } from '@services/company-model-modification/modification.service'
import { Modification } from '@model/static-data/modification'
import { PopUpServiceService } from '@app/dialog/services/popUpService.service'
import { ConfirmServiceService } from '@app/dialog/services/confirmService.service'
import { OKCancelOption } from '@app/dialog/model/confirmDialogData'

@Component({
    standalone: true,
    selector: 'app-modification',
    templateUrl: './modification.component.html',
    styleUrls: ['./modification.component.css'],
    imports: [ReactiveFormsModule, NgStyle, SelectComponent, InputComponent, NgClass],
})
export default class ModificationComponent extends HelperComponent implements AfterViewInit {
    modificationForm: FormGroup
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

    constructor(
        formBuilder: FormBuilder,
        private adminService: AdminService,
        private modelService: ModelService,
        private modificationService: ModificationService,
        private confirmService: ConfirmServiceService,
        private popupService: PopUpServiceService
    ) {
        super()

        this.modificationForm = formBuilder.group({
            companyId: [''],
            modelId: [''],
            modificationId: [''],
            modificationName: ['', Validators.required],
            powerHP: [''],
            yearFrom: [2000],
            yearTo: [2001],
        })

        const result: SelectOption[] = []
        for (let i = 1950; i <= 2022; i++) {
            result.push({ value: i, text: i.toString() })
        }

        this.years = result
        result.push({ value: 0, text: '-' })
        this.yearsTo = result
    }

    get buttonLabel() {
        if (this.modificationId) return this.labels.UPDATE
        else return this.labels.ADDMODIFICATION
    }

    get controls() {
        return this.modificationForm.controls
    }

    ngAfterViewInit(): void {
        this.controls['companyId'].valueChanges.subscribe((companyId) => this.companyIdChanged(companyId))
        this.controls['modelId'].valueChanges.subscribe((modelId) => this.modelIdChanged(modelId))
        this.controls['modificationId'].valueChanges.subscribe((modificationId) => this.modificationIdChanged(modificationId))
        // this.controls.yearFrom.valueChanges.subscribe(yearFrom => this.modificationForm.patchValue({yearTo: yearFrom}))
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
        let modificationName = ''
        if (modificationId) {
            const modification = this.originalModification.find((item) => item.modificationId === modificationId)
            // this.modificationForm.setValue(modification);
            if (modification) {
                modificationName = modification.modificationName!
                if (modification.powerHP == 0) this.modificationForm.patchValue({ modificationName: modificationName, powerHP: '', yearFrom: modification.yearFrom, yearTo: modification.yearTo })
                else this.modificationForm.patchValue({ modificationName: modificationName, powerHP: modification.powerHP, yearFrom: modification.yearFrom, yearTo: modification.yearTo })
            }
        } else {
            this.modificationForm.patchValue({ modificationName: '', powerHP: '', yearFrom: 2004, yearTo: 0 })
        }
    }

    update() {
        this.modificationForm.value.powerHP = +this.modificationForm.value.powerHP
        this.adminService.updateModification(this.modificationForm.value).subscribe((res) => {
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
                this.modificationForm.patchValue({ modificationId: res.modificationId })
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
                this.modificationForm.patchValue({ modificationName: '', modificationId: 0, powerHP: '', yearFrom: 2004, yearTo: 0 })
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
