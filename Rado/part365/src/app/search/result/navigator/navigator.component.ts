import { NgClass, NgStyle } from '@angular/common'
import { Component, ElementRef, computed, inject, OnInit, ViewChild, input, output, effect } from '@angular/core'
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

    currentPage_! : number

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

    constructor() {
        effect(() =>
        {
            this.currentPage_ = computed(() => this.currentPage())();
        })
    }
    calcOffset() {
        const remnainer = this.currentPage_ % this.itemsPerPages
        if (remnainer === 0) {
            this.startPage = this.currentPage_ - 9
            this.endPage = this.currentPage_
        } else {
            this.startPage = Math.floor(this.currentPage_ / this.itemsPerPages) * this.itemsPerPages + 1
            this.endPage = Math.ceil(this.currentPage_ / this.itemsPerPages) * this.itemsPerPages
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
        return this.currentPage_
    }

    set currentPageSelected(value: number) {
        this.currentPage_ = value
        this.calcOffset()
        this.moveToPage.emit(this.currentPage_)
    }

    nextPage() {
        this.currentPage_ = this.currentPage_ + 1
        this.calcOffset()
        this.moveToPage.emit(this.currentPage_)
    }

    previousPage() {
        this.currentPage_ = this.currentPage_ - 1
        this.calcOffset()
        this.moveToPage.emit(this.currentPage_)
    }

    click(event: number) {
        this.currentPage_ = event
        this.moveToPage.emit(this.currentPage_)
    }
    pageChange() {
        this.currentPage_  = this.currentPageSelected 
        this.moveToPage.emit(this.currentPage_)
    }

    sortData() {
        console.log(`SortBy: ${this.sortByValue}`)
        this.sortBy.emit(this.sortByValue()!)
        this.currentPage_ = 1 
        this.moveToPage.emit(this.currentPage_)
    }
}

