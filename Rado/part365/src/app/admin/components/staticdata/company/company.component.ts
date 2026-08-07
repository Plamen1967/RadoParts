//#region imports
import { NgStyle } from '@angular/common'
import { AfterViewInit, Component, inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { InputComponent } from '@components/custom-controls/input/input.component'
import { SelectComponent } from '@components/custom-controls/select-controls/select/select.component'
import { HelperComponent } from '@components/custom-controls/helper/helper.component'
import { Company } from '@model/company-model-modification/company'
import { QueryParam } from '@model/queryParam'
import { AdminService } from '@app/admin/services/admin.service'
import { CompanyService } from '@services/company-model-modification/company.service'
import { SelectOption } from '@model/selectOption'
//#endregion
//#region component
@Component({
    selector: 'app-company-admin',
    templateUrl: './company.component.html',
    styleUrls: ['./company.component.css'],
    imports: [ReactiveFormsModule, NgStyle, InputComponent, SelectComponent],
})
//#endregion
export default class CompanyComponentAdmin extends HelperComponent implements OnInit, AfterViewInit {
    //#region variables and services
    companyForm: FormGroup
    companies?: SelectOption[] = []
    originalCompanies: Company[] = []
    params?: QueryParam
    formBuilder: FormBuilder = inject(FormBuilder)
    private companyService: CompanyService = inject(CompanyService)
    private adminService: AdminService = inject(AdminService)
    private route: ActivatedRoute = inject(ActivatedRoute)
    //#endregion

    constructor() {
        super()
        this.companyForm = this.formBuilder.group({
            companyId: [0, [Validators.required]],
            companyName: ['', [Validators.required]],
        })
    }
    ngAfterViewInit(): void {
        this.companyForm.controls['companyId'].valueChanges.subscribe((f) => this.select(f))
    }

    ngOnInit() {
        this.route.queryParams.subscribe((params) => {
            this.params = params
            if (params['bus']) {
                this.companyService.fetchBusCompanies().subscribe((res) => {
                    this.companies = res.map((company) => {
                        return { text: company.companyName, value: company.companyId }
                    })
                    this.companies.unshift({ value: 0, text: this.labels.ADDCOMPANY })
                })
            } else {
                this.companyService.fetchCompanies().subscribe((res) => {
                    this.companies = res.map((company) => {
                        return { text: company.companyName, value: company.companyId }
                    })
                    this.companies.unshift({ value: 0, text: this.labels.ADDCOMPANY })
                })
            }
        })
    }

    update() {
        const company: Company = {
            companyId: this.companyForm.controls['companyId'].value,
            companyName: this.companyForm.controls['companyName'].value,
            bus: 0,
            countCars: 0,
            countParts: 0,
        }

        if (this.params?.bus) company.bus = 1

        this.adminService.updateCompany(company).subscribe((res) => this.updateCompanyList(res))
    }

    select(companyId: number) {
        let companyName = ''

        if (companyId !== 0) {
            const company_ = this.companies?.find((elem) => elem.value === companyId)
            companyName = company_?.text ?? ''
        }
        this.companyForm.patchValue({ companyName: companyName })
    }

    updateCompanyList(company: Company) {
        const company_ = this.companies?.find((elem) => elem.value === company.companyId)
        if (company_) company_.text = company.companyName
        else
            this.companies?.push({
                value: company.companyId,
                text: company.companyName,
            })
        this.companyForm.setValue({ companyName: '', companyId: 0 })
    }

    get label() {
        if (this.companyForm.controls['companyId'].value === 0) return this.labels.ADD
        else return this.labels.UPDATE
    }
}
