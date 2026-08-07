//#region imports
import { AfterViewInit, Component, DestroyRef, OnInit, Self, computed, effect, inject, input, model, output } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { FormBuilder, FormGroup, NgControl, ReactiveFormsModule } from '@angular/forms'
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
export class CompanyChoiseComponent implements FormValueControl<number | undefined>, AfterViewInit, OnInit {
    //#region variables and services
    value = model<number | undefined>(undefined)
    companies: OptionItem[] = []
    companyId = 0
    isDisabled = false
    companyForm: FormGroup
    _bus = 0
    _itemType = ItemType.All
    loaded = false
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    protected onTouched?() {}
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    protected onChange?(_: number) {}

    bus = input<number>(0)

    config = input<CompanyControlConfig>()

    showCount = input<boolean>(false)
    userId = input<number | undefined>(undefined)
    all = input<boolean>(false)
    submitted = input<boolean>(false)
    IsRequired = input<boolean>(false)
    itemType = input<ItemType>(ItemType.All)

    itemType_ = ItemType.All
    userId_?: number
    bus_ = 0
    all_ = false

    countPerUser = output<number>()
    //#region services
    public companyService: CompanyService
    formBuilder: FormBuilder
    @Self() public control: NgControl
    public errorService: ErrorService
    private destroyRef: DestroyRef
    //#endregion
    //#endregion
    constructor() {
        //#region inject services
        this.companyService = inject(CompanyService)
        this.formBuilder = inject(FormBuilder)
        this.control = inject(NgControl)
        this.errorService = inject(ErrorService)
        this.destroyRef = inject(DestroyRef)
        //#endregion
        if (this.control) this.control.valueAccessor = this
        this.companyForm = this.formBuilder.group({
            companyId_int: [0],
        })

        effect(() => {
            if (this.bus()) this.initCompanies()
            if (this.config()) {
                if (this.config()!.userId) this.userId_ = this.config()!.userId
                if (this.config()!.bus) this.bus_ = this.config()!.bus!
                if (this.config()!.itemType) this.itemType_ = this.config()!.itemType!
                if (this.config()!.all) this.all_ = this.config()!.all!
            }

            if (this.itemType()) this.initCompanies()

            this.itemType_ = computed(() => this.itemType())()
            this.bus_ = computed(() => this.bus())()
            this.all_ = computed(() => this.all())()
        })
    }
    ngOnInit(): void {
        this.initCompanies()
    }

    ngAfterViewInit(): void {
        this.companyForm.controls['companyId_int'].valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((f) => {
            if (f) f = +f
            if (this.onChange) this.onChange(f)
        })

        return
    }

    initCompanies() {
        if (this.userId()) this.populateCompaniesByUserId()
        else this.populateCompanies()
    }

    writeValue(id: number): void {
        this.companyForm.patchValue({ companyId_int: id })
    }
    registerOnChange(fn: (_: unknown) => unknown): void {
        this.onChange = fn
    }
    registerOnTouched(fn: () => unknown): void {
        this.onTouched = fn
    }

    setDisabledState?(isDisabled: boolean): void {
        this.isDisabled = isDisabled
    }

    populateCompanies() {
        if (this.bus()) {
            this.companyService
                .fetchBusCompanies()
                .pipe(switchMap((res) => companyToOptionItem(res)))
                .subscribe((res) => {
                    this.companies = [...res]
                    this.companies = this.companies.filter((item) => this.all || item.countCars != 0 || item.countParts != 0 || item.id == 0 || item.id === -1)
                    this.companies.forEach((item) => (item.count = item.countParts + item.countCars))
                    this.updateCount()
                })
        } else {
            this.companyService
                .fetchCompanies()
                .pipe(switchMap((res) => companyToOptionItem(res)))
                .subscribe((res) => {
                    this.companies = [...res]
                    this.companies = this.companies.filter((item) => this.all || item.countCars != 0 || item.countParts != 0 || item.id == 0 || item.id === -1)
                    this.companies.forEach((item) => (item.count = item.countParts + item.countCars))
                    this.updateCount()
                })
        }
    }
    populateCompaniesByUserId() {
        if (this.bus_) {
            this.companyService
                .fetchBusCompaniesByUserId()
                .pipe(switchMap((res) => companyToOptionItem(res)))
                .subscribe((res) => {
                    this.companies = [...res]
                    this.companies = this.companies.filter((item) => this.all || item.countCars != 0 || item.countParts != 0 || item.id == 0 || item.id === -1)
                    this.updateCount()
                })
        } else {
            this.companyService
                .fetchCompaniesByUserId()
                .pipe(switchMap((res) => companyToOptionItem(res)))
                .subscribe((res) => {
                    this.companies = [...res]
                    this.companies = this.companies.filter((item) => this.all || item.countCars != 0 || item.countParts != 0 || item.id == 0 || item.id === -1)
                    this.updateCount()
                })
        }
    }

    updateCount() {
        if (this.itemType_ == ItemType.OnlyBus || this.itemType_ == ItemType.OnlyCar) this.companies.forEach((item) => (item.count = item.countCars))
        else if (this.itemType_ == ItemType.CarPart || this.itemType_ == ItemType.BusPart) this.companies.forEach((item) => (item.count = item.countParts))
        else this.companies.forEach((item) => (item.count = item.countParts + item.countCars))

        let count = 0
        this.companies.forEach((item) => (count += item.count))
        this.countPerUser.emit(count)
        this.loaded = true
    }
}
