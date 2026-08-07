import { Component } from '@angular/core'
import { SelectComponent } from '@components/custom-controls/select-controls/select/select.component'
import { HelperComponent } from '@components/custom-controls/helper/helper.component'
import { SelectOption } from '@model/selectOption'

@Component({
    selector: 'app-adminfilter',
    templateUrl: './adminFilter.component.html',
    styleUrls: ['./adminFilter.component.css'],
    imports: [SelectComponent],
})
export class AdminFilterComponent extends HelperComponent {
    users: SelectOption[] = []
    searchTypes: SelectOption[] = []
    approvedTypes: SelectOption[] = []
    admin = false
}
