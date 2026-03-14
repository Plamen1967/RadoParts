import { NgClass } from '@angular/common'
import { Component, OnDestroy, ViewChild, inject, signal } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { RouterOutlet } from '@angular/router'
import { NavMenuComponent } from '@app/menu/navMenu/navMenu.component'
import { FooterComponent } from '@components/header-footer/footer/footer.component'
import { AuthenticationService } from '@services/authentication/authentication.service'
import { LoggerService } from '@services/authentication/logger.service'
import { PathService } from '@services/path.service'
import { RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common'
import { UserCountService } from '@services/userCount.service'
import {MatListModule} from '@angular/material/list';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MediaMatcher} from '@angular/cdk/layout';
import { MenuService } from '@services/Menu.service';
import { effect, untracked } from '@angular/core';
import { CONSTANT } from '@app/constant/globalLabels'
import { LocalStorageService } from '@services/storage/localStorage.service'


@Component({
    selector: 'app-root',
    imports: [RouterOutlet, FooterComponent, NavMenuComponent, NgClass, RouterModule, CommonModule,MatIconModule, MatToolbarModule, MatButtonModule, MatIconModule, MatSidenavModule, MatListModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnDestroy  {
toggleMenu() {
this.menuService.showMenu.set(false);
}
    title = 'part365'
    opened = false
     protected readonly fillerNav = Array.from({length: 50}, (_, i) => `Nav Item ${i + 1}`);
  protected readonly isMobile = signal(true);
    public menuService: MenuService;
  private readonly _mobileQuery: MediaQueryList;
  private readonly _mobileQueryListener: () => void;
    @ViewChild('snav') snav: any;
    constructor(
        private dialog: MatDialog,
        private pathService: PathService,
        private userService: UserCountService,
        private loggerService: LoggerService,
        public authenticationService: AuthenticationService,
        private localStorage: LocalStorageService,

    ) {
        this.menuService = inject(MenuService);
        if (authenticationService.currentToken) {
            this.authenticationService.validateToken().subscribe({
                next: () => {
                    this.userService.refresh()
                    return
                },
                error: (error: string) => {
                    authenticationService.logout()
                    console.log(error)
                },
            })
        }

        effect(() => {
            const showMenu = this.menuService.showMenu()
            untracked(() => this.snav.toggle())
            console.log('toggle test')
        })

        const link = document.createElement('meta')
        link.setAttribute('name', 'viewport')
        link.setAttribute('content', 'width=device-width, initial-scale=1.0')
        document.getElementsByTagName('head')[0].appendChild(link)
        const media = inject(MediaMatcher);

        this._mobileQuery = media.matchMedia('(max-width: 0px)');
        this.isMobile.set(this._mobileQuery.matches);
        this._mobileQueryListener = () => this.isMobile.set(this._mobileQuery.matches);
        this._mobileQuery.addEventListener('change', this._mobileQueryListener);        
    }

    get dealerWebaPage() {
        if (this.pathService.userPage) return true
        return false
    }
    get count() {
        return this.localStorage.items
    }

  ngOnDestroy(): void {
    this._mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }
    get checkout() {
        return `${CONSTANT.SAVED} ${this.localStorage.items}`
    }


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onActivate(e: unknown, outlet: any) {
        outlet.scrollTop = 0
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
