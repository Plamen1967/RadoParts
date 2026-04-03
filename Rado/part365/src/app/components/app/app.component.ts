import { NgClass } from '@angular/common'
import { Component, OnDestroy, ViewChild, inject, signal } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Router, RouterOutlet } from '@angular/router'
import { NavMenuComponent } from '@app/menu/navMenu/navMenu.component'
import { FooterComponent } from '@components/header-footer/footer/footer.component'
import { AuthenticationService } from '@services/authentication/authentication.service'
import { LoggerService } from '@services/authentication/logger.service'
import { PathService } from '@services/path.service'
import { RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common'
import { UserCountService } from '@services/userCount.service'
import { MatListModule } from '@angular/material/list'
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MediaMatcher } from '@angular/cdk/layout'
import { MenuService } from '@services/Menu.service'
import { effect } from '@angular/core'
import { CONSTANT } from '@app/constant/globalLabels'
import { LocalStorageService } from '@services/storage/localStorage.service'
import { UserCount } from '@model/userCount'
import { Observable } from 'rxjs'
import { CarService } from '@services/car.service'
import { PartServiceService } from '@services/part/partService.service'
import { ConfirmServiceService } from '@app/dialog/services/confirmService.service'
import { OKCancelOption } from '@app/dialog/model/confirmDialogData'
import { OutsideDirective } from '@app/directive/outside.directive'

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, FooterComponent, OutsideDirective, NavMenuComponent, NgClass, RouterModule, CommonModule, MatIconModule, MatToolbarModule, MatButtonModule, MatIconModule, MatSidenavModule, MatListModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent implements OnDestroy {
toggleMenu(event: Event) {
    event.stopPropagation()
    event.preventDefault()
    this.menuService.showMenu.set(!this.menuService.showMenu())
}
    userCount$: Observable<UserCount | undefined>
    title = 'part365'
    opened = false
    protected readonly fillerNav = Array.from({ length: 50 }, (_, i) => `Nav Item ${i + 1}`)
    protected readonly isMobile = signal(true)
    public menuService: MenuService
    private readonly _mobileQuery: MediaQueryList
    private readonly _mobileQueryListener: () => void
    @ViewChild('snav') snav?: MatSidenav
    private dialog: MatDialog
    private pathService: PathService
    private userService: UserCountService
    private loggerService: LoggerService
    public authenticationService: AuthenticationService
    private localStorage: LocalStorageService
    private router: Router
    private carService: CarService
    private partService: PartServiceService
    private confirmService: ConfirmServiceService
    private userCountService: UserCountService

    showMenu = false
    constructor() {
        this.dialog = inject(MatDialog)
        this.pathService = inject(PathService)
        this.userService = inject(UserCountService)
        this.loggerService = inject(LoggerService)
        this.authenticationService = inject(AuthenticationService)
        this.localStorage = inject(LocalStorageService)
        this.router = inject(Router)
        this.carService = inject(CarService)
        this.partService = inject(PartServiceService)
        this.confirmService = inject(ConfirmServiceService)
        this.userCountService = inject(UserCountService)
        this.menuService = inject(MenuService)
        this.menuService.showMenu.set(false)
        if (this.authenticationService.currentToken) {
            this.authenticationService.validateToken().subscribe({
                next: () => {
                    this.userService.refresh()
                    return
                },
                error: (error: string) => {
                    this.authenticationService.logout()
                    console.log(error)
                },
            })
        }

        effect(() => {
            console.log('toggle test')
            if (this.menuService.showMenu()) {
                this.snav?.toggle(this.menuService.showMenu())
            } else {
                this.snav?.toggle(this.menuService.showMenu())
            }

            this.showMenu = this.menuService.showMenu()
            console.log(this.showMenu)
        })

        this.userCount$ = this.userCountService.userCount$
        const link = document.createElement('meta')
        link.setAttribute('name', 'viewport')
        link.setAttribute('content', 'width=device-width, initial-scale=1.0')
        document.getElementsByTagName('head')[0].appendChild(link)
        const media = inject(MediaMatcher)

        this._mobileQuery = media.matchMedia('(max-width: 0px)')
        this.isMobile.set(this._mobileQuery.matches)
        this._mobileQueryListener = () => this.isMobile.set(this._mobileQuery.matches)
        this._mobileQuery.addEventListener('change', this._mobileQueryListener)
    }

    get dealerWebaPage() {
        if (this.pathService.userPage) return true
        return false
    }
    get count() {
        return this.localStorage.items;
    }

    ngOnDestroy(): void {
        this._mobileQuery.removeEventListener('change', this._mobileQueryListener)
    }
    get checkout() {
        return `${CONSTANT.SAVED}`
    }

    get savedItemCount() {
        return this.localStorage.items
    }
    get logged() {
        return this.authenticationService.logged
    }

    get seller() {
        return this.authenticationService.seller
    }

    get admin() {
        return this.authenticationService.admin
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onActivate(e: unknown, outlet: any) {
        outlet.scrollTop = 0
    }

    bus() {
        this.router.navigate(['/data/bus'])
        this.carService.resetCurrentId()
    }
    cars() {
        this.router.navigate(['/data/cars'])
        this.carService.resetCurrentId()
    }
    parts() {
        this.router.navigate(['/data/parts'])
        this.partService.resetCurrentId()
    }
    rims() {
        this.router.navigate(['/data/rims'])
        this.carService.resetCurrentId()
    }
    tyres() {
        this.router.navigate(['/data/tyres'])
        this.carService.resetCurrentId()
    }
    rimWithTyre() {
        this.router.navigate(['/data/rimWithtyres'])
        this.carService.resetCurrentId()
    }
    menuShow() {
        console.log('toggle menu clicked')
        this.menuService.showMenu.set(!this.menuService.showMenu())
    }
    get labels() {
        return CONSTANT
    }

    get exitName() {
        return this.authenticationService.currentUserValue?.userName
    }

    logout() {
        this.confirmService.OKCancel('Съобщение', 'Потвърдете, че искате да се излезете').subscribe((result) => {
            if (result === OKCancelOption.OK) {
                this.authenticationService.logout()
                this.router.navigate(['/'])
            }
        })
    }
    updatePassword() {
        throw 'TODO'
        //    this.modalService.open("passwordDialog");
    }
    messages() {
        this.router.navigate(['/messages'])
    }

    details() {
        this.router.navigate(['/user/userdetails'])
    }

    // onActivate(, outlet){
    // outlet.scrollTop = 0;) {

    //     // window.scroll({
    //     //         top: 0,
    //     //         left: 0,
    //     //         behavior: 'smooth'
    //     //     });
    //     document.querySelector('body')?.scrollTo(0,0)
    //     console.log('activate');
    //     //document.body.scrollTop = 0;
    //     // const scrollToTop = window.setInterval(() => {
    //     //     const pos = window.pageYOffset
    //     //     if (pos > 0) {
    //     //         window.scrollTo(0, pos - 20) // how far to scroll on each step
    //     //     } else {
    //     //         window.clearInterval(scrollToTop)
    //     //     }
    //     // }, 16)
    // }
}
