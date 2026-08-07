//#region Imports
import { Component, DestroyRef, inject, input, output } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { FormsModule } from '@angular/forms'
import { PopUpService } from '@app/dialog/services/popUpService.service'
import { SelectComponent } from '@components/custom-controls/select-controls/select/select.component'
import { SelectOption } from '@model/selectOption'
import { AdminService } from '@app/admin/services/admin.service'
import { AuthenticationService } from '@services/authentication/authentication.service'
//#endregion
//#region Component
@Component({
    selector: 'app-adminpanel',
    templateUrl: './adminPanel.component.html',
    styleUrls: ['./adminPanel.component.css'],
    imports: [SelectComponent, FormsModule],
})
//#endregion
export class AdminPanelComponent {
    //#region variables and services
    itemId = input<number | undefined>()
    approvedStatus = input<number | undefined>()
    updated = output<number>()
    //#region services
    private adminService: AdminService = inject(AdminService)
    private popupService: PopUpService = inject(PopUpService)
    public authernticationService: AuthenticationService = inject(AuthenticationService)
    private destroyRef: DestroyRef = inject(DestroyRef)
    //#endregion
    //#endregion

    updateApprovedStatus() {
        if (this.itemId == null || this.approvedStatus == null) {
            return
        }

        this.adminService
            .updateApprovedStatus(this.itemId()!, this.approvedStatus()!)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.popupService
                    .openWithTimeout('Съобщение', 'Обявата е успешно актуализирана')
                    .pipe(takeUntilDestroyed(this.destroyRef))
                    .subscribe(() => {
                        this.updated.emit(this.approvedStatus()!)
                    })
            })
    }

    approvedTypes: SelectOption[] = [
        { value: 0, text: 'Не одобренa' },
        { value: 1, text: 'Одобренa' },
        { value: 2, text: 'Блокиранa' },
    ]
}
