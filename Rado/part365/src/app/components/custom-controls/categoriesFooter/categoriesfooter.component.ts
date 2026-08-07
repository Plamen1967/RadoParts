import { Component, input, output } from '@angular/core'
import { Dropdown } from '@model/dropDown'

@Component({
    selector: 'app-categoriesfooter',
    templateUrl: './categoriesfooter.component.html',
    styleUrls: ['./categoriesfooter.component.scss'],
    imports: [],
})
export class CategoriesFooterComponent {
    categories = input<Dropdown[]>()
    hideFilter = input<boolean>(false)

    categoryClick = output<number>()

    categoryMessage(name?: string) {
        const message: string = name?.split('-').join(' ') ?? ''
        return `${message.toLowerCase()}`
    }
    categorySelected(categoryId: number) {
        this.categoryClick.emit(categoryId)
    }
}
