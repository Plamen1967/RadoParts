import { Component, input } from '@angular/core'
import { RouterLink } from '@angular/router'

@Component({
    selector: 'app-companyheader',
    imports: [RouterLink],
    templateUrl: './companyHeader.component.html',
    styleUrls: ['./companyHeader.component.css'],
})
export class CompanyHeaderComponent {
    userCompanyName = input<string | undefined>()
}
