import { Component, DestroyRef, Input } from '@angular/core'
import { Router } from '@angular/router'
import { HelperComponent } from '@components/custom-controls/helper/helper.component'
import { DisplayPartView } from '@model/displayPartView'
import { HomeService } from '@services/home.service'
import { LoadingService } from '@services/loading.service'
import { SearchPartService } from '@services/searchPart.service'
import { StaticSelectionService } from '@services/staticSelection.service'
import { PhoneComponent } from '../phone/phone.component'
import { DataRowComponent } from '../dataRow/dataRow.component'
import { ViberComponent } from '../viber/viber.component'
import { WhatsComponent } from '../whats/whats.component'
import { isMobile } from '@app/functions/functions'
import { ConfirmServiceService } from '@app/dialog/services/confirmService.service'
import { UserService } from '@services/user.service'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'

@Component({
    standalone: true,
    selector: 'app-usercard',
    templateUrl: './userCard.component.html',
    styleUrls: ['./userCard.component.css'],
    imports: [PhoneComponent, DataRowComponent, ViberComponent, WhatsComponent],
})
export class UserCardComponent extends HelperComponent {
    @Input() set viewItem(value: DisplayPartView) {
        this.viewItem_ = value
        this.region = this.staticService.Region.find((x) => x.value === this.viewItem_?.regionId)?.text
        if (this.viewItem_.regionId) {
            if (value.sellerCity) {
                if (value.sellerCity != this.region) this.city = value.sellerCity + ' , ' + this.region
            } else this.city = this.region
        } else if (value.sellerCity)
            if (this.region) {
                if (value.sellerCity != this.region) this.city = this.city + ' , ' + this.region
            } else this.city = value.sellerCity

        this.sellerName = value.sellerName
        this.sellerWebPage = value.sellerWebPage ?? `/dealerwebpage?userId=${this.viewItem?.userId}`

        const _phones = []
        if (this.viewItem_.sellerPhone) _phones.push(this.viewItem_.sellerPhone)
        if (this.viewItem_.sellerPhone2) _phones.push(this.viewItem_.sellerPhone2)
        this.phones = _phones.join(' ')

        this.phone1 = this.viewItem_.sellerPhone
        this.phone2 = this.viewItem_.sellerPhone2
        this.viber = this.viewItem_.sellerViber
        this.whats = this.viewItem_.sellerWhats
        this.isMobile = isMobile()
        this.sellerLogo = this.viewItem_.sellerLogo
        console.log(` ${this.sellerLogo}`)
    }

    userImage?: string
    isMobile?: boolean
    phone2?: string
    sellerLogo?: string
    viber?: string
    whats?: string
    phone1?: string
    viewItem_?: DisplayPartView
    city?: string
    phones?: string
    region?: string
    sellerName?: string
    sellerWebPage?: string
    constructor(
        private staticService: StaticSelectionService,
        private router: Router,
        private homeService: HomeService,
        public loadingService: LoadingService,
        public searchPartService: SearchPartService,
        public confirmationService: ConfirmServiceService,
        public userService: UserService,
        private destroyRef: DestroyRef
    ) {
        super()
    }

    dealerClicked() {
        if (!this.viewItem?.userId) return
        this.loadingService.open('Зареждане на дилърската уебстраница')
        this.userService
            .getUserById(this.viewItem?.userId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (user) => {
                    if (user.webPage) this.router.navigate([user.webPage])
                    else this.router.navigate(['/dealerwebpage'], { queryParams: { userId: this.viewItem?.userId } })
                },
                error: (error) => {
                    console.log(error)
                },
                complete: () => {
                    this.loadingService.close()
                },
            })
    }
}
