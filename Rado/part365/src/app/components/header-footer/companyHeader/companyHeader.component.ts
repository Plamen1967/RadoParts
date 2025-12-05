import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-companyheader',
  imports: [RouterLink],
  templateUrl: './companyHeader.component.html',
  styleUrls: ['./companyHeader.component.css']
})
export class CompanyHeaderComponent {
@Input() userCompanyName: string | undefined;
}
