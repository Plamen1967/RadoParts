import { AfterViewInit, Component, DestroyRef, Input, OnInit, Self } from '@angular/core'
import { ControlValueAccessor, FormBuilder, FormGroup, NgControl, ReactiveFormsModule } from '@angular/forms'
import { SelectComponent } from '../select-controls/select/select.component'
import { SelectOption } from '@model/selectOption'
import { ErrorService } from '@services/error.service'
import { StaticSelectionService } from '@services/staticSelection.service'
import { HelperComponent } from '../helper/helper.component'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'

@Component({
    standalone: true,
    selector: 'app-year',
    templateUrl: './year.component.html',
    styleUrls: ['./year.component.css'],
    imports: [ReactiveFormsModule, SelectComponent],
})
export class YearComponent extends HelperComponent implements ControlValueAccessor, AfterViewInit, OnInit {
    isDisabled = false
    yearForm: FormGroup
    yearFrom = 1970
    yearTo = 2025
    years?: SelectOption[]
    @Input() set period(value: { yearFrom: number; yearTo: number }) {
        this.yearFrom = value.yearFrom
        this.yearTo = value.yearTo
        this.setYears()
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    protected onTouched?() {}
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    protected onChange?(_: number) {}
    constructor(
        @Self() public control: NgControl,
        public staticSelectionService: StaticSelectionService,
        public errorService: ErrorService,
        formBuilder: FormBuilder,
        private destroyRef: DestroyRef
    ) {
        super()
        if (this.control) this.control.valueAccessor = this
        this.yearForm = formBuilder.group({
            year_int: [0],
        })
    }
    writeValue(id: number): void {
        this.yearForm.patchValue({ year_int: id })
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

    ngAfterViewInit(): void {
        return
    }

    setYears() {
        const result: SelectOption[] = [{ value: 0, text: this.labels.ALL }]
        for (let i = this.yearFrom; i <= this.yearTo; i++) {
            result.push({ value: i, text: i.toString() })
        }
        this.years = result
    }

    ngOnInit() {
        this.setYears()
        this.yearForm.controls['year_int'].valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((f) => {
            if (f) f = +f
            if (this.onChange) this.onChange(f)
        })
    }
}
