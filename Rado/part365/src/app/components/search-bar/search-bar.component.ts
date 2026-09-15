//#region Imports
import { Component, DestroyRef, inject, Self, model, output, signal, effect } from '@angular/core'
import { FormBuilder, NgControl, ReactiveFormsModule } from '@angular/forms'
import { form, FormField, FormValueControl } from '@angular/forms/signals'
import { ClearbuttonComponent } from '@components/custom-controls/buttons/clearbutton/clearbutton.component'
import { SearchbuttonComponent } from '@components/custom-controls/buttons/searchbutton/searchbutton.component'
import { SelectComponent } from '@components/custom-controls/select-controls/select/select.component'
import { HelperComponent } from '@components/helper.old/helper.component'
import { SelectOption } from '@model/selectOption'
import { StaticSelectionService } from '@services/staticSelection.service'
//#endregion
//#region interface 
interface searchInteface {
    orderBy: number
}
//#endregion
//#region Component
@Component({
    selector: 'app-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.component.css'],
    imports: [ClearbuttonComponent, SearchbuttonComponent, SelectComponent, ReactiveFormsModule, FormField],
})
//#endregion
export class SearchBarComponent extends HelperComponent implements FormValueControl<number|undefined> {
    searchModel = signal<searchInteface>({
        orderBy: 0
    })

    sortForm = form(this.searchModel)
    //#region variables and services
    value = model<number | undefined>(undefined)
    sort?: SelectOption[]
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

        effect(() => {
            this.value.set(this.searchModel().orderBy)
        })
        this.sort = this.staticSelectionService.Sort
    }

    submit() {
        this.submitEvent.emit()
    }

    clearFilter() {
        this.clearEvent.emit()
    }
}
