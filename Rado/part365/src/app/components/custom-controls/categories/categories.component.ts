import { NgStyle } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, QueryList, Renderer2, ViewChildren } from '@angular/core';
import { CategorySubcategory } from '@model/category-subcategory/categorySubCategory';
import { Dropdown } from '@model/dropDown';


@Component({
  standalone: true,
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
  imports: [NgStyle]
})
export class CategoriesComponent {

  @ViewChildren('subMenu', {read: ElementRef}) subMenuChildren?: QueryList<ElementRef>
  @ViewChildren('menu', {read: ElementRef}) menuChildren?: QueryList<ElementRef>

  alreadySent?: boolean;
  @Input() dropDowns : Dropdown[] = [];
  @Output() selection : EventEmitter<CategorySubcategory> = new EventEmitter<CategorySubcategory>()

  constructor(private element: ElementRef, 
    private renderer: Renderer2) { }


  clearDisplay() {
    this.subMenuChildren?.forEach((elem) => this.renderer.removeStyle(elem.nativeElement, "display"));
  }

  onCategoryClick(event: Event, categoryId: number) {
    this.selection.emit({categoryId:categoryId, subcategoryId:0});
    this.subMenuChildren?.forEach((elem) => this.renderer.setStyle(elem.nativeElement, "display", "none",));
  }

  onClick(event: Event, subcategoryId: number) {
    event.stopPropagation()
    this.selection.emit({categoryId:0, subcategoryId:subcategoryId});
    this.subMenuChildren?.forEach((elem) => this.renderer.setStyle(elem.nativeElement, "display", "none",));
  }

  focus() {return }
}
