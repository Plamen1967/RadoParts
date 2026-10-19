import { Component, DestroyRef, effect, inject, input, OnInit, output, signal } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { FormBuilder, FormGroup } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { OKCancelOption } from '@app/dialog/model/confirmDialogData'
import { ConfirmServiceService } from '@app/dialog/services/confirmService.service'
import { goToPosition } from '@app/functions/functions'
import { HelperComponent } from '@components/custom-controls/helper/helper.component'
import { UserViewPartComponent } from '@app/search/userView/userViewPart.component'
import { DisplayPartComponent } from '@app/search/result/displayPart/displayPart.component'
import { ActionType } from '@model/actionType'
import { DisplayPartView } from '@model/displayPartView'
import { UpdateEnum } from '@model/enum/update.enum'
import { LoggerService } from '@services/authentication/logger.service'
import { CheckOutService } from '@services/checkOut.service'
import { StaticSelectionService } from '@services/staticSelection.service'
import { LocalStorageService } from '@services/storage/localStorage.service'
import { noop } from 'rxjs'

@Component({
    selector: 'app-check-out',
    templateUrl: './check-out.component.html',
    styleUrls: ['./check-out.component.css'],
    imports: [DisplayPartComponent, UserViewPartComponent],
})
export class CheckOutComponent extends HelperComponent implements OnInit {
    parts = signal<DisplayPartView[]>([])
    checkoutItems?: number[]
    checkoutForm: FormGroup
    currentId = input<number>()
    selectedPart?: number
    selectedCar?: number
    loading = signal<boolean>(false)
    mode: UpdateEnum = UpdateEnum.View
    heigligthed?: number | string
    checkoutService: CheckOutService = inject(CheckOutService)
    formBulder: FormBuilder = inject(FormBuilder)
    activeRoute: ActivatedRoute = inject(ActivatedRoute)
    staticSelectionService: StaticSelectionService = inject(StaticSelectionService)
    router: Router = inject(Router)
    confirmService: ConfirmServiceService = inject(ConfirmServiceService)
    localStorageService: LocalStorageService = inject(LocalStorageService)
    loggerService: LoggerService = inject(LoggerService)
    destroyRef: DestroyRef = inject(DestroyRef)
    id = input<number>()
    viewId = input<number>()
    backEvent = output<void>()
    constructor() {
        super()
        this.checkoutForm = this.formBulder.group({})
        effect(() => {
            console.log(this.parts())
        })

        effect(() => {
            console.log(`View Id: ${this.viewId()}`)
        })

        effect(() => {
            goToPosition(this.currentId())
        })
    }

    ngOnInit() {
        this.update()
    }

    update() {
        this.loading.set(true)
        this.localStorageService
            .getCheckoutItems()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res) => {
                    this.parts.set(res)
                    this.loading.set(false)

                    const existing = res.map((part) => part.id)
                    const notExisting = this.checkoutItems?.filter((checkoutItemId) => existing.findIndex((id) => id === checkoutItemId) === -1)
                    if (notExisting && notExisting.length) notExisting.forEach((id) => this.localStorageService.removeSavedItem(id))
                    goToPosition(this.id())
                },
                error: (err) => {
                    this.loggerService.logError(err)
                },
                complete() {
                    noop()
                },
            })
    }

    unchecked(id: number) {
        const index = this.parts().findIndex((part) => part.id === id)
        if (index && index != -1) this.parts.set(this.parts().splice(index, 1))
    }

    back(id: number) {
        this.backEvent.emit()
        this.router.navigate([`/checkout`], { queryParams: { currentId: `${id}` } })
        goToPosition(this.currentId())
    }

    viewCar(id: number) {
        this.router.navigate([`/viewPart`], { queryParams: { id: `${id}`, favourite: '1' } })
    }

    viewPart(id: number) {
        this.router.navigate([`/viewPart`], { queryParams: { id: `${id}`, favourite: '1' } })
    }

    action(actionType: ActionType) {
        this.router.navigate([`/checkout`], { queryParams: { viewId: `${actionType.dispayPartView?.id}` } })

        // this.checkoutService.currentId = this.currentId
        // if (actionType.dispayPartView?.isCar) {
        //     this.viewCar(this.currentId!)
        // } else {
        //     this.viewPart(this.currentId!)
        // }
    }

    goback() {
        history.back()
    }

    clear() {
        this.confirmService
            .OKCancel('Съобщение', 'Моля потвърдете изчистването на запазените')
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((result) => {
                if (result === OKCancelOption.OK) this.onclearOk()
            })
    }

    onclearOk() {
        this.localStorageService.clear()
        this.checkoutItems = this.localStorageService.checkOutItems

        this.update()
        history.back()
    }
}
