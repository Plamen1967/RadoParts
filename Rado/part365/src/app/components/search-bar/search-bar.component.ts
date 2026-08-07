//#region Imports
import { Component, DestroyRef, inject, Self, model, output } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { FormBuilder, FormGroup, NgControl, ReactiveFormsModule } from '@angular/forms'
import { FormValueControl } from '@angular/forms/signals'
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
export class SearchBarComponent extends HelperComponent implements FormValueControl<number|undefined> {
    //#region variables and services
    value = model<number | undefined>(undefined)
    sort?: SelectOption[]
    sortForm: FormGroup
    isDisabled?: boolean
    submitEvent = output<void>()
    clearEvent = output<void>()
    //#region services
    public staticSelectionService: StaticSelectionService = inject(StaticSelectionService)
    private destroyRef: DestroyRef = inject(DestroyRef)
    private fb: FormBuilder = inject(FormBuilder)
    @Self() public control: NgControl = inject(NgControl)
    //#endregion
    //#endregion
    constructor() {
        super()
        this.sortForm = this.fb.group({
            orderBy: [],
        })

        this.sort = this.staticSelectionService.Sort
        this.controls['orderBy'].valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((f) => {
            this.value.set(f)
        })
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
