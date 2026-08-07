//#region imports
import { Component, DestroyRef, inject, OnInit, model, input, effect } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { SelectComponent } from '../select-controls/select/select.component'
import { SelectOption } from '@model/selectOption'
import { ErrorService } from '@services/error.service'
import { StaticSelectionService } from '@services/staticSelection.service'
import { HelperComponent } from '../helper/helper.component'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { FormValueControl } from '@angular/forms/signals'
//#endregion
//#region services
@Component({
    selector: 'app-year',
    templateUrl: './year.component.html',
    styleUrls: ['./year.component.css'],
    imports: [ReactiveFormsModule, SelectComponent],
})
//#endregion
export class YearComponent extends HelperComponent implements FormValueControl<number | undefined>, OnInit {
    value = model<number | undefined>(undefined);
    isDisabled = false
    yearForm: FormGroup
    yearFrom = 1970
    yearTo = 2025
    years?: SelectOption[]
    period = input<{ yearFrom: number; yearTo: number }>()
    

    public staticSelectionService: StaticSelectionService = inject(StaticSelectionService)
    public errorService: ErrorService = inject(ErrorService)
    formBuilder: FormBuilder = inject(FormBuilder)
    private destroyRef: DestroyRef = inject(DestroyRef)

    constructor() {
        super()
    effect(() => {
        if (this.period() === undefined) return
        this.yearFrom = this.period()!.yearFrom
        this.yearTo = this.period()!.yearTo
        this.setYears();
    })



        this.yearForm = this.formBuilder.group({
            year_int: [0],
        })
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
            this.value.set(f)
        })
    }
}
