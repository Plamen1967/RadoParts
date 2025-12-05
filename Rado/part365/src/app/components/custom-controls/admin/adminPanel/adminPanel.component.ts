import { Component, DestroyRef, EventEmitter, Input, Output } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { FormsModule } from '@angular/forms'
import { PopUpServiceService } from '@app/dialog/services/popUpService.service'
import { SelectComponent } from '@components/custom-controls/select-controls/select/select.component'
import { SelectOption } from '@model/selectOption'
import { AdminService } from '@services/admin.service'
import { AuthenticationService } from '@services/authentication/authentication.service'

@Component({
    standalone: true,
    selector: 'app-adminpanel',
    templateUrl: './adminPanel.component.html',
    styleUrls: ['./adminPanel.component.css'],
    imports: [SelectComponent, FormsModule],
})
export class AdminPanelComponent {
    @Input() itemId?: number
    @Input() approvedStatus?: number
    @Output() updated = new EventEmitter<number>()
    constructor(
        private adminService: AdminService,
        private popupService: PopUpServiceService,
        public authernticationService: AuthenticationService,
        private destroyRef: DestroyRef
    ) {}

    updateApprovedStatus() {
        this.adminService
            .updateApprovedStatus(this.itemId!, this.approvedStatus!)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.popupService
                    .openWithTimeout('Съобщение', 'Обявата е успешно актуализирана')
                    .pipe(takeUntilDestroyed(this.destroyRef))
                    .subscribe(() => {
                        this.updated.emit(this.approvedStatus)
                    })
            })
    }

    approvedTypes: SelectOption[] = [
        { value: 0, text: 'Не одобренa' },
        { value: 1, text: 'Одобренa' },
        { value: 2, text: 'Блокиранa' },
    ]
    get admin() {
        return this.authernticationService.admin
    }
}
