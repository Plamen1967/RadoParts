import { DOCUMENT } from '@angular/common'
import { Component, ElementRef, EventEmitter, Inject, OnInit, Output, QueryList, Renderer2, ViewChildren, OnDestroy, AfterViewInit, DestroyRef } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog'
import { CategorySubcategory } from '@model/category-subcategory/categorySubCategory'
import { Dropdown } from '@model/dropDown'
import { CategoryService } from '@services/category-subcategory/category.service'

@Component({
    standalone: true,
    selector: 'app-categoriesmin',
    host: {
        click: 'clickInside()',
        'document:click': 'clickout($event)',
    },
    imports: [],
    templateUrl: './categoriesMin.component.html',
    styleUrls: ['./categoriesMin.component.css'],
})
export class CategoriesMinComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChildren('sub-menu', { read: ElementRef }) subMenuChildren?: QueryList<ElementRef>
    @ViewChildren('menu', { read: ElementRef }) menuChildren?: QueryList<ElementRef>
    @Output() selection: EventEmitter<CategorySubcategory> = new EventEmitter<CategorySubcategory>()

    showCategory = true
    categories?: Dropdown[]
    wasInside = false
    currentCategory?: number
    category?: Dropdown

    constructor(
        private element: ElementRef,
        private renderer: Renderer2,
        private categoryService: CategoryService,
        private matDialog: MatDialog,
        public dialogRef: MatDialogRef<CategoriesMinComponent>,
        @Inject(DOCUMENT) private document: Document,
        @Inject(MAT_DIALOG_DATA) public data: {drowdown: Dropdown[]},
        private destroyRef: DestroyRef
    ) {}

    ngOnDestroy(): void {
        this.document.body.style.overflow = ''
    }

    ngAfterViewInit(): void {
        this.currentCategory = undefined
    }

    ngOnInit() {
        if (this.data.drowdown) {
            this.categories = [...this.data.drowdown];
        }
        else 
        this.categoryService._filtercategories.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (res) => {
                this.categories = res.map((elem) => {
                    return { name: elem.name, imageName: elem.imageName, id: elem.id, count: elem.count, children: [...elem.children] }
                })
            },
        })
    }

    close() {
        this.matDialog.closeAll()
    }

    clearDisplay() {
        this.subMenuChildren?.forEach((elem) => this.renderer.removeStyle(elem.nativeElement, 'display'))
    }

    show(value: number) {
        if (value == this.currentCategory) return true
        return false
    }

    target(value: number) {
        return '#' + value
    }

    clickInside() {
        this.wasInside = true
    }

    clickout(event: MouseEvent) {
        if (this.element.nativeElement.contains(event.target)) {
            console.log('clicked inside')
        }
    }
    onCategoryClick(categoryId: number) {
        this.currentCategory = undefined
        this.dialogRef.close({ categoryId: categoryId, subcategoryId: 0 })
        this.selection.emit({ categoryId: categoryId, subcategoryId: 0 })
    }

    get caption(): string {
        return this.showCategory ? 'Избери категория' : 'Избери подкатегория'
    }

    goBack() {
        this.dialogRef.close({ categoryId: undefined, subcategoryId: undefined })
    }

    onArrowClick(event: Event, categoryId: number) {
        event.stopPropagation()
        this.showCategory = false
        this.category = this.categories?.find((category) => category.id === categoryId)
        this.currentCategory = categoryId
        console.log(this.category)
        console.table(this.category?.children)
    }

    onClick(event: Event, subcategoryId: number) {
        event.stopPropagation()
        this.currentCategory = undefined
        this.dialogRef.close({ categoryId: 0, subcategoryId: subcategoryId })
        this.selection.emit({ categoryId: 0, subcategoryId: subcategoryId })
    }
}
