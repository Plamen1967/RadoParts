//#region Imports
import { Component, DestroyRef, EventEmitter, inject, Output, Self } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { ControlValueAccessor, FormBuilder, FormGroup, NgControl, ReactiveFormsModule } from '@angular/forms'
import { ClearbuttonComponent } from '@components/custom-controls/buttons/clearbutton/clearbutton.component'
import { SearchbuttonComponent } from '@components/custom-controls/buttons/searchbutton/searchbutton.component'
import { SelectComponent } from '@components/custom-controls/select-controls/select/select.component'
import { HelperComponent } from '@components/helper.old/helper.component'
import { SelectOption } from '@model/selectOption'
import { StaticSelectionService } from '@services/staticSelection.service'
//#endregion
//#region Component
@Component({
    selector: 'app-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.component.css'],
    imports: [ClearbuttonComponent, SearchbuttonComponent, SelectComponent, ReactiveFormsModule],
})
//#endregion
export class SearchBarComponent extends HelperComponent implements ControlValueAccessor {
    //#region variables and services
    sort?: SelectOption[]
    sortForm: FormGroup
    isDisabled?: boolean
    @Output() submitEvent: EventEmitter<void> = new EventEmitter<void>()
    @Output() clearEvent: EventEmitter<void> = new EventEmitter<void>()
    //#region services
    public staticSelectionService: StaticSelectionService = inject(StaticSelectionService)
    private destroyRef: DestroyRef = inject(DestroyRef)
    private fb: FormBuilder = inject(FormBuilder)
    @Self() public control: NgControl = inject(NgControl)
    //#endregion
    //#endregion   
    constructor() {
        super()
        if (this.control) this.control.valueAccessor = this
        this.sortForm = this.fb.group({
            orderBy: [],
        })

        this.sort = this.staticSelectionService.Sort
        this.controls['orderBy'].valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((f) => {
            if (this.onChange) this.onChange(f)
        })
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    protected onTouched?() {}
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    protected onChange?(_: number) {}

    writeValue(id: number): void {
        this.sortForm.patchValue({ orderBy: id })
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

    get controls() {
        return this.sortForm.controls
    }

    submit() {
        this.submitEvent.emit()
    }

    clearFilter() {
        this.clearEvent.emit()
    }
}
