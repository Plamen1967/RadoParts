import { Component } from '@angular/core'

@Component({
    standalone: true,
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.css'],
    imports: [],
})
export default class ContactComponent {
    email = 'info@parts365.bg'
    href = `mailto:${this.email}?subject=Запитване`

    goBack() {
        history.back()
    }
}
