import { Component, DestroyRef, inject, OnInit, model } from '@angular/core'
import { SelectComponent } from '../select-controls/select/select.component'
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { ErrorService } from '@services/error.service'
import { SelectOption } from '@model/selectOption'
import { StaticSelectionService } from '@services/staticSelection.service'
import { HelperComponent } from '../helper/helper.component'
import { TooltipDirective } from '@app/directive/tooltip.directive'
import { FormValueControl } from '@angular/forms/signals'

@Component({
    selector: 'app-region',
    templateUrl: './region.component.html',
    styleUrls: ['./region.component.css'],
    imports: [SelectComponent, TooltipDirective, ReactiveFormsModule],
})
export class RegionComponent extends HelperComponent implements FormValueControl<number|undefined>, OnInit {
    isDisabled = false
    regionForm: FormGroup
    regions?: SelectOption[]
    value = model<number|undefined>(undefined)

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    protected onTouched?() {}
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    protected onChange?(_: number) {}
    public staticSelectionService: StaticSelectionService = inject(StaticSelectionService)
    public errorService: ErrorService = inject(ErrorService)
    formBuilder: FormBuilder = inject(FormBuilder)
    private destroyRef: DestroyRef = inject(DestroyRef)

    constructor() {
        super()
        this.regionForm = this.formBuilder.group({
            region_int: [0],
        })
    }
    
    ngOnInit() {
        this.regions = [...[{ value: 0, text: ' Всички' }], ...this.staticSelectionService.Region]
    }
}
