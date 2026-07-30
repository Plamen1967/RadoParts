import { Component, ChangeDetectionStrategy } from '@angular/core'
import { RouterLink } from '@angular/router'

@Component({
    imports: [RouterLink],
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./footer.component.css'],
})
export class FooterComponent {}
