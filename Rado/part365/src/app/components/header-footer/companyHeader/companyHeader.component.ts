import { Component, Input, ChangeDetectionStrategy } from '@angular/core'
import { RouterLink } from '@angular/router'

@Component({
    selector: 'app-companyheader',
    imports: [RouterLink],
    templateUrl: './companyHeader.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./companyHeader.component.css'],
})
export class CompanyHeaderComponent {
    @Input() userCompanyName: string | undefined
}
