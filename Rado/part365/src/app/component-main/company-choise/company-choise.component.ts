//#region imports
import { AfterViewInit, Component, DestroyRef, effect, inject, input, model } from '@angular/core'
import { FormBuilder, ReactiveFormsModule } from '@angular/forms'
import { FormValueControl } from '@angular/forms/signals'
import { TooltipDirective } from '@app/directive/tooltip.directive'
import { companyToOptionItem } from '@app/functions/function-chain'
import { CustomSelectComponent } from '@components/custom-controls/x-custom-select/customSelect.component'
import { CompanyControlConfig } from '@model/companyControlConfig'
import { ItemType } from '@model/enum/itemType.enum'
import { OptionItem } from '@model/optionitem'
import { CompanyService } from '@services/company-model-modification/company.service'
import { ErrorService } from '@services/error.service'
import { switchMap } from 'rxjs'
//#endregion
//#region component
@Component({
    selector: 'app-company-choise',
    templateUrl: './company-choise.component.html',
    styleUrls: ['./company-choise.component.css'],
    imports: [CustomSelectComponent, TooltipDirective, ReactiveFormsModule],
})
//#endregion
export class CompanyChoiseComponent implements FormValueControl<number>, AfterViewInit{
    //#region variables and services
    value = model<number>(0)

    companies = model<OptionItem[]>([])
    companyId = 0
    isDisabled = false
    _bus = 0
    _itemType = ItemType.All
    loaded = false

    companyService: CompanyService = inject(CompanyService)
    formBuilder: FormBuilder = inject(FormBuilder)
    errorService: ErrorService = inject(ErrorService)
    destroyRef: DestroyRef = inject(DestroyRef)

    config = input.required<CompanyControlConfig>()
    oldConfig?: CompanyControlConfig
    itemType_ = ItemType.All
    all_ = false

    //#region services
    //#endregion
    //#endregion
    constructor() {
        effect(() => {
            console.log("Select Company Value", this.value() )
        })

        effect(() => {
            if (!this.oldConfig || this.oldConfig.itemType != this.config().itemType || this.oldConfig.bus != this.config().bus) {
                console.log(`Configure`)
                this.itemType_ = this.oldConfig?.itemType ?? ItemType.All
                this.all_ =  this.oldConfig?.all ?? false
                this.initCompanies()
                this.oldConfig = {...this.config()};
            }
        })
    }
    ngAfterViewInit(): void {
        return
    }

    initCompanies() {
        if (this.config()?.userId) this.populateCompaniesByUserId()
        else this.populateCompanies()
    }

    populateCompanies() {
        if (this.config()?.bus) {
            this.companyService
                .fetchBusCompanies()
                .pipe(switchMap((res) => companyToOptionItem(res)))
                .subscribe((res) => {
                    this.updateCompanies(res)
                })
        } else {
            this.companyService
                .fetchCompanies()
                .pipe(switchMap((res) => companyToOptionItem(res)))
                .subscribe((res) => {
                    this.updateCompanies(res)
                })
        }
    }
    populateCompaniesByUserId() {
        if (this.config()?.bus) {
            this.companyService
                .fetchBusCompaniesByUserId()
                .pipe(switchMap((res) => companyToOptionItem(res)))
                .subscribe((res) => {
                    this.updateCompanies(res)
                })
        } else {
            this.companyService
                .fetchCompaniesByUserId()
                .pipe(switchMap((res) => companyToOptionItem(res)))
                .subscribe((res) => {
                    this.updateCompanies(res)
                })
        }
    }

    updateCompanies(res: OptionItem[]) {
        this.companies.set([...res])
        this.companies.update(() => this.companies().filter((item: OptionItem) => this.config()?.all || item.countCars != 0 || item.countParts != 0 || item.id == 0 || item.id === -1))
        this.companies.update(() => this.companies().map((item: OptionItem) => ({ ...item, count: item.countParts + item.countCars })))
        console.log('this.companies', this.companies())
        this.updateCount()
    }

    updateCount() {
        if (this.itemType_ == ItemType.OnlyBus || this.itemType_ == ItemType.OnlyCar) this.companies().forEach((item) => (item.count = item.countCars))
        else if (this.itemType_ == ItemType.CarPart || this.itemType_ == ItemType.BusPart) this.companies().forEach((item) => (item.count = item.countParts))
        else this.companies().forEach((item) => (item.count = item.countParts + item.countCars))

        let count = 0
        this.companies().forEach((item) => (count += item.count))
        this.loaded = true
    }
}
