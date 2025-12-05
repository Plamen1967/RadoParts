import { NgClass, NgStyle } from '@angular/common'
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { SortType } from '@model/enum/sortType.enum'
import { RadioButton } from '@model/radioButton'
import { StaticSelectionService } from '@services/staticSelection.service'
import { RadioGroupListComponent } from '../../custom-controls/radioGroupList/radiogrouplist.component'

@Component({
    standalone: true,
    selector: 'app-navigator',
    templateUrl: './navigator.component.html',
    styleUrls: ['./navigator.component.css'],
    imports: [NgStyle, NgClass, FormsModule, RadioGroupListComponent],
})
export class NavigatorComponent implements OnInit {
    @Input() currentPage = 1
    @Input() numberPages = 0
    @Input() hasSort = false
    @Input() sortByValue?: SortType

    @Output() sortBy: EventEmitter<number> = new EventEmitter<number>()
    @Output() moveToPage: EventEmitter<number> = new EventEmitter<number>()
    @ViewChild('previousButton') set inputElRef(elRef: ElementRef<HTMLInputElement>) {
        if (elRef) {
            this.previousButton = elRef
        }
    }

    ngOnInit() {
        this.calcOffset()
        this.pages = [...Array(this.numberPages).keys()]
        
    }

    radios: RadioButton[] = [
        { label: 'Цена', id: SortType.PriceAsc },
        { label: 'Година', id: SortType.YearDesc },
        { label: 'Най-нови обяви', id: SortType.modifiedTimeDesc },
    ]

    fromPage?: number
    toPage?: number
    offSet?: number = 0
    itemsPerPages = 10
    startPage?: number = 1
    endPage?: number = 1
    arrayPages_: number[] = []
    pages: number[] = []
    previousButton?: ElementRef<HTMLInputElement>


    constructor(public staticSelectionService: StaticSelectionService) {}

    calcOffset() {
        const remnainer = this.currentPage % this.itemsPerPages;
        if (remnainer === 0) {
            this.startPage = this.currentPage - 9
            this.endPage = this.currentPage
        } else {
            this.startPage = Math.floor(this.currentPage / this.itemsPerPages) * this.itemsPerPages + 1
            this.endPage = Math.ceil(this.currentPage / this.itemsPerPages) * this.itemsPerPages
        }

        if (this.endPage > this.numberPages) this.endPage = this.numberPages
        const arr = []
        for (let i = this.startPage; i <= this.endPage; i++) arr.push(i)
        this.arrayPages_ = arr
    }

    get arrayPages() {
            this.calcOffset()
        return this.arrayPages_
    }

    get currentPageSelected() {
        return this.currentPage
    }

    set currentPageSelected(value: number) {
        this.currentPage = value
        this.calcOffset()
        this.moveToPage.emit(this.currentPage)
    }

    nextPage() {
        this.currentPage++
        this.calcOffset()
        this.moveToPage.emit(this.currentPage)
    }

    previousPage() {
        this.currentPage--
        this.calcOffset()
        this.moveToPage.emit(this.currentPage)
    }

    click(event: number) {
        this.currentPage = event
        this.moveToPage.emit(this.currentPage)
    }
    pageChange() {
        this.currentPage = this.currentPageSelected
        this.moveToPage.emit(this.currentPage)
    }

    sortData() {
        console.log(`SortBy: ${this.sortByValue}`)
        this.sortBy.emit(this.sortByValue)
        this.currentPage = 1
        this.moveToPage.emit(this.currentPage)
    }

    focusPreviousButton() {
        //    this.previousButton?.nativeElement.focus();
    }
}
