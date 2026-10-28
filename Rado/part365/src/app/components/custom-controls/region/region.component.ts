import { Component, inject, OnInit, model } from '@angular/core'
import { SelectComponent } from '../select-controls/select/select.component'
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { ErrorService } from '@services/error.service'
import { SelectOption } from '@model/selectOption'
import { StaticSelectionService } from '@services/staticSelection.service'
import { HelperComponent } from '../helper/helper.component'
import { FormValueControl } from '@angular/forms/signals'
import { MatTooltipModule, TooltipPosition } from '@angular/material/tooltip'

@Component({
    selector: 'app-region',
    templateUrl: './region.component.html',
    styleUrls: ['./region.component.css'],
    imports: [SelectComponent, ReactiveFormsModule, MatTooltipModule],
})
export class RegionComponent extends HelperComponent implements FormValueControl<number>, OnInit {
    valueChanged($event: number | undefined) {
        this.value.set($event ?? 0)
    }
    isDisabled = false
    regionForm: FormGroup
    regions: SelectOption[] = []
    value = model<number>(0)
    positionOptions: TooltipPosition[] = ['below', 'above', 'left', 'right'];

    public staticSelectionService: StaticSelectionService = inject(StaticSelectionService)
    public errorService: ErrorService = inject(ErrorService)
    formBuilder: FormBuilder = inject(FormBuilder)

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
