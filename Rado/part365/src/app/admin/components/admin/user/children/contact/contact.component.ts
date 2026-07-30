//#region
import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core'
import { DealerWebPageComponent } from '@app/user/dealerWebPage/dealerWebPage.component'
import { UserHeaderComponent } from '@app/user/userHeader/userHeader.component'
import { User } from '@model/user'
import { UserService } from '@services/user.service'
//#endregion
//#region component
@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [UserHeaderComponent],
})
//#endregion
export default class ContactComponent implements OnInit {
    //#region variables and services
    private userService = inject(UserService)
    public parent = inject(DealerWebPageComponent, { optional: true })
    user?: User = this.parent?.user
    //#endregion
    ngOnInit() {
        console.log(this.user)
        return
    }
}
