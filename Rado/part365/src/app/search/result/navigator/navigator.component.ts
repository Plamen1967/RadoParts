import { NgClass, NgStyle } from '@angular/common'
import { Component, ElementRef, inject, OnInit, ViewChild, input, output } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { SortType } from '@model/enum/sortType.enum'
import { RadioButton } from '@model/radioButton'
import { StaticSelectionService } from '@services/staticSelection.service'
import { RadioGroupListComponent } from '../../../components/custom-controls/radioGroupList/radiogrouplist.component'

@Component({
    selector: 'app-navigator',
    templateUrl: './navigator.component.html',
    styleUrls: ['./navigator.component.css'],
    imports: [NgStyle, NgClass, FormsModule, RadioGroupListComponent],
})
export class NavigatorComponent implements OnInit {
    currentPage = input<number>(1)
    numberPages = input<number>(0)
    hasSort = input<boolean>(false)
    sortByValue = input<SortType|undefined>()
    sortBy = output<number>()
    moveToPage = output<number>()


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
    taticSelectionService: StaticSelectionService = inject(StaticSelectionService)

    calcOffset() {
        const remnainer = this.currentPage() % this.itemsPerPages
        if (remnainer === 0) {
            this.startPage = this.currentPage() - 9
            this.endPage = this.currentPage()
        } else {
            this.startPage = Math.floor(this.currentPage() / this.itemsPerPages) * this.itemsPerPages + 1
            this.endPage = Math.ceil(this.currentPage() / this.itemsPerPages) * this.itemsPerPages
        }

        if (this.endPage > this.numberPages()) this.endPage = this.numberPages()
        const arr = []
        for (let i = this.startPage; i <= this.endPage; i++) arr.push(i)
        this.arrayPages_ = arr
    }

    get arrayPages() {
        this.calcOffset()
        return this.arrayPages_
    }

    get currentPageSelected() {
        return this.currentPage()
    }

    set currentPageSelected(value: number) {
        this.calcOffset()
        this.moveToPage.emit(this.currentPage())
    }

    nextPage() {
        this.calcOffset()
        this.moveToPage.emit(this.currentPage()+1)
    }

    previousPage() {
        this.calcOffset()
        this.moveToPage.emit(this.currentPage()-1)
    }

    click(event: number) {
        this.moveToPage.emit(event)
    }
    pageChange() {
        this.moveToPage.emit(this.currentPageSelected)
    }

    sortData() {
        console.log(`SortBy: ${this.sortByValue}`)
        this.sortBy.emit(this.sortByValue()!)
        this.moveToPage.emit(1)
    }
}

