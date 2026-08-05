//#region
import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core'
import { User } from '@model/user'
import { UserService } from '@services/user.service'
import { UserHeaderComponent } from '../../userHeader/userHeader.component'
import { DealerWebPageComponent } from '../../dealerWebPage/dealerWebPage.component'
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
