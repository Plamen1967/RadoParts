import { NgStyle } from '@angular/common'
import { Component, ElementRef, inject, QueryList, Renderer2, ViewChildren, input, output } from '@angular/core'
import { CategorySubcategory } from '@model/category-subcategory/categorySubCategory'
import { Dropdown } from '@model/dropDown'

@Component({
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.css'],
    imports: [NgStyle],
})
export class CategoriesComponent {
    @ViewChildren('subMenu', { read: ElementRef }) subMenuChildren?: QueryList<ElementRef>
    @ViewChildren('menu', { read: ElementRef }) menuChildren?: QueryList<ElementRef>

    alreadySent?: boolean
    dropDowns = input<Dropdown[]>([])
    selection = output<CategorySubcategory>()

    element: ElementRef = inject(ElementRef)
    renderer: Renderer2 = inject(Renderer2)

    clearDisplay() {
        this.subMenuChildren?.forEach((elem) => this.renderer.removeStyle(elem.nativeElement, 'display'))
    }

    onCategoryClick(event: Event, categoryId: number) {
        this.selection.emit({ categoryId: categoryId, subcategoryId: 0 })
        this.subMenuChildren?.forEach((elem) => this.renderer.setStyle(elem.nativeElement, 'display', 'none'))
    }

    clickEvent(event: Event, subcategoryId: number) {
        event.stopPropagation()
        this.selection.emit({ categoryId: 0, subcategoryId: subcategoryId })
        this.subMenuChildren?.forEach((elem) => this.renderer.setStyle(elem.nativeElement, 'display', 'none'))
    }

    focus() {
        return
    }
}
