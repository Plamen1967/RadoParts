import { AfterViewInit, Component, DestroyRef, EventEmitter, Input, OnInit, Output, Self } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { ControlValueAccessor, FormBuilder, FormGroup, NgControl, ReactiveFormsModule } from '@angular/forms'
import { TooltipDirective } from '@app/directive/tooltip.directive'
import { companyToOptionItem } from '@app/functions/function-chain'
import { CustomSelectComponent } from '@components/custom-controls/x-custom-select/customSelect.component'
import { CompanyControlConfig } from '@model/companyControlConfig'
import { ItemType } from '@model/enum/itemType.enum'
import { OptionItem } from '@model/optionitem'
import { CompanyService } from '@services/company-model-modification/company.service'
import { ErrorService } from '@services/error.service'
import { switchMap } from 'rxjs'

@Component({
    standalone: true,
    selector: 'app-company-choise',
    templateUrl: './company-choise.component.html',
    styleUrls: ['./company-choise.component.css'],
    imports: [CustomSelectComponent, TooltipDirective, ReactiveFormsModule],
})
export class CompanyChoiseComponent implements ControlValueAccessor, AfterViewInit, OnInit {
    companies: OptionItem[] = []
    companyId = 0
    isDisabled = false
    companyForm: FormGroup
    _bus = 0
    _itemType = ItemType.All
    loaded = false;
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    protected onTouched?() {}
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    protected onChange?(_: number) {}

    @Input() set bus(value: number) {
        this._bus = value
        this.initCompanies()
    }
    get bus() {
        return this._bus
    }
    @Input() set config(value: CompanyControlConfig) {
        this.userId = value.userId ?? 0
        this._bus = value.bus ?? 0
        this._itemType = value.itemType ?? ItemType.All
        this.initCompanies()
    }

    @Input() showCount = false;
    @Input() userId = 0
    @Input() all = false
    @Input() submitted = false
    @Input() required = false
    @Input() set itemType(value: ItemType) {
        this._itemType = value
        this.initCompanies()
    }

    get itemType() {
        return this._itemType
    }

    @Output() countPerUser: EventEmitter<number> = new EventEmitter<number>()

    constructor(
        public companyService: CompanyService,
        formBuilder: FormBuilder,
        @Self() public control: NgControl,
        public errorService: ErrorService,
        private destroyRef: DestroyRef
    ) {
        if (this.control) this.control.valueAccessor = this
        this.companyForm = formBuilder.group({
            companyId_int: [0],
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
        if (this.userId) this.populateCompaniesByUserId()
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
        if (this.bus) {
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
        if (this.bus) {
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
        if (this.itemType == ItemType.OnlyBus || this.itemType == ItemType.OnlyCar) this.companies.forEach((item) => (item.count = item.countCars))
        else if (this.itemType == ItemType.CarPart || this.itemType == ItemType.BusPart) this.companies.forEach((item) => (item.count = item.countParts))
        else this.companies.forEach((item) => (item.count = item.countParts + item.countCars))

        let count = 0
        this.companies.forEach((item) => (count += item.count))
        this.countPerUser.emit(count)
        this.loaded = true;
    }
}
