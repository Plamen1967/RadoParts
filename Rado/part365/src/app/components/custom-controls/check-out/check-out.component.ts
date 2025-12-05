import { Component, DestroyRef, EventEmitter, OnInit, Output } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { FormBuilder, FormGroup } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { OKCancelOption } from '@app/dialog/model/confirmDialogData'
import { ConfirmServiceService } from '@app/dialog/services/confirmService.service'
import { goToPosition } from '@app/functions/functions'
import { HelperComponent } from '@components/custom-controls/helper/helper.component'
import { UserViewPartComponent } from '@components/parts/userViewPart/userViewPart.component'
import { DisplayPartComponent } from '@components/result/displayPart/displayPart.component'
import { ActionType } from '@model/actionType'
import { DisplayPartView } from '@model/displayPartView'
import { UpdateEnum } from '@model/enum/update.enum'
import { LoggerService } from '@services/authentication/logger.service'
import { CheckOutService } from '@services/checkOut.service'
import { StaticSelectionService } from '@services/staticSelection.service'
import { LocalStorageService } from '@services/storage/localStorage.service'
import { noop } from 'rxjs'

@Component({
    standalone: true,
    selector: 'app-check-out',
    templateUrl: './check-out.component.html',
    styleUrls: ['./check-out.component.css'],
    imports: [DisplayPartComponent, UserViewPartComponent],
})
export class CheckOutComponent extends HelperComponent implements OnInit {
    parts?: DisplayPartView[]
    checkoutItems?: number[]
    checkoutForm: FormGroup
    currentId?: number
    selectedPart?: number
    selectedCar?: number
    loading = false
    id?: string| number;
    mode: UpdateEnum = UpdateEnum.View
    heigligthed?: number|string

    @Output() backEvent: EventEmitter<void> = new EventEmitter<void>()
    constructor(
        private checkoutService: CheckOutService,
        formBulder: FormBuilder,
        public activeRoute: ActivatedRoute,
        public staticSelectionService: StaticSelectionService,
        private router: Router,
        private confirmService: ConfirmServiceService,
        public localStorageService: LocalStorageService,
        public loggerService: LoggerService,
        private destroyRef: DestroyRef
    ) {
        super()

        this.checkoutForm = formBulder.group({})
        activeRoute.queryParams.subscribe((d) => {
            this.id = +d['id']
        })
    }

    ngOnInit() {
        this.update()
        this.activeRoute.queryParams.subscribe((params) => {
            this.heigligthed = params['currentId'];
            if (this.heigligthed)
                goToPosition(this.heigligthed)
        })
    }

    update() {
        this.loading = true
        this.checkoutService
            .getCheckoutItems()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res) => {
                    this.parts = res
                    this.loading = false

                    const existing = res.map((part) => part.id)
                    const notExisting = this.checkoutItems?.filter((checkoutItemId) => existing.findIndex((id) => id === checkoutItemId) === -1)
                    if (notExisting && notExisting.length) notExisting.forEach((id) => this.localStorageService.removeSavedItem(id))
                    goToPosition(this.id!);
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
        const index = this.parts?.findIndex((part) => part.id === id)
        if (index && index != -1) this.parts?.splice(index, 1)
    }

    back() {
        this.backEvent.emit()
        this.router.navigate([`/checkout`], { queryParams: { currentId: `${this.currentId}`} })
        goToPosition(this.currentId!)

        this.currentId = 0
    }

    viewCar(id: number) {
        this.router.navigate([`/viewPart`], { queryParams: { id: `${id}`, favourite: '1' } })
    }

    viewPart(id: number) {
        this.router.navigate([`/viewPart`], { queryParams: { id: `${id}`, favourite: '1' } })
    }

    action(actionType: ActionType) {
        this.currentId = actionType.dispayPartView?.id
        this.router.navigate([`/checkout`], { queryParams: { id: `${this.currentId}`} })

        // this.checkoutService.currentId = this.currentId
        // if (actionType.dispayPartView?.isCar) {
        //     this.viewCar(this.currentId!)
        // } else {
        //     this.viewPart(this.currentId!)
        // }
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
        this.router.navigate(['/'])
    }

}
