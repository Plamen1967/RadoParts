import { NgClass } from '@angular/common'
import { Component, HostListener, inject, OnInit, input, effect, output } from '@angular/core'
import { ToastService } from '@services/dialog-api/ToastService/toast.service'
import { LocalStorageService } from '@services/storage/localStorage.service'

@Component({
    selector: 'app-favourite',
    templateUrl: './favourite.component.html',
    styleUrls: ['./favourite.component.css'],
    imports: [NgClass],
})
export class FavouriteComponent implements OnInit {
    @HostListener('click', ['$event'])
    private localStorageService: LocalStorageService = inject(LocalStorageService)
    private toastService: ToastService = inject(ToastService)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    click(event: any) {
        event.stopPropagation()
    }

    positionEnd = input<number>(1)
    id = input<number | undefined>() 

    unchecked = output<number>()
    isSaved?: boolean


    constructor() {
        effect(() => {

            if (this.id()) {
                this.isSaved = this.localStorageService.isSaved(this.id()!)
            }
        })
    }

    ngOnInit() {
        this.isSaved = this.localStorageService.isSaved(this.id()!)
    }

    unsave() {
        this.localStorageService.removeSavedItem(this.id()!)
        this.unchecked.emit(this.id()!)
        this.isSaved = this.localStorageService.isSaved(this.id()!)
    }

    save() {
        const countSaveItems = this.localStorageService.getSavedItems().length
        if (countSaveItems >= 10) {
            this.toastService.show('Може да запазите максимум 10 обяви')
            return
        }

        this.localStorageService.addSavedItem(this.id()!)
        this.isSaved = this.localStorageService.isSaved(this.id()!)
    }
}
